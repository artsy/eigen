#import "AppDelegate.h"
#import <UserNotifications/UNUserNotificationCenter.h>

 @interface ARAppDelegate (Notifications) <UNUserNotificationCenterDelegate>

 - (void)applicationDidReceiveRemoteNotification:(NSDictionary *)userInfo inApplicationState:(UIApplicationState)applicationState;

 @end
