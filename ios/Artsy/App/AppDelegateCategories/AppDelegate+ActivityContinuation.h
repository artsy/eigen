#import "ARAppDelegateHelper.h"

@interface ARAppDelegateHelper (ActivityContinuation) <UNUserNotificationCenterDelegate>

- (BOOL)application:(UIApplication *)application willContinueUserActivityWithType:(NSString *)userActivityType;
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray *restorableObjects))restorationHandler;

@end
