#import "ARAppNotificationsDelegate.h"

#import "ArtsyAPI+Artworks.h"
#import "ARAppConstants.h"
#import "ARAnalyticsConstants.h"
#import "UIApplicationStateEnum.h"
#import "ARNotificationView.h"
#import "ARSwitchBoard.h"
#import "ARTopMenuViewController.h"
#import "ARLogger.h"

#import <ARAnalytics/ARAnalytics.h>


@implementation ARAppNotificationsDelegate

+ (void)load
{
    [JSDecoupledAppDelegate sharedAppDelegate].remoteNotificationsDelegate = [[self alloc] init];
}

- (void)registerForDeviceNotifications
{
    ARActionLog(@"Registering with Apple for remote notifications.");
    UIUserNotificationType allTypes = (UIUserNotificationTypeBadge | UIUserNotificationTypeSound | UIUserNotificationTypeAlert);
    UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:allTypes categories:nil];
    [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
    [[UIApplication sharedApplication] registerForRemoteNotifications];
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

    // Save device token purely for the admin settings view.
    [[NSUserDefaults standardUserDefaults] setValue:deviceToken forKey:ARAPNSDeviceTokenKey];

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
    [self applicationDidReceiveRemoteNotification:userInfo inApplicationState:application.applicationState];
}

- (void)applicationDidReceiveRemoteNotification:(NSDictionary *)userInfo inApplicationState:(UIApplicationState)applicationState;
{
    NSString *uiApplicationState = [UIApplicationStateEnum toString:applicationState];
    ARActionLog(@"Incoming notification in the %@ application state: %@", uiApplicationState, userInfo);

    NSMutableDictionary *notificationInfo = [[NSMutableDictionary alloc] initWithDictionary:userInfo];
    [notificationInfo setObject:uiApplicationState forKey:@"UIApplicationState"];
    [ARAnalytics event:ARAnalyticsNotificationReceived withProperties:notificationInfo];

    NSString *message = userInfo[@"aps"][@"alert"];
    NSString *url = userInfo[@"url"];

    if (!message) {
        message = url;
    }

    UIViewController *viewController = nil;

    if (url) {
        viewController = [ARSwitchBoard.sharedInstance loadPath:url];

        /// Always set the badge count if we can
        NSInteger tabIndex = [[ARTopMenuViewController sharedController] indexOfRootViewController:viewController];
        if (tabIndex != NSNotFound) {
            NSUInteger count = [userInfo[@"aps"][@"badge"] unsignedLongValue];
            [[ARTopMenuViewController sharedController] setNotificationCount:count forControllerAtIndex:tabIndex];
        }
    }

    if (applicationState == UIApplicationStateActive && message) {
        // app is in the foreground
        [ARNotificationView showNoticeInView:[self findVisibleWindow]
                                       title:message
                                    response:^{
            if (url) {
                [self tappedNotification:notificationInfo viewController:viewController];
            }
                                    }];
    } else {
        // app was brought from the background after a user clicked on the notification
        [self tappedNotification:notificationInfo viewController:viewController];
    }
}

- (void)tappedNotification:(NSDictionary *)notificationInfo viewController:(UIViewController *)viewController;
{
    [ARAnalytics event:ARAnalyticsNotificationTapped withProperties:notificationInfo];
    if (viewController) {
        [[ARTopMenuViewController sharedController] pushViewController:viewController];
    }
}

- (void)fetchNotificationCounts;
{
    [ArtsyAPI getWorksForYouCount:^(NSUInteger count) {
        [[ARTopMenuViewController sharedController] setNotificationCount:count forControllerAtIndex:ARTopTabControllerIndexNotifications];
    } failure:nil];
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
