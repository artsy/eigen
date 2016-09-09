#import "AppDelegate.h"
#import "RotationNavigationController.h"

#import <Emission/AREmission.h>
#import <Emission/ARArtistComponentViewController.h>
#import <Emission/ARHomeComponentViewController.h>
#import <Emission/ARTemporaryAPIModule.h>
#import <Emission/ARSwitchBoardModule.h>
#import <Emission/AREventsModule.h>

#import "ARStorybookComponentViewController.h"

#import <React/RCTUtils.h>
#import <TargetConditionals.h>

#import <Artsy+Authentication/ArtsyAuthentication.h>
#import <Artsy+Authentication/ArtsyAuthenticationRouter.h>
#import <Artsy+Authentication/ArtsyToken.h>
#import <Extraction/ARSpinner.h>
#import <SAMKeychain/SAMKeychain.h>

#import <AppHub/AppHub.h>

// The slug of the artist to show as the root artist from the component selection list.
//
#define ARTIST @"alex-katz"

// Disable this to force using the release JS bundle, note that you should really do so by running a Release build.
//
// To do this, hold down the alt key when clicking the run button and select the Release configuration. Remember to
// change this back afterwards.
//
#if TARGET_OS_SIMULATOR && defined(DEBUG)
#define ENABLE_DEV_MODE
#endif

// * Disable all of this to use the production env in a Debug build
// * or just the ENABLE_DEV_MODE check to use staging in a Release build
//
#ifdef ENABLE_DEV_MODE
#define USE_STAGING_ENV
#endif

#ifdef USE_STAGING_ENV
#define KEYCHAIN_SERVICE @"Emission-Staging"
#else
#define KEYCHAIN_SERVICE @"Emission-Production"
#endif

static BOOL
randomBOOL(void)
{
  return rand() % 2 == 1;
}

@interface AppDelegate () <UITableViewDataSource, UITableViewDelegate>
@property (nonatomic, strong) UINavigationController *navigationController;
@property (nonatomic, strong) UIViewController *authenticationSpinnerController;
@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions;
{
  UITableViewController *tableViewController = [UITableViewController new];
  tableViewController.tableView.dataSource = self;
  tableViewController.tableView.delegate = self;

  self.navigationController = [[RotationNavigationController alloc] initWithRootViewController:tableViewController];

  self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
  self.window.backgroundColor = [UIColor whiteColor];
  self.window.rootViewController = self.navigationController;
  [self.window makeKeyAndVisible];

  // [AppHub setLogLevel: AHLogLevelDebug];
  [AppHub setApplicationID: @"Z6IwqK52JBXrKLI4kpvJ"];
  [[AppHub buildManager] setDebugBuildsEnabled:YES];

  NSString *userID = [SAMKeychain accountsForService:KEYCHAIN_SERVICE][0][kSAMKeychainAccountKey];

  if (userID) {
    NSString *accessToken = [SAMKeychain passwordForService:KEYCHAIN_SERVICE account:userID];
    if (accessToken) {
      [self setupEmissionWithUserID:userID accessToken:accessToken];
      return YES;
    }
  }

  [self setupAuthentication];
  return YES;
}

#pragma mark - Authentication

- (void)setupAuthentication;
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
                                                               password:weakAlert.textFields[1].text];
                                          }]];

  [self.authenticationSpinnerController presentViewController:alert animated:YES completion:nil];
}

- (void)authenticateWithEmail:(NSString *)email password:(NSString *)password;
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
      [self setupAuthentication];
    } else {
      [auth logInAndFetchUserDetailsWithEmail:email
                                     password:password
                                   completion:^(ArtsyToken *token, NSDictionary *userDetails, NSError *error) {
        (void)auth; // keep a strong reference for as long as needed
        dispatch_async(dispatch_get_main_queue(), ^{
          if (error) {
            NSLog(@"%@", error);
            [self setupAuthentication];
          } else {
            NSString *userID = userDetails[@"_id"];
            NSString *accessToken = token.token;
            NSParameterAssert(userID);
            NSParameterAssert(accessToken);

            [SAMKeychain setPassword:accessToken forService:KEYCHAIN_SERVICE account:userID];

            [self.authenticationSpinnerController dismissViewControllerAnimated:YES completion:nil];
            [self setupEmissionWithUserID:userID accessToken:accessToken];
          }
        });
      }];
    }
  }];
}

#pragma mark - Emission

- (void)setupEmissionWithUserID:(NSString *)userID accessToken:(NSString *)accessToken;
{
  AREmission *emission = nil;

#ifdef ENABLE_DEV_MODE
#ifdef USE_STAGING_ENV
  BOOL staging = YES;
#else
  BOOL staging = NO;
#endif

  NSURL *packagerURL = [NSURL URLWithString:@"http://localhost:8081/Example/Emission/index.ios.bundle?platform=ios&dev=true"];
  emission = [[AREmission alloc] initWithUserID:userID
                            authenticationToken:accessToken
                                    packagerURL:packagerURL
                          useStagingEnvironment:staging];
#else
  AHBuild *build = [[AppHub buildManager] currentBuild];
  NSURL *jsCodeLocation = [build.bundle URLForResource:@"main" withExtension:@"jsbundle"];
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
      if (randomBOOL()) {
        block(@[[NSNull null], @(following)]);
      } else {
        NSLog(@"Simulated follow request ‘failed’.");
        block(@[RCTJSErrorFromNSError([NSError errorWithDomain:@"Artsy" code:42 userInfo:nil]), @(!following)]);
      }
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
    UINavigationController *navigationController = [[RotationNavigationController alloc] initWithRootViewController:viewController];
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
  } else {
    UILabel *label = [UILabel new];
    label.text = route;
    [label sizeToFit];
    viewController = [UIViewController new];
    viewController.view.backgroundColor = [UIColor redColor];
    [viewController.view addSubview:label];
    label.center = viewController.view.center;
  }

  return viewController;
}

- (void)dismissModalViewController;
{
  UINavigationController *navigationController = (UINavigationController *)self.window.rootViewController;
  [navigationController.visibleViewController.navigationController dismissViewControllerAnimated:YES completion:nil];
}

static NSArray *sharedRoutingMap;

- (NSArray *)routingMap
{
    if (!sharedRoutingMap) {
      sharedRoutingMap = @[
#ifdef ENABLE_DEV_MODE
        @{
          @"name" : @"Storybook",
          @"router" : ^() {
            return [[ARStorybookComponentViewController alloc] init];
          }
        },
#endif
        @{
           @"name" : @"Home",
           @"router" : ^() {
             return [[ARHomeComponentViewController alloc] init];
           }
        },
        @{
          @"name" : @"Artist",
          @"router" : ^() {
            return [[ARArtistComponentViewController alloc] initWithArtistID:ARTIST];
          }
        },
      ];
    }

    return sharedRoutingMap;
}

#pragma mark - Example selection tableview

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section;
{
  return self.routingMap.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath;
{
  static NSString *cellIdentifier = @"example cell";
  UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellIdentifier];
  if (cell == nil) {
    cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:cellIdentifier];
    cell.accessoryType = UITableViewCellAccessoryDisclosureIndicator;
  }

  NSDictionary *route = self.routingMap[indexPath.row];
  cell.textLabel.text = route[@"name"];
  return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath;
{
  NSDictionary *route = self.routingMap[indexPath.row];
  typedef ARComponentViewController * (^ARRouterMethod)();

  ARRouterMethod routeGenerator = route[@"router"];
  ARComponentViewController *viewController = routeGenerator();
  [self.navigationController pushViewController:viewController animated:YES];
}

@end
