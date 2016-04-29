#import "AppDelegate.h"

#import <Emission/ARComponentViewController.h>
#import <Emission/ARTemporaryAPIModule.h>

#import <React/RCTBridge.h>
#import <React/RCTUtils.h>

static BOOL
randomBOOL(void)
{
  return rand() % 2 == 1;
}

@interface AppDelegate ()
@property (nonatomic, strong, readwrite) RCTBridge *reactBridge;
@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions;
{
  ARTemporaryAPIModule *APIModule = [ARTemporaryAPIModule new];
//  APIModule.artistFollowStatusProvider = ^(NSString *artistID, RCTResponseSenderBlock block){
//    [ArtsyAPI checkFavoriteStatusForArtist:[[Artist alloc] initWithArtistID:artistID]
//                                   success:^(BOOL following) { block(@[[NSNull null], @(following)]); }
//                                   failure:^(NSError *error) { block(@[RCTJSErrorFromNSError(error), [NSNull null]]); }];
//  };
//  APIModule.artistFollowStatusAssigner = ^(NSString *artistID, BOOL following, RCTResponseSenderBlock block) {
//    [ArtsyAPI setFavoriteStatus:following
//                      forArtist:[[Artist alloc] initWithArtistID:artistID]
//                        success:^(id response)    { block(@[[NSNull null], @(following)]); }
//                        failure:^(NSError *error) { block(@[RCTJSErrorFromNSError(error), @(!following)]); }];
//  };
  APIModule.artistFollowStatusProvider = ^(NSString *artistID, RCTResponseSenderBlock block) {
    NSNumber *following = @(randomBOOL());
    NSLog(@"Artist(%@).follow => %@", artistID, following);
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      block(@[[NSNull null], following]);
    });
  };
  APIModule.artistFollowStatusAssigner = ^(NSString *artistID, BOOL following, RCTResponseSenderBlock block) {
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
  
  NSURL *URL = [NSURL URLWithString:@"http://localhost:8081/Emission/index.ios.bundle?platform=ios&dev=true"];
  self.reactBridge = [[RCTBridge alloc] initWithBundleURL:URL
                                           moduleProvider:^{ return @[APIModule]; }
                                            launchOptions:nil];
  
  ARComponentViewController *componentViewController = [[ARComponentViewController alloc] initWithBridge:self.reactBridge
                                                                                              moduleName:@"Artist"];
  self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
  self.window.rootViewController = [[UINavigationController alloc] initWithRootViewController:componentViewController];
  [self.window makeKeyAndVisible];
  
  return YES;
}

@end
