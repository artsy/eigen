#import "ARAppNotificationsDelegate.h"

#import "ArtsyAPI+Notifications.h"
#import "ArtsyAPI+DeviceTokens.h"

#import "ARAppConstants.h"
#import "ARAnalyticsConstants.h"
#import "UIApplicationStateEnum.h"
#import "ARNotificationView.h"
#import "ARSwitchBoard.h"
#import "ARTopMenuViewController.h"
#import "ARWorksForYouReloadingHostViewController.h"
#import "ARLogger.h"
#import "ARDefaults.h"
#import "AROptions.h"

#import <ARAnalytics/ARAnalytics.h>


@implementation ARAppNotificationsDelegate

+ (void)load
{
    [JSDecoupledAppDelegate sharedAppDelegate].remoteNotificationsDelegate = [[self alloc] init];
}

#pragma mark -
#pragma mark Local Push Notification Alerts

- (void)registerForDeviceNotifications
{
    if (![AROptions boolForOption:ARPushNotificationsSettingsPromptSeen] &&
        [AROptions boolForOption:ARPushNotificationsAppleDialogueRejected]) {
        // if you've rejected Apple's push notification and you've not seen our prompt to send you to settings
        // lets show you a prompt to go to stettings
        [self displayPushNotificationSettingsPrompt];
        
    } else if (![AROptions boolForOption:ARPushNotificationsAppleDialogueSeen]) {
        // As long as you've not seen Apple's dialogue already, we will show you our pre-prompt.
        [self displayPushNotificationLocalRequestPrompt];
    }
}

- (void)displayPushNotificationLocalRequestPrompt
{
    UIAlertController *alert = [self pushNotificationPromptAlertController];

    UIAlertAction *confirmAction = [UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault
                                                          handler:^(UIAlertAction *action) {
                                                              [self registerUserInterest];
                                                          }];
    UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:@"Don't Allow" style:UIAlertActionStyleDefault
                                                         handler:^(UIAlertAction *action) {
                                                              [self registerUserDisinterest];
                                                         }];
    [alert addAction:cancelAction];
    [alert addAction:confirmAction];

    [[UIApplication sharedApplication].keyWindow.rootViewController presentViewController:alert animated:YES completion:nil];
}


- (void)displayPushNotificationSettingsPrompt
{
    UIAlertController *alert = [self pushNotificationPromptAlertController];

    UIAlertAction *settingsAction = [UIAlertAction actionWithTitle:@"Go to Settings" style:UIAlertActionStyleDefault
                                                           handler:^(UIAlertAction *action) {
                                                              [self presentSettings];
                                                           }];
    [alert addAction:settingsAction];
    [[UIApplication sharedApplication].keyWindow.rootViewController presentViewController:alert animated:YES completion:nil];
    
    [AROptions setBool:YES forOption:ARPushNotificationsSettingsPromptSeen];

}

- (void)registerUserInterest
{
    [self registerForDeviceNotificationsWithApple];
}

- (void)registerUserDisinterest
{
    // this is for analytics to hook into
}

- (void)presentSettings
{
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:UIApplicationOpenSettingsURLString]];
}

- (UIAlertController *)pushNotificationPromptAlertController
{
    return [UIAlertController alertControllerWithTitle:@"Artsy Would Like to Send You Notifications"
                                               message:@"Turn on notifications so you can get important updates about artists you follow"
                                        preferredStyle:UIAlertControllerStyleAlert];
}

#pragma mark -
#pragma mark Push Notification Register

- (void)registerForDeviceNotificationsWithApple
{
    ARActionLog(@"Registering with Apple for remote notifications.");
    UIUserNotificationType allTypes = (UIUserNotificationTypeBadge | UIUserNotificationTypeSound | UIUserNotificationTypeAlert);
    UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:allTypes categories:nil];
    [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
    [[UIApplication sharedApplication] registerForRemoteNotifications];
    
    [AROptions setBool:YES forOption:ARPushNotificationsAppleDialogueSeen];

}

#pragma mark -
#pragma mark Push Notification Delegate

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
    [AROptions setBool:YES forOption:ARPushNotificationsAppleDialogueRejected];
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

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult result))handler;
{
    [self applicationDidReceiveRemoteNotification:userInfo inApplicationState:application.applicationState];
    handler(UIBackgroundFetchResultNoData);
}

- (void)applicationDidReceiveRemoteNotification:(NSDictionary *)userInfo inApplicationState:(UIApplicationState)applicationState;
{
    NSString *uiApplicationState = [UIApplicationStateEnum toString:applicationState];
    ARActionLog(@"Incoming notification in the %@ application state: %@", uiApplicationState, userInfo);

    NSMutableDictionary *notificationInfo = [[NSMutableDictionary alloc] initWithDictionary:userInfo];
    [notificationInfo setObject:uiApplicationState forKey:@"UIApplicationState"];

    NSString *url = userInfo[@"url"];
    NSString *message = userInfo[@"aps"][@"alert"] ?: url;
    UIViewController *viewController = nil;
    if (url) {
        viewController = [ARSwitchBoard.sharedInstance loadPath:url];
        // Set the badge count on the tab that the view controller belongs to.
        NSInteger tabIndex = [[ARTopMenuViewController sharedController] indexOfRootViewController:viewController];
        if (tabIndex != NSNotFound) {
            NSUInteger count = [userInfo[@"aps"][@"badge"] unsignedLongValue];
            [[ARTopMenuViewController sharedController] setNotificationCount:count forControllerAtIndex:tabIndex];
        }
    }

    if (applicationState == UIApplicationStateBackground) {
        // A notification was received while the app is in the background.
        [self receivedNotification:notificationInfo viewController:viewController];

    } else if (applicationState == UIApplicationStateActive) {
        // A notification was received while the app was already active, so we show our own notification view.
        [self receivedNotification:notificationInfo viewController:viewController];
        [ARNotificationView showNoticeInView:[self findVisibleWindow]
                                       title:message
                                    response:^{
                                        if (viewController) {
                                            [self tappedNotification:notificationInfo viewController:viewController];
                                        }
                                    }];

    } else if (applicationState == UIApplicationStateInactive) {
        // The user tapped a notification while the app was in background.
        [self tappedNotification:notificationInfo viewController:viewController];
    }
}

- (void)receivedNotification:(NSDictionary *)notificationInfo viewController:(UIViewController *)viewController;
{
    [ARAnalytics event:ARAnalyticsNotificationReceived withProperties:notificationInfo];
    if ([viewController isKindOfClass:ARWorksForYouReloadingHostViewController.class]) {
        [(ARWorksForYouReloadingHostViewController *)viewController reloadData];
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
    return nil;
}

@end
