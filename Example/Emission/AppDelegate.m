#import "AppDelegate.h"
#import "RotationNavigationController.h"

#import "Configuration.h"

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

#define ARTIST @"alex-katz"

#if TARGET_OS_SIMULATOR
#define ENABLE_DEV_MODE
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

  NSString *userID = [SAMKeychain accountsForService:@"Emission-Example"][0][kSAMKeychainAccountKey];
  if (userID) {
    NSString *accessToken = [SAMKeychain passwordForService:@"Emission-Example" account:userID];
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
  ArtsyAuthentication *auth = [[ArtsyAuthentication alloc] initWithClientID:@"e750db60ac506978fc70"
                                                               clientSecret:@"3a33d2085cbd1176153f99781bbce7c6"];
#ifdef ENABLE_DEV_MODE
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

            [SAMKeychain setPassword:accessToken forService:@"Emission-Example" account:userID];

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
  NSURL *packagerURL = [NSURL URLWithString:@"http://localhost:8081/Example/Emission/index.ios.bundle?platform=ios&dev=true"];
  emission = [[AREmission alloc] initWithUserID:userID authenticationToken:accessToken packagerURL:packagerURL];
#else
  emission = [[AREmission alloc] initWithUserID:userID authenticationToken:accessToken];
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
        @{
          @"name" : @"Storybook",
          @"router" : ^() {
            return [[ARStorybookComponentViewController alloc] init];
          }
        },
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
