#import "AppDelegate.h"
#import "AppDelegate+Notifications.h"

#import "ARAnalyticsConstants.h"
#import "ARNotificationView.h"
#import "ARSerifNavigationViewController.h"
#import "UIApplicationStateEnum.h"
#import "AREmission.h"
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

@interface ARAppDelegate()
- (UIViewController *)getGlobalTopViewController;
@end

SpecBegin(ARAppNotificationsDelegate);

describe(@"receiveRemoteNotification", ^{
    NSDictionary *notification = @{
        @"aps": @{ @"alert": @"New Works For You", @"badge": @(42), @"content-available": @(1) },
        @"url": @"http://artsy.net/works-for-you",
    };

    __block UIApplication *app = nil;
    __block ARAppDelegate *delegate = nil;
    __block UIApplicationState appState = -1;
    __block id mockEmissionSharedInstance = nil;
    __block UNNotification *unNotification = nil;
    __block UNUserNotificationCenter *currentCenter = nil;
    __block void (^completionHandler)(UNNotificationPresentationOptions) = ^(UNNotificationPresentationOptions options) {};

    beforeEach(^{
        app = [UIApplication sharedApplication];
        delegate = [ARAppDelegate sharedInstance];

        mockEmissionSharedInstance = [OCMockObject partialMockForObject:AREmission.sharedInstance];;
    });

    afterEach(^{
        [mockEmissionSharedInstance stopMocking];
    });

    sharedExamplesFor(@"when receiving a notification", ^(NSDictionary *prefs) {
        it(@"triggers an analytics event for receiving a notification", ^{

            BOOL isInForeground = [prefs[@"isInForeground"] boolValue];

            [[mockEmissionSharedInstance expect] sendEvent:ARAnalyticsNotificationReceived traits:DictionaryWithAppState(notification, appState)];
            [[mockEmissionSharedInstance reject] sendEvent:ARAnalyticsNotificationTapped traits:OCMOCK_ANY];

            if (isInForeground) {
                [delegate userNotificationCenter:currentCenter willPresentNotification:unNotification withCompletionHandler:completionHandler];
            } else {
                [delegate applicationDidReceiveRemoteNotification:notification inApplicationState:appState];
            }

            [mockEmissionSharedInstance verify];
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

        describe(@"with stubbed top menu VC", ^{
            it(@"navigates to the url provided", ^{
                [[mockEmissionSharedInstance expect] navigate:@"http://artsy.net/works-for-you" withProps: @{}];
                [delegate applicationDidReceiveRemoteNotification:notification inApplicationState:appState];

                [mockEmissionSharedInstance verify];
            });

            it(@"triggers an analytics event when a notification has been tapped", ^{
                [[mockEmissionSharedInstance reject] sendEvent:ARAnalyticsNotificationReceived traits:OCMOCK_ANY];
                [[mockEmissionSharedInstance expect] sendEvent:ARAnalyticsNotificationTapped traits:DictionaryWithAppState(notification, appState)];

                [delegate applicationDidReceiveRemoteNotification:notification inApplicationState:appState];

                [mockEmissionSharedInstance verify];
            });

            it(@"does not display the message in aps/alert", ^{
                id mock = [OCMockObject mockForClass:[ARNotificationView class]];
                [[mock reject] showNoticeInView:OCMOCK_ANY title:OCMOCK_ANY response:OCMOCK_ANY];
                [delegate applicationDidReceiveRemoteNotification:notification inApplicationState:appState];

                [mock verify];
                [mock stopMocking];
            });
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

        it(@"triggers an analytics event when a notification has been tapped", ^{
            [[mockEmissionSharedInstance stub] sendEvent:ARAnalyticsNotificationReceived traits:OCMOCK_ANY];
            [[mockEmissionSharedInstance expect] sendEvent:ARAnalyticsNotificationTapped traits:DictionaryWithAppState(notification, appState)];

            UNNotificationResponse *response = OCMClassMock([UNNotificationResponse class]);
            OCMStub([response notification]).andReturn(unNotification);
            void (^completionHandler)(void) = ^() {};

            [delegate userNotificationCenter:currentCenter didReceiveNotificationResponse:response withCompletionHandler:completionHandler];


            [mockEmissionSharedInstance verify];
        });

        it(@"handles notification with ab_uri", ^{
            // Notification With APPBOY Uri
            NSDictionary *notification = @{
                @"aps": @{ @"alert": @"New Works For You", @"badge": @(42), @"content-available": @(1) },
                @"ab_uri": @"http://artsy.net/works-for-you",
            };

            NSMutableDictionary *expectedNotification = [notification mutableCopy];
            [expectedNotification removeObjectForKey:@"ab_uri"];
            expectedNotification[@"url"] = notification[@"ab_uri"];

            [[mockEmissionSharedInstance stub] sendEvent:ARAnalyticsNotificationReceived traits:OCMOCK_ANY];
            [[mockEmissionSharedInstance expect] sendEvent:ARAnalyticsNotificationTapped traits:DictionaryWithAppState(expectedNotification, appState)];

            UNNotificationResponse *response = OCMClassMock([UNNotificationResponse class]);
            UNNotificationRequest *request = OCMClassMock([UNNotificationRequest class]);
            UNNotificationContent *content = OCMClassMock([UNMutableNotificationContent class]);
            NSDictionary *userInfo = notification;

            OCMStub([response notification]).andReturn(unNotification);
            OCMStub([unNotification request]).andReturn(request);
            OCMStub([request content]).andReturn(content);
            OCMStub([content userInfo]).andReturn(userInfo);
            void (^completionHandler)(void) = ^() {};

            [delegate userNotificationCenter:currentCenter didReceiveNotificationResponse:response withCompletionHandler:completionHandler];

            [mockEmissionSharedInstance verify];
        });
    });
});

SpecEnd;
