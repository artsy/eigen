#import "AppDelegate.h"

#import <Emission/AREmission.h>
#import <Emission/ARComponentViewController.h>
#import <Emission/ARTemporaryAPIModule.h>

#import <React/RCTUtils.h>
#import <TargetConditionals.h>

#ifdef TARGET_OS_SIMULATOR
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
  
  ARComponentViewController *componentViewController = [[ARComponentViewController alloc] initWithModuleName:@"Artist"];

  self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
  self.window.backgroundColor = [UIColor whiteColor];
  self.window.rootViewController = [[UINavigationController alloc] initWithRootViewController:componentViewController];
  [self.window makeKeyAndVisible];
  
  [(UINavigationController *)self.window.rootViewController setNavigationBarHidden:YES];
  
  return YES;
}

@end
