#import "ARAppDelegateHelper.h"
#import <UserNotifications/UNUserNotificationCenter.h>

@interface ARAppDelegateHelper (Notifications) <UNUserNotificationCenterDelegate>

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceTokenData;
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error;
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult result))handler;
- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler;
- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler;
- (void)applicationDidReceiveRemoteNotification:(NSDictionary *)userInfo inApplicationState:(UIApplicationState)applicationState;

@end
