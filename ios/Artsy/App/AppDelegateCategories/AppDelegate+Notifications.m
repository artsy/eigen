#import "AppDelegate+Notifications.h"
#import "ARAppConstants.h"
#import "ARAnalyticsConstants.h"
#import "UIApplicationStateEnum.h"
#import "ARLogger.h"
#import "AREmission.h"
#import "ArtsyAPI+DeviceTokens.h"
#import "User.h"

@implementation ARAppDelegateHelper (Notifications)

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
    BOOL hasSeenPushDialog = [[NSUserDefaults standardUserDefaults] boolForKey:ARAPNSHasSeenPushDialog];

    NSString *analyticsContext = @"";
    if (self.requestContext == ARAppNotificationsRequestContextArtistFollow) {
        analyticsContext = @"ArtistFollow";
    } else if (self.requestContext == ARAppNotificationsRequestContextOnboarding) {
        analyticsContext = @"Onboarding";
    } else if (self.requestContext == ARAppNotificationsRequestContextLaunch) {
        analyticsContext = @"Launch";
    }
    analyticsContext = [@[@"PushNotification", analyticsContext] componentsJoinedByString:@""];

    if (!hasSeenPushDialog) {
        [[AREmission sharedInstance] sendEvent:ARAnalyticsPushNotificationApple traits:@{
            @"action_type" : @"Tap",
            @"action_name" : @"Cancel",
            @"context_screen"  : analyticsContext
        }];
    }
    [[NSUserDefaults standardUserDefaults] setValue:@YES forKey:ARAPNSHasSeenPushDialog];
#if (TARGET_IPHONE_SIMULATOR == 0)
    ARErrorLog(@"Error registering for remote notifications: %@", error.localizedDescription);
#endif
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceTokenData
{
    BOOL hasSeenPushDialog = [[NSUserDefaults standardUserDefaults] boolForKey:ARAPNSHasSeenPushDialog];

    NSString *analyticsContext = @"";
    if (self.requestContext == ARAppNotificationsRequestContextArtistFollow) {
        analyticsContext = @"ArtistFollow";
    } else if (self.requestContext == ARAppNotificationsRequestContextOnboarding) {
        analyticsContext = @"Onboarding";
    } else if (self.requestContext == ARAppNotificationsRequestContextLaunch) {
        analyticsContext = @"Launch";
    }
    analyticsContext = [@[@"PushNotification", analyticsContext] componentsJoinedByString:@""];
    if (!hasSeenPushDialog) {
        [[AREmission sharedInstance] sendEvent:ARAnalyticsPushNotificationApple traits:@{
            @"action_type" : @"Tap",
            @"action_name" : @"Yes",
            @"context_screen"  : analyticsContext
        }];
    }

    // http://stackoverflow.com/questions/9372815/how-can-i-convert-my-device-token-nsdata-into-an-nsstring
    const unsigned *tokenBytes = [deviceTokenData bytes];
    NSString *deviceToken = [NSString stringWithFormat:@"%08x%08x%08x%08x%08x%08x%08x%08x",
                             ntohl(tokenBytes[0]), ntohl(tokenBytes[1]), ntohl(tokenBytes[2]),
                             ntohl(tokenBytes[3]), ntohl(tokenBytes[4]), ntohl(tokenBytes[5]),
                             ntohl(tokenBytes[6]), ntohl(tokenBytes[7])];

    ARActionLog(@"Got device notification token: %@", deviceToken);
    NSString *previousToken = [[NSUserDefaults standardUserDefaults] stringForKey:ARAPNSDeviceTokenKey];

    // Save device token for dev settings and to prevent excess calls to gravity if tokens don't change
    [[NSUserDefaults standardUserDefaults] setValue:deviceToken forKey:ARAPNSDeviceTokenKey];
    [[NSUserDefaults standardUserDefaults] setValue:@YES forKey:ARAPNSHasSeenPushDialog];

    [[[ARAppDelegateHelper braze] notifications] registerDeviceToken:deviceTokenData];

// We only record device tokens on the Artsy service in case of Beta or App Store builds.
#ifndef DEBUG
    // Apple says to always save the device token, as it may change. In addition, since we allow a device to register
    // for notifications even if the user has not signed-in, we must be sure to always update this to ensure the Artsy
    // service always has an up-to-date record of devices and associated users.
    // https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1622958-application?language=objc
    if ([User currentUser] && ![self tokensAreTheSame:deviceToken previousToken:previousToken]) {
        [ArtsyAPI setAPNTokenForCurrentDevice:deviceToken success:^(id response) {
            ARActionLog(@"Pushed device token to Artsy's servers");
        } failure:^(NSError *error) {
            ARErrorLog(@"Couldn't push the device token to Artsy, error: %@", error.localizedDescription);
            // Clear out saved token to make sure we register on log in
            [[NSUserDefaults standardUserDefaults] setValue:nil forKey:ARAPNSDeviceTokenKey];
        }];
    } else {
        // Clear out saved token to make sure we register on log in
        [[NSUserDefaults standardUserDefaults] setValue:nil forKey:ARAPNSDeviceTokenKey];
    }
#endif
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult result))handler;
{
    BOOL processedByBraze = ARAppDelegateHelper.braze != nil && [ARAppDelegateHelper.braze.notifications handleBackgroundNotificationWithUserInfo:userInfo
                                                                                                               fetchCompletionHandler:handler];
    if (processedByBraze) {
        // Still let React Native know about Braze notifications
        [[[AREmission sharedInstance] notificationsManagerModule] notificationReceivedWithPayload:userInfo];
        return;
    }

    // Forward all notifications to React Native
    [[[AREmission sharedInstance] notificationsManagerModule] notificationReceivedWithPayload:userInfo];

    handler(UIBackgroundFetchResultNoData);
}

- (void)applicationDidReceiveRemoteNotification:(NSDictionary *)userInfo inApplicationState:(UIApplicationState)applicationState;
{
    NSString *uiApplicationState = [UIApplicationStateEnum toString:applicationState];
    ARActionLog(@"Incoming notification in the %@ application state: %@", uiApplicationState, userInfo);

    // Create enriched notification payload with application state
    NSMutableDictionary *notificationInfo = [[NSMutableDictionary alloc] initWithDictionary:userInfo];
    [notificationInfo setObject:uiApplicationState forKey:@"UIApplicationState"];

    // Forward all notifications to React Native with enriched payload
    [[[AREmission sharedInstance] notificationsManagerModule] notificationReceivedWithPayload:notificationInfo];
}

- (void)receivedNotification:(NSDictionary *)notificationInfo;
{
    NSDictionary *normalizedInfo = [self normalizedNotificationInfo:notificationInfo];
    [[AREmission sharedInstance] sendEvent:ARAnalyticsNotificationReceived traits:normalizedInfo];
}

- (NSDictionary *)normalizedNotificationInfo:(NSDictionary *)notificationInfo {
    NSMutableDictionary *normalizedInfo = [notificationInfo mutableCopy];

    if (notificationInfo[@"ab_uri"] != nil) {
        normalizedInfo[@"url"] = notificationInfo[@"ab_uri"];
    }

    return normalizedInfo;
}



- (UIWindow *)findVisibleWindow
{
    NSArray *windows = [[UIApplication sharedApplication] windows];
    for (UIWindow *window in [windows reverseObjectEnumerator]) {
        if (!window.hidden) {
            return window;
        }
    }
    return nil;
}

- (BOOL)tokensAreTheSame:(NSString *)newToken previousToken:(NSString * _Nullable)previousToken;
{
    if (!previousToken) {
        return NO;
    } else {
        return [newToken isEqualToString:previousToken];
    }
}

// Handle the notification view on when the app is in the foreground
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler{

    if (ARAppDelegateHelper.braze != nil) {
      // Forward notification payload to Braze for processing.
      [ARAppDelegateHelper.braze.notifications handleForegroundNotificationWithNotification:notification];
    }

    NSDictionary *userInfo = notification.request.content.userInfo;
    NSMutableDictionary *notificationInfo = [[NSMutableDictionary alloc] initWithDictionary:userInfo];
    [notificationInfo setObject:@"Active" forKey:@"UIApplicationState"]; // Foreground state

    // Forward to React Native
    [[[AREmission sharedInstance] notificationsManagerModule] notificationReceivedWithPayload:notificationInfo];

    completionHandler(UNAuthorizationOptionAlert | UNAuthorizationOptionSound | UNAuthorizationOptionBadge);
}

// Handle the tapping on the notification when the app in the foreground
-(void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler{
    BOOL processedByBraze = ARAppDelegateHelper.braze != nil && [ARAppDelegateHelper.braze.notifications handleUserNotificationWithResponse:response
                                                                                                    withCompletionHandler:completionHandler];

    // Only forward payload to React Native - let JS handle navigation
    NSDictionary *userInfo = response.notification.request.content.userInfo;
    NSMutableDictionary *notificationInfo = [[NSMutableDictionary alloc] initWithDictionary:userInfo];
    [notificationInfo setObject:@"Tapped" forKey:@"NotificationAction"]; // Indicate this was tapped

    // Forward to React Native regardless of whether Braze processed it
    [[[AREmission sharedInstance] notificationsManagerModule] notificationReceivedWithPayload:notificationInfo];

    if (!processedByBraze) {
        completionHandler();
    }
}

@end
