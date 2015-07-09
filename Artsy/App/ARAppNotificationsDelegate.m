#import "ARAppNotificationsDelegate.h"
#import "ARAnalyticsConstants.h"
#import "UIApplicationStateEnum.h"
#import "ARNotificationView.h"
#import <ARAnalytics/ARAnalytics.h>


@implementation ARAppNotificationsDelegate

+ (void)load
{
    [JSDecoupledAppDelegate sharedAppDelegate].remoteNotificationsDelegate = [[self alloc] init];
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
#if (TARGET_IPHONE_SIMULATOR == 0)
    ARErrorLog(@"Error registering for remote notifications: %@", error.localizedDescription);
#endif
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceTokenData
{
    // http://stackoverflow.com/questions/9372815/how-can-i-convert-my-device-token-nsdata-into-an-nsstring
    const unsigned *tokenBytes = [deviceTokenData bytes];
    NSString *deviceToken = [NSString stringWithFormat:@"%08x%08x%08x%08x%08x%08x%08x%08x",
                                                       ntohl(tokenBytes[0]), ntohl(tokenBytes[1]), ntohl(tokenBytes[2]),
                                                       ntohl(tokenBytes[3]), ntohl(tokenBytes[4]), ntohl(tokenBytes[5]),
                                                       ntohl(tokenBytes[6]), ntohl(tokenBytes[7])];

    ARActionLog(@"Got device notification token: %@", deviceToken);

// We only record device tokens on the Artsy service in case of Beta or App Store builds.
#ifndef DEBUG
    [ARAnalytics setUserProperty:ARAnalyticsEnabledNotificationsProperty toValue:@"true"];

    // Apple says to always save the device token, as it may change. In addition, since we allow a device to register
    // for notifications even if the user has not signed-in, we must be sure to always update this to ensure the Artsy
    // service always has an up-to-date record of devices and associated users.
    //
    // https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/IPhoneOSClientImp.html#//apple_ref/doc/uid/TP40008194-CH103-SW2
    [ArtsyAPI setAPNTokenForCurrentDevice:deviceToken success:^(id response) {
        ARActionLog(@"Pushed device token to Artsy's servers");
    } failure:^(NSError *error) {
        ARErrorLog(@"Couldn't push the device token to Artsy, error: %@", error.localizedDescription);
    }];
#endif
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
{
    UIApplication *app = [UIApplication sharedApplication];
    NSString *uiApplicationState = [UIApplicationStateEnum toString:app.applicationState];

    ARActionLog(@"Incoming notification in the %@ application state: %@", uiApplicationState, userInfo);

    NSMutableDictionary *notificationInfo = [[NSMutableDictionary alloc] initWithDictionary:userInfo];
    [notificationInfo setObject:uiApplicationState forKey:@"UIApplicationState"];
    [ARAnalytics event:ARAnalyticsNotificationReceived withProperties:notificationInfo];

    NSString *message = [[userInfo objectForKey:@"aps"] objectForKey:@"alert"];
    NSString *url = userInfo[@"url"];

    if (!message) {
        message = url;
    }

    if (app.applicationState == UIApplicationStateActive && message) {
        // app is in the foreground
        [ARNotificationView showNoticeInView:[self findVisibleWindow]
                                       title:message
                                   hideAfter:0
                                    response:^{
                if (url) {
                    [ARAnalytics event:ARAnalyticsNotificationTapped withProperties:notificationInfo];

                    UIViewController *viewController = [ARSwitchBoard.sharedInstance loadPath:url];
                    if (viewController) {
                        [[ARTopMenuViewController sharedController] pushViewController:viewController];
                    }
                }
                                    }];
    } else {
        // app was brought from the background after a user clicked on the notification
        [ARAnalytics event:ARAnalyticsNotificationTapped withProperties:notificationInfo];
        if (url) {
            UIViewController *viewController = [ARSwitchBoard.sharedInstance loadPath:url];

            if (viewController) {
                [[ARTopMenuViewController sharedController] pushViewController:viewController];
            }
        }
    }
}

- (void)registerForDeviceNotifications
{
    ARActionLog(@"Registering with Apple for remote notifications.");
    UIUserNotificationType allTypes = (UIUserNotificationTypeBadge | UIUserNotificationTypeSound | UIUserNotificationTypeAlert);
    UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:allTypes categories:nil];
    [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
    [[UIApplication sharedApplication] registerForRemoteNotifications];
}

- (UIWindow *)findVisibleWindow
{
    NSArray *windows = [[UIApplication sharedApplication] windows];
    for (UIWindow *window in [windows reverseObjectEnumerator]) {
        if (!window.hidden) {
            return window;
        }
    }
    return NULL;
}

@end
