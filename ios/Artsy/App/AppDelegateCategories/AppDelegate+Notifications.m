#import "AppDelegate+Notifications.h"
#import "ARAppConstants.h"
#import "ARAppStatus.h"
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
    BOOL processedByBraze = ARAppDelegateHelper.braze != nil && [ARAppDelegateHelper.braze.notifications handleBackgroundNotificationWithUserInfo:userInfo fetchCompletionHandler:handler];
    [self recordRawPushPayload:userInfo source:@"didReceiveRemoteNotification"];
    NSDictionary *normalizedInfo = [self normalizedNotificationInfo:userInfo];
    if (processedByBraze) {
        // Still let React Native know about Braze notifications
        [[[AREmission sharedInstance] notificationsManagerModule] notificationReceivedWithPayload:normalizedInfo];
        return;
    }

    // Forward all notifications to React Native
    [[[AREmission sharedInstance] notificationsManagerModule] notificationReceivedWithPayload:normalizedInfo];

    handler(UIBackgroundFetchResultNoData);
}

- (void)applicationDidReceiveRemoteNotification:(NSDictionary *)userInfo inApplicationState:(UIApplicationState)applicationState;
{
    NSString *uiApplicationState = [UIApplicationStateEnum toString:applicationState];
    ARActionLog(@"Incoming notification in the %@ application state: %@", uiApplicationState, userInfo);

    // Create enriched notification payload with application state
    NSMutableDictionary *notificationInfo = [[NSMutableDictionary alloc] initWithDictionary:userInfo];
    [notificationInfo setObject:uiApplicationState forKey:@"UIApplicationState"];
    [self recordRawPushPayload:notificationInfo source:@"applicationDidReceiveRemoteNotification"];
    NSDictionary *normalizedInfo = [self normalizedNotificationInfo:notificationInfo];

    // Forward all notifications to React Native with enriched payload
    [[[AREmission sharedInstance] notificationsManagerModule] notificationReceivedWithPayload:normalizedInfo];
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
    NSDictionary *normalizedInfo = [self normalizedNotificationInfo:notificationInfo];
    [[[AREmission sharedInstance] notificationsManagerModule] notificationReceivedWithPayload:normalizedInfo];

    completionHandler(UNAuthorizationOptionAlert | UNAuthorizationOptionSound | UNAuthorizationOptionBadge);
}

// Handle the tapping on the notification when the app in the foreground
-(void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler{
    BOOL processedByBraze = ARAppDelegateHelper.braze != nil && [ARAppDelegateHelper.braze.notifications handleUserNotificationWithResponse:response
                                                                                                    withCompletionHandler:completionHandler];

    // Only forward payload to React Native - let JS handle navigation
    NSDictionary *userInfo = response.notification.request.content.userInfo;
    [self recordRawPushPayload:userInfo source:@"didReceiveNotificationResponse"];
    NSMutableDictionary *notificationInfo = [[NSMutableDictionary alloc] initWithDictionary:userInfo];
    [notificationInfo setObject:@"Tapped" forKey:@"NotificationAction"]; // Indicate this was tapped
    NSDictionary *normalizedInfo = [self normalizedNotificationInfo:notificationInfo];

    // Forward to React Native regardless of whether Braze processed it
    [[[AREmission sharedInstance] notificationsManagerModule] notificationReceivedWithPayload:normalizedInfo];

    if (!processedByBraze) {
        completionHandler();
    }
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


- (BOOL)tokensAreTheSame:(NSString *)newToken previousToken:(NSString * _Nullable)previousToken;
{
    if (!previousToken) {
        return NO;
    } else {
        return [newToken isEqualToString:previousToken];
    }
}

- (void)recordRawPushPayload:(NSDictionary *)userInfo source:(NSString *)source {
    if (![ARAppStatus isBetaOrDev]) return;

    NSError *error = nil;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:userInfo
                                                       options:0
                                                         error:&error];
    if (error || !jsonData) {
        NSLog(@"[PushDebug] Failed to encode JSON: %@", error);
        return;
    }

    NSDictionary *record = @{
        @"rawJSON": jsonData,
        @"_receivedAt": [[NSDate date] description],
        @"_source": source
    };

    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSMutableArray *existing =
    [[defaults arrayForKey:ARAPNSRecentPushPayloadsKey] mutableCopy]
    ?: [NSMutableArray array];

    [existing insertObject:record atIndex:0];
    if (existing.count > 10) {
        [existing removeLastObject];
    }

    [defaults setObject:existing forKey:ARAPNSRecentPushPayloadsKey];
}


@end
