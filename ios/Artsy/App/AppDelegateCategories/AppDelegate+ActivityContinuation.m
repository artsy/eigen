#import "AppDelegate+ActivityContinuation.h"
#import <CoreSpotlight/CoreSpotlight.h>
#import <React/RCTLinkingManager.h>

@implementation ARAppDelegateHelper (ActivityContinuation)

- (BOOL)application:(UIApplication *)application willContinueUserActivityWithType:(NSString *)userActivityType;
{
    return [userActivityType isEqualToString:NSUserActivityTypeBrowsingWeb] || ([userActivityType isEqualToString:CSSearchableItemActionType]) || [userActivityType hasPrefix:@"net.artsy.artsy."];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray *restorableObjects))restorationHandler;
{
    return [RCTLinkingManager application:application
                     continueUserActivity:userActivity
                       restorationHandler:restorationHandler];
}

@end
