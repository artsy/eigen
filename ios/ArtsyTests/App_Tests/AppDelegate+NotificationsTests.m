#import "AppDelegate+Notifications.h"
#import "ARAppDelegateHelper+Testing.h"

#import "ARAnalyticsConstants.h"
#import "ARNotificationView.h"
#import "ARSerifNavigationViewController.h"
#import "UIApplicationStateEnum.h"
#import "AREmission.h"
#import "ARNotificationsManager.h"
#import "UserNotifications/UNNotification.h"
#import "UserNotifications/UNNotificationRequest.h"
#import "UserNotifications/UNNotificationContent.h"

static NSDictionary *
DictionaryWithAppState(NSDictionary *input, UIApplicationState appState)
{
    NSMutableDictionary *dictionary = [input mutableCopy];
    if (appState != -1) {
        dictionary[@"UIApplicationState"] = [UIApplicationStateEnum toString:appState];
    }
    return [dictionary copy];
}

@interface ARAppDelegateHelper()
- (UIViewController *)getGlobalTopViewController;
@end

SpecBegin(ARAppNotificationsDelegate);

describe(@"receiveRemoteNotification", ^{
    NSDictionary *notification = @{
        @"aps": @{ @"alert": @"New Works For You", @"badge": @(42), @"content-available": @(1) },
        @"url": @"http://artsy.net/works-for-you",
    };

    __block ARAppDelegateHelper *delegate = nil;
    __block UIApplicationState appState = -1;
    __block id mockEmissionSharedInstance = nil;
    __block id mockNotificationsManager = nil;
    __block UNNotification *unNotification = nil;
    __block UNUserNotificationCenter *currentCenter = nil;
    __block void (^completionHandler)(UNNotificationPresentationOptions) = ^(UNNotificationPresentationOptions options) {};

    beforeEach(^{
        delegate = [[ARAppDelegateHelper alloc] init];
        [ARAppDelegateHelper setSharedInstanceForTesting:delegate];

        mockEmissionSharedInstance = [OCMockObject partialMockForObject:AREmission.sharedInstance];
        mockNotificationsManager = [OCMockObject mockForClass:[ARNotificationsManager class]];

        OCMStub([mockEmissionSharedInstance notificationsManagerModule]).andReturn(mockNotificationsManager);
    });

    afterEach(^{
        [mockEmissionSharedInstance stopMocking];
        [mockNotificationsManager stopMocking];
        [ARAppDelegateHelper setSharedInstanceForTesting:nil];
    });

    sharedExamplesFor(@"when receiving a notification", ^(NSDictionary *prefs) {
        it(@"forwards notification to React Native", ^{

            BOOL isInForeground = [prefs[@"isInForeground"] boolValue];

            if (isInForeground) {
                // In foreground, should add "Active" state to payload
                [[mockNotificationsManager expect] notificationReceivedWithPayload:[OCMArg checkWithBlock:^BOOL(NSDictionary *payload) {
                    return [payload[@"UIApplicationState"] isEqualToString:@"Active"] &&
                           [payload[@"url"] isEqualToString:@"http://artsy.net/works-for-you"];
                }]];
                [delegate userNotificationCenter:currentCenter willPresentNotification:unNotification withCompletionHandler:completionHandler];
            } else {
                // In background, should add application state to payload
                [[mockNotificationsManager expect] notificationReceivedWithPayload:DictionaryWithAppState(notification, appState)];
                [delegate applicationDidReceiveRemoteNotification:notification inApplicationState:appState];
            }

            [mockNotificationsManager verify];
        });
    });

    describe(@"while running in the background", ^{
        beforeEach(^{
            appState = UIApplicationStateBackground;
        });

        itBehavesLike(@"when receiving a notification", nil);
    });

    describe(@"brought back from the background", ^{
        beforeEach(^{
            appState = UIApplicationStateInactive;
        });

        it(@"forwards notification to React Native with UIApplicationState", ^{
            [[mockNotificationsManager expect] notificationReceivedWithPayload:DictionaryWithAppState(notification, appState)];
            [delegate applicationDidReceiveRemoteNotification:notification inApplicationState:appState];

            [mockNotificationsManager verify];
        });
    });

    describe(@"running in the foreground", ^{
        beforeEach(^{
            appState = -1;
            currentCenter = [UNUserNotificationCenter currentNotificationCenter];

            // mock UserNotification notificaiton
            unNotification = OCMClassMock([UNNotification class]);
            UNNotificationRequest *request = OCMClassMock([UNNotificationRequest class]);
            UNNotificationContent *content = OCMClassMock([UNMutableNotificationContent class]);
            NSDictionary *userInfo = notification;

            OCMStub([unNotification request]).andReturn(request);
            OCMStub([request content]).andReturn(content);
            OCMStub([content userInfo]).andReturn(userInfo);
        });

        itBehavesLike(@"when receiving a notification", @{@"isInForeground": @true});

        it(@"forwards notification to React Native when tapped with NotificationAction", ^{
            [[mockNotificationsManager expect] notificationReceivedWithPayload:[OCMArg checkWithBlock:^BOOL(NSDictionary *payload) {
                return [payload[@"NotificationAction"] isEqualToString:@"Tapped"] &&
                       [payload[@"url"] isEqualToString:@"http://artsy.net/works-for-you"];
            }]];

            UNNotificationResponse *response = OCMClassMock([UNNotificationResponse class]);
            OCMStub([response notification]).andReturn(unNotification);
            void (^completionHandler)(void) = ^() {};

            [delegate userNotificationCenter:currentCenter didReceiveNotificationResponse:response withCompletionHandler:completionHandler];

            [mockNotificationsManager verify];
        });

        it(@"handles notification with ab_uri", ^{
            // Notification With APPBOY Uri
            NSDictionary *abUriNotification = @{
                @"aps": @{ @"alert": @"New Works For You", @"badge": @(42), @"content-available": @(1) },
                @"ab_uri": @"http://artsy.net/works-for-you",
            };

            [[mockNotificationsManager expect] notificationReceivedWithPayload:[OCMArg checkWithBlock:^BOOL(NSDictionary *payload) {
                return [payload[@"NotificationAction"] isEqualToString:@"Tapped"] &&
                       [payload[@"ab_uri"] isEqualToString:@"http://artsy.net/works-for-you"];
            }]];

            UNNotificationResponse *response = OCMClassMock([UNNotificationResponse class]);
            UNNotification *abUriUnNotification = OCMClassMock([UNNotification class]);
            UNNotificationRequest *request = OCMClassMock([UNNotificationRequest class]);
            UNNotificationContent *content = OCMClassMock([UNMutableNotificationContent class]);
            NSDictionary *userInfo = abUriNotification;

            OCMStub([response notification]).andReturn(abUriUnNotification);
            OCMStub([abUriUnNotification request]).andReturn(request);
            OCMStub([request content]).andReturn(content);
            OCMStub([content userInfo]).andReturn(userInfo);
            void (^completionHandler)(void) = ^() {};

            [delegate userNotificationCenter:currentCenter didReceiveNotificationResponse:response withCompletionHandler:completionHandler];

            [mockNotificationsManager verify];
        });
    });
});

SpecEnd;
