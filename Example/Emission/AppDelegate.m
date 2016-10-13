#import "AppDelegate.h"
#import "ARDefaults.h"

#import "EigenLikeNavigationController.h"
#import "ARRootViewController.h"
#import "UnroutedViewController.h"

#import <Emission/AREmission.h>
#import <Emission/ARTemporaryAPIModule.h>
#import <Emission/ARSwitchBoardModule.h>
#import <Emission/AREventsModule.h>

#import "ARStorybookComponentViewController.h"
#import <Emission/ARArtistComponentViewController.h>
#import <Emission/ARHomeComponentViewController.h>

#import <React/RCTUtils.h>
#import <TargetConditionals.h>

#import <Artsy+Authentication/ArtsyAuthentication.h>
#import <Artsy+Authentication/ArtsyAuthenticationRouter.h>
#import <Artsy+Authentication/ArtsyToken.h>
#import <Extraction/ARSpinner.h>
#import <SAMKeychain/SAMKeychain.h>

#ifdef DEPLOY
#import <AppHub/AppHub.h>
#endif

// Disable this to force using the release JS bundle, note that you should really do so by running a Release build.
//
// To do this, hold down the alt key when clicking the run button and select the Release configuration. Remember to
// change this back afterwards.
//
#if TARGET_OS_SIMULATOR && defined(DEBUG)
#define ENABLE_DEV_MODE
#endif

static BOOL
randomBOOL(void)
{
  return rand() % 2 == 1;
}

@interface AppDelegate ()
@property (nonatomic, strong) UINavigationController *navigationController;
@property (nonatomic, strong) UIViewController *authenticationSpinnerController;
@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions;
{
  ARRootViewController *rootVC = [ARRootViewController new];
  self.navigationController = [[EigenLikeNavigationController alloc] initWithRootViewController:rootVC];

  self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
  self.window.backgroundColor = [UIColor whiteColor];
  self.window.rootViewController = self.navigationController;
  [self.window makeKeyAndVisible];

#ifdef DEPLOY
  // [AppHub setLogLevel: AHLogLevelDebug];
  [AppHub setApplicationID: @"Z6IwqK52JBXrKLI4kpvJ"];
  [[AppHub buildManager] setDebugBuildsEnabled:YES];
#endif

  BOOL useStaging = [[NSUserDefaults standardUserDefaults] boolForKey:ARUseStagingDefault];
  NSString *service = useStaging? @"Emission-Staging" : @"Emission-Production";
  
  NSString *userID = [SAMKeychain accountsForService:service][0][kSAMKeychainAccountKey];

  if (userID) {
    NSString *accessToken = [SAMKeychain passwordForService:service account:userID];
    if (accessToken) {
      [self setupEmissionWithUserID:userID accessToken:accessToken keychainService:service];
      return YES;
    }
  }

  [self setupAuthenticationForService:service];
  return YES;
}

#pragma mark - Authentication

- (void)setupAuthenticationForService:(NSString *)service;
{
  if (self.authenticationSpinnerController == nil) {
    ARSpinner *spinner = [ARSpinner new];
    [spinner startAnimating];
    self.authenticationSpinnerController = [UIViewController new];
    self.authenticationSpinnerController.view = spinner;
    [self.navigationController presentViewController:self.authenticationSpinnerController animated:NO completion:nil];
  }

  UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"Authentication"
                                                                 message:@"Enter your Artsy credentials"
                                                          preferredStyle:UIAlertControllerStyleAlert];
  [alert addTextFieldWithConfigurationHandler:^(UITextField *textField) {
    textField.placeholder = @"Email";
  }];
  [alert addTextFieldWithConfigurationHandler:^(UITextField *textField) {
    textField.placeholder = @"Password";
    textField.secureTextEntry = YES;
  }];

  __weak UIAlertController *weakAlert = alert;
  [alert addAction:[UIAlertAction actionWithTitle:@"OK"
                                            style:UIAlertActionStyleDefault
                                          handler:^(UIAlertAction *action) {
                                            [self authenticateWithEmail:weakAlert.textFields[0].text
                                                               password:weakAlert.textFields[1].text
                                                        keychainService:service];
                                          }]];

  [self.authenticationSpinnerController presentViewController:alert animated:YES completion:nil];
}

- (void)authenticateWithEmail:(NSString *)email password:(NSString *)password keychainService:(NSString *)service;
{
  // These are of Eigen OSS: https://github.com/artsy/eigen/blob/0e193d1b/Makefile#L36-L37
  ArtsyAuthentication *auth = [[ArtsyAuthentication alloc] initWithClientID:@"e750db60ac506978fc70"
                                                               clientSecret:@"3a33d2085cbd1176153f99781bbce7c6"];
#ifdef USE_STAGING_ENV
  auth.router.staging = YES;
#endif

  [auth getWeekLongXAppTrialToken:^(ArtsyToken *token, NSError *error) {
    if (error) {
      NSLog(@"%@", error);
      [self setupAuthenticationForService:service];
    } else {
      [auth logInAndFetchUserDetailsWithEmail:email
                                     password:password
                                   completion:^(ArtsyToken *token, NSDictionary *userDetails, NSError *error) {
        (void)auth; // keep a strong reference for as long as needed
        dispatch_async(dispatch_get_main_queue(), ^{
          if (error) {
            NSLog(@"%@", error);
            [self setupAuthenticationForService:service];
          } else {
            NSString *userID = userDetails[@"_id"];
            NSString *accessToken = token.token;
            NSParameterAssert(userID);
            NSParameterAssert(accessToken);

            NSError *error = nil;
            [SAMKeychain setPassword:accessToken forService:service account:userID error:&error];
            if (error) {
              NSLog(@"%@", error);
            }

            [self.authenticationSpinnerController dismissViewControllerAnimated:YES completion:nil];
            [self setupEmissionWithUserID:userID accessToken:accessToken keychainService:service];
          }
        });
      }];
    }
  }];
}

#pragma mark - Emission

- (void)setupEmissionWithUserID:(NSString *)userID accessToken:(NSString *)accessToken keychainService:(NSString *)service;
{
  AREmission *emission = nil;

  BOOL useStaging = [[NSUserDefaults standardUserDefaults] boolForKey:ARUseStagingDefault];

#ifdef ENABLE_DEV_MODE
  NSURL *packagerURL = [NSURL URLWithString:@"http://localhost:8081/Example/Emission/index.ios.bundle?platform=ios&dev=true"];
  emission = [[AREmission alloc] initWithUserID:userID
                            authenticationToken:accessToken
                                    packagerURL:packagerURL
                          useStagingEnvironment:useStaging];
#else
#ifdef DEPLOY
  AHBuild *build = [[AppHub buildManager] currentBuild];
  NSURL *jsCodeLocation = [build.bundle URLForResource:@"main" withExtension:@"jsbundle"];
#else
  NSURL *jsCodeLocation = nil;
#endif
  if (!jsCodeLocation) {
    NSBundle *emissionBundle = [NSBundle bundleForClass:AREmission.class];
    jsCodeLocation = [emissionBundle URLForResource:@"Emission" withExtension:@"js"];
  }
  emission = [[AREmission alloc] initWithUserID:userID authenticationToken:accessToken packagerURL:jsCodeLocation useStagingEnvironment:NO];
#endif
  [AREmission setSharedInstance:emission];


  emission.APIModule.artistFollowStatusProvider = ^(NSString *artistID, RCTResponseSenderBlock block) {
    NSNumber *following = @(randomBOOL());
    NSLog(@"Artist(%@).follow => %@", artistID, following);
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      block(@[[NSNull null], following]);
    });
  };
  emission.APIModule.artistFollowStatusAssigner = ^(NSString *artistID, BOOL following, RCTResponseSenderBlock block) {
    NSLog(@"Artist(%@).follow = %@", artistID, @(following));
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//      if (randomBOOL()) {
        block(@[[NSNull null], @(following)]);
//      } else {
//        NSLog(@"Simulated follow request ‘failed’.");
//        block(@[RCTJSErrorFromNSError([NSError errorWithDomain:@"Artsy" code:42 userInfo:nil]), @(!following)]);
//      }
    });
  };

  emission.switchBoardModule.presentNavigationViewController = ^(UIViewController * _Nonnull fromViewController,
                                                                 NSString * _Nonnull route) {
    if ([fromViewController isKindOfClass:ARStorybookComponentViewController.class]) {
      NSLog(@"Route push - %@", route);
      return;
    }
    [fromViewController.navigationController pushViewController:[self viewControllerForRoute:route]
                                                       animated:YES];
  };

  emission.switchBoardModule.presentModalViewController = ^(UIViewController * _Nonnull fromViewController,
                                                            NSString * _Nonnull route) {
    if ([fromViewController isKindOfClass:ARStorybookComponentViewController.class]) {
      NSLog(@"Route modal - %@", route);
      return;
    }
    UIViewController *viewController = [self viewControllerForRoute:route];
    UINavigationController *navigationController = [[EigenLikeNavigationController alloc] initWithRootViewController:viewController];
    viewController.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemDone
                                                                                                    target:self
                                                                                                    action:@selector(dismissModalViewController)];
    [fromViewController.navigationController presentViewController:navigationController animated:YES completion:nil];
  };

  emission.eventsModule.eventOccurred = ^(UIViewController * _Nonnull fromViewController, NSDictionary * _Nonnull info) {
    NSLog(@"[Event] %@ - %@", fromViewController.class, info);
  };
}


- (UIViewController *)viewControllerForRoute:(NSString *)route;
{
  UIViewController *viewController = nil;

  if ([route hasPrefix:@"/artist/"]) {
    NSString *artistID = [[route componentsSeparatedByString:@"/"] lastObject];
    viewController = [[ARArtistComponentViewController alloc] initWithArtistID:artistID];

  } else if ([route isEqualToString:@"/"]) {
    viewController = [[ARHomeComponentViewController alloc] init];

  } else {
    viewController = [[UnroutedViewController alloc] initWithRoute:route];
  }

  return viewController;
}

- (void)dismissModalViewController;
{
  UINavigationController *navigationController = (UINavigationController *)self.window.rootViewController;
  [navigationController.visibleViewController.navigationController dismissViewControllerAnimated:YES completion:nil];
}

@end
