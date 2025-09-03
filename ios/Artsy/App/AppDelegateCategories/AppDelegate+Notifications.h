#import "ARAppDelegateHelper.h"
#import <UserNotifications/UNUserNotificationCenter.h>

 @interface ARAppDelegateHelper (Notifications) <UNUserNotificationCenterDelegate>

 - (void)applicationDidReceiveRemoteNotification:(NSDictionary *)userInfo inApplicationState:(UIApplicationState)applicationState;

 @end
