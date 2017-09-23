#import "AppDelegate.h"
#import "ARDefaults.h"
#import "AppSetup.h"

#import "EigenLikeNavigationController.h"
#import "ARRootViewController.h"
#import "UnroutedViewController.h"

#import <Emission/AREmission.h>
#import <Emission/ARTemporaryAPIModule.h>
#import <Emission/ARSwitchBoardModule.h>
#import <Emission/AREventsModule.h>
#import <Emission/ARRefineOptionsModule.h>
#import <Emission/ARWorksForYouModule.h>
#import <Emission/ARTakeCameraPhotoModule.h>

#import "ARStorybookComponentViewController.h"
#import <Emission/ARArtistComponentViewController.h>
#import <Emission/ARHomeComponentViewController.h>
#import <Emission/ARGeneComponentViewController.h>
#import <Emission/ARConversationComponentViewController.h>

#import <React/RCTUtils.h>
#import <TargetConditionals.h>
#import "AuthenticationManager.h"
#import "LoadingSpinner.h"
#import "PRNetworkModel.h"
#import <AppHub/AppHub.h>

#import "TakePhotoPromisable.h"

static BOOL
randomBOOL(void)
{
  return rand() % 2 == 1;
}

@interface AppDelegate ()
@property (nonatomic, strong) UINavigationController *navigationController;
@property (nonatomic, strong) LoadingSpinner *spinner;
@property (nonatomic, strong) TakePhotoPromisable *takePhotoPromisable;

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions;
{
  // Sets all our default defaults
  [ARDefaults setup];

  BOOL useStaging = [[NSUserDefaults standardUserDefaults] boolForKey:ARUseStagingDefault];
  NSString *service = useStaging? @"Emission-Staging" : @"Emission-Production";

  BOOL usesPRBuild = [[NSUserDefaults standardUserDefaults] boolForKey:ARUsePREmissionDefault];

  AuthenticationManager *auth = [[AuthenticationManager alloc] initWithService:service];
  self.spinner = [LoadingSpinner new];

  ARRootViewController *rootVC = [ARRootViewController new];
  rootVC.authenticationManager = auth;
  
  self.navigationController = [[EigenLikeNavigationController alloc] initWithRootViewController:rootVC];

  self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
  self.window.backgroundColor = [UIColor whiteColor];
  self.window.rootViewController = self.navigationController;
  [self.window makeKeyAndVisible];

#if defined(DEPLOY)
  // [AppHub setLogLevel: AHLogLevelDebug];
  [AppHub setApplicationID: @"Z6IwqK52JBXrKLI4kpvJ"];
  [[AppHub buildManager] setDebugBuildsEnabled:YES];
#endif

  if ([auth isAuthenticated]) {
    NSString *accessToken = [auth token];
    if (accessToken) {
      if(usesPRBuild) {
        [self downloadPRBuildAndLoginWithAuth:auth keychainService:service];
      } else {
        [self setupEmissionWithUserID:[auth userID] accessToken:accessToken keychainService:service];
      }
    }
  } else {
    [self.spinner presentSpinnerOnViewController:rootVC completion:^{
      [auth presentAuthenticationPromptOnViewController:rootVC.presentedViewController completion:^{
        NSLog(@"Logged in successfully :)");
        [self setupEmissionWithUserID:[auth userID] accessToken:[auth token] keychainService:service];
      }];
    }];
  }

  return YES;
}


#pragma mark - Emission

- (void)setupEmissionWithUserID:(NSString *)userID accessToken:(NSString *)accessToken keychainService:(NSString *)service;
{
  AREmission *emission = nil;

  AppSetup *setup = [AppSetup ambientSetup];

  AREmissionConfiguration *config = [[AREmissionConfiguration alloc] initWithUserID:userID authenticationToken:accessToken sentryDSN:nil googleMapsAPIKey:nil gravityHost:setup.gravityURL metaphysicsHost:setup.metaphysicsURL];

  emission = [[AREmission alloc] initWithConfiguration:config packagerURL:setup.jsCodeLocation];
  [AREmission setSharedInstance:emission];

  ARRootViewController *controller = (id)self.navigationController.topViewController;
  [controller.tableView reloadData];

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

  emission.APIModule.geneFollowStatusProvider = ^(NSString *geneID, RCTResponseSenderBlock block) {
    NSNumber *following = @(randomBOOL());
    NSLog(@"Gene(%@).follow => %@", geneID, following);
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      block(@[[NSNull null], following]);
    });
  };

  emission.APIModule.geneFollowStatusAssigner = ^(NSString *geneID, BOOL following, RCTResponseSenderBlock block) {
    NSLog(@"Gene(%@).follow = %@", geneID, @(following));
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      //      if (randomBOOL()) {
      block(@[[NSNull null], @(following)]);
      //      } else {
      //        NSLog(@"Simulated follow request ‘failed’.");
      //        block(@[RCTJSErrorFromNSError([NSError errorWithDomain:@"Artsy" code:42 userInfo:nil]), @(!following)]);
      //      }
    });
  };
  
  emission.APIModule.notificationReadStatusAssigner = ^(RCTResponseSenderBlock block) {
    NSLog(@"notificationReadStatusAssigner from APIModule called");
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      block(@[[NSNull null]]);
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

  emission.eventsModule.eventOccurred = ^(NSDictionary * _Nonnull info) {
    NSLog(@"[Event] - %@", info);
  };

  emission.refineModule.triggerRefine = ^(NSDictionary *_Nonnull initial, NSDictionary *_Nonnull current, UIViewController *_Nonnull controller, RCTPromiseResolveBlock resolve, RCTPromiseRejectBlock reject) {
    sleep(1);
    resolve(@{ @"sort": @"-year", @"medium": @"design", @"selectedPrice": @"0-50000" });
  };
  
  emission.worksForYouModule.setNotificationsCount = ^(NSInteger count) {
    sleep(1);
    NSLog(@"Set notifications count: %ld", (long)count);
  };

  self.takePhotoPromisable = [TakePhotoPromisable new];
  emission.cameraModule.triggerCreatingACameraPhoto = ^(UIViewController * _Nonnull controller, RCTPromiseResolveBlock  _Nonnull resolve, RCTPromiseRejectBlock  _Nonnull reject) {
    [self.takePhotoPromisable showCameraModal:controller resolver:resolve rejecter:reject];
  };
}

- (UIViewController *)viewControllerForRoute:(NSString *)route;
{
  UIViewController *viewController = nil;

  if ([route hasPrefix:@"/artist/"] && [route componentsSeparatedByString:@"/"].count == 3) {
    NSString *artistID = [[route componentsSeparatedByString:@"/"] lastObject];
    viewController = [[ARArtistComponentViewController alloc] initWithArtistID:artistID];

  } else if ([route hasPrefix:@"/gene/"] || [route hasPrefix:@"gene/"]) {
    NSString *geneID = [[[[route componentsSeparatedByString:@"/"] lastObject] componentsSeparatedByString:@"?"] firstObject];
    NSURLComponents *components = [NSURLComponents componentsWithString:route];
    NSMutableDictionary *params = [NSMutableDictionary dictionary];
    for ( NSURLQueryItem *item in components.queryItems) {
      params[item.name] = item.value;
    }
    viewController = [[ARGeneComponentViewController alloc] initWithGeneID:geneID refineSettings:params];

  } else if ([route hasPrefix:@"/conversation/"] || [route hasPrefix:@"conversation/"]) {
    NSString *conversationID = [[route componentsSeparatedByString:@"/"] lastObject];
    viewController = [[ARConversationComponentViewController alloc] initWithConversationID:conversationID];
  } else if ([route isEqualToString:@"/"]) {
    viewController = [[ARHomeComponentViewController alloc] initWithEmission:nil];

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

- (void)downloadPRBuildAndLoginWithAuth:(AuthenticationManager *)auth keychainService:(NSString *)service
{
  PRNetworkModel *network = [PRNetworkModel new];
  NSUInteger prNumber = [[NSUserDefaults standardUserDefaults] integerForKey:ARPREmissionIDDefault];

  [self.spinner presentSpinnerOnViewController:self.navigationController completion:^{
    [network downloadJavaScriptForPRNumber:prNumber completion:^(NSURL * _Nullable downloadedFileURL, NSError * _Nullable error) {
      [self.navigationController dismissViewControllerAnimated:YES completion:^{
        [self setupEmissionWithUserID:[auth userID] accessToken:[auth token] keychainService:service];
      }];
    }];
  }];
}

@end

