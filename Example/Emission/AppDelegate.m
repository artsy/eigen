#import "AppDelegate.h"

#import <Emission/AREmission.h>
#import <Emission/ARArtistComponentViewController.h>
#import <Emission/ARTemporaryAPIModule.h>
#import <Emission/ARSwitchBoardModule.h>

#import <React/RCTUtils.h>
#import <TargetConditionals.h>

#if TARGET_OS_SIMULATOR
#define ENABLE_DEV_MODE
#endif

static BOOL
randomBOOL(void)
{
  return rand() % 2 == 1;
}

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions;
{
  AREmission *emission = nil;
#ifdef ENABLE_DEV_MODE
  NSURL *packagerURL = [NSURL URLWithString:@"http://localhost:8081/Emission/index.ios.bundle?platform=ios&dev=true"];
  emission = [[AREmission alloc] initWithPackagerURL:packagerURL];
  [AREmission setSharedInstance:emission];
#else
  emission = [AREmission sharedInstance];
#endif
  
//  self.emission.APIModule.artistFollowStatusProvider = ^(NSString *artistID, RCTResponseSenderBlock block){
//    [ArtsyAPI checkFavoriteStatusForArtist:[[Artist alloc] initWithArtistID:artistID]
//                                   success:^(BOOL following) { block(@[[NSNull null], @(following)]); }
//                                   failure:^(NSError *error) { block(@[RCTJSErrorFromNSError(error), [NSNull null]]); }];
//  };
//  self.emission.APIModule.artistFollowStatusAssigner = ^(NSString *artistID, BOOL following, RCTResponseSenderBlock block) {
//    [ArtsyAPI setFavoriteStatus:following
//                      forArtist:[[Artist alloc] initWithArtistID:artistID]
//                        success:^(id response)    { block(@[[NSNull null], @(following)]); }
//                        failure:^(NSError *error) { block(@[RCTJSErrorFromNSError(error), @(!following)]); }];
//  };
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
    [fromViewController.navigationController pushViewController:[self viewControllerForRoute:route]
                                                       animated:YES];
  };

  emission.switchBoardModule.presentModalViewController = ^(UIViewController * _Nonnull fromViewController,
                                                            NSString * _Nonnull route) {
    UIViewController *viewController = [self viewControllerForRoute:route];
    UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController:viewController];
    viewController.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemDone
                                                                                                    target:self
                                                                                                    action:@selector(dismissModalViewController)];
    [fromViewController.navigationController presentViewController:navigationController animated:YES completion:nil];
  };

  ARArtistComponentViewController *artistViewController = [[ARArtistComponentViewController alloc] initWithArtistID:@"banksy"];

  self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
  self.window.backgroundColor = [UIColor whiteColor];
  self.window.rootViewController = [[UINavigationController alloc] initWithRootViewController:artistViewController];
  [self.window makeKeyAndVisible];
  
  return YES;
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

@end
