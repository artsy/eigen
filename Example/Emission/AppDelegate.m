#import "AppDelegate.h"

#import <Emission/ARComponentViewController.h>
#import <React/RCTBridge.h>

@interface AppDelegate ()
@property (nonatomic, strong, readwrite) RCTBridge *reactBridge;
@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions;
{
  NSURL *URL = [NSURL URLWithString:@"http://localhost:8081/Emission/index.ios.bundle?platform=ios&dev=true"];
  self.reactBridge = [[RCTBridge alloc] initWithBundleURL:URL moduleProvider:nil launchOptions:nil];
  
  ARComponentViewController *componentViewController = [[ARComponentViewController alloc] initWithBridge:self.reactBridge
                                                                                              moduleName:@"Artist"];
  self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
  self.window.rootViewController = [[UINavigationController alloc] initWithRootViewController:componentViewController];
  [self.window makeKeyAndVisible];
  
  return YES;
}

@end
