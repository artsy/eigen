#import "ARAppNotificationsDelegate.h"
#import "ARSwitchBoard.h"
#import "ARSwitchboard+Eigen.h"
#import <ARAnalytics/ARAnalytics.h>
#import "ARAnalyticsConstants.h"
#import "ARNotificationView.h"
#import "ARTopMenuViewController.h"
#import "ARTopMenuNavigationDataSource.h"
#import "UIApplicationStateEnum.h"


static NSDictionary *
DictionaryWithAppState(NSDictionary *input, UIApplicationState appState) {
    NSMutableDictionary *dictionary = [input mutableCopy];
    dictionary[@"UIApplicationState"] = [UIApplicationStateEnum toString:appState];
    return [dictionary copy];
}


SpecBegin(ARAppNotificationsDelegate);

describe(@"receiveRemoteNotification", ^{
    __block UIApplication *app = nil;
    __block ARAppNotificationsDelegate *delegate = nil;
    __block UIApplicationState appState = -1;
    __block id mockAnalytics = nil;
    __block id mockTopMenuVC = nil;

    beforeEach(^{
        app = [UIApplication sharedApplication];
        delegate = (ARAppNotificationsDelegate *)[JSDecoupledAppDelegate sharedAppDelegate].remoteNotificationsDelegate;

        mockAnalytics = [OCMockObject mockForClass:[ARAnalytics class]];
        mockTopMenuVC = [OCMockObject mockForClass:ARTopMenuViewController.class];
    });

    afterEach(^{
        [mockAnalytics stopMocking];
        [mockTopMenuVC stopMocking];
    });

    describe(@"while running in the background", ^{
        beforeEach(^{
            appState = UIApplicationStateBackground;
        });

        it(@"triggers an analytics event for receiving a notification", ^{
            [[[mockTopMenuVC stub] andReturn:nil] sharedController];

            NSDictionary *notification = @{
                @"aps": @{ @"alert": @"New Works For You", @"badge": @(42), @"content-available": @(1) },
                @"url": @"http://artsy.net/works-for-you",
            };

            [[mockAnalytics expect] event:ARAnalyticsNotificationReceived withProperties:DictionaryWithAppState(notification, appState)];
            [[mockAnalytics reject] event:ARAnalyticsNotificationTapped withProperties:OCMOCK_ANY];

            [delegate applicationDidReceiveRemoteNotification:notification inApplicationState:appState];

            [mockAnalytics verify];
        });
    });

    describe(@"brought back from the background", ^{
        beforeEach(^{
            appState = UIApplicationStateInactive;
        });

        it(@"navigates to the url provided", ^{
            [[[mockTopMenuVC stub] andReturn:nil] sharedController];

            id JSON = @{ @"url" : @"http://artsy.net/feature" };
            NSData *data = [NSJSONSerialization dataWithJSONObject:JSON options:0 error:nil];
            NSDictionary *notification = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
            id mock = [OCMockObject partialMockForObject:ARSwitchBoard.sharedInstance];

            [[mock expect] loadPath:@"http://artsy.net/feature"];
            [delegate applicationDidReceiveRemoteNotification:notification inApplicationState:appState];

            [mock verify];
            [mock stopMocking];
        });

        it(@"updates the badge count", ^{
            id controllerMock = [OCMockObject partialMockForObject:[ARTopMenuViewController sharedController]];
            [[[mockTopMenuVC stub] andReturn:controllerMock] sharedController];

            [[[controllerMock stub] andReturnValue:@(ARTopTabControllerIndexNotifications)] indexOfRootViewController:OCMOCK_ANY];
            [[controllerMock expect] setNotificationCount:42 forControllerAtIndex:ARTopTabControllerIndexNotifications];

            NSDictionary *notification = @{
                @"url": @"http://artsy.net/works-for-you",
                @"aps": @{ @"badge": @(42) }
            };

            [delegate applicationDidReceiveRemoteNotification:notification inApplicationState:appState];

            [controllerMock verify];
            [controllerMock stopMocking];
        });

        it(@"triggers an analytics event when a notification has been tapped", ^{
            [[[mockTopMenuVC stub] andReturn:nil] sharedController];

            NSDictionary *notification = @{
                @"aps": @{ @"alert": @"New Works For You", @"badge": @(42), @"content-available": @(1) },
                @"url": @"http://artsy.net/works-for-you",
            };

            [[mockAnalytics reject] event:ARAnalyticsNotificationReceived withProperties:OCMOCK_ANY];
            [[mockAnalytics expect] event:ARAnalyticsNotificationTapped withProperties:DictionaryWithAppState(notification, appState)];

            [delegate applicationDidReceiveRemoteNotification:notification inApplicationState:appState];

            [mockAnalytics verify];
        });

        it(@"does not display the message in aps/alert", ^{
            [[[mockTopMenuVC stub] andReturn:nil] sharedController];

            id JSON = @{ @"aps" : @{ @"alert" : @"hello world" } };
            NSData *data = [NSJSONSerialization dataWithJSONObject:JSON options:0 error:nil];
            NSDictionary *notification = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
            id mock = [OCMockObject mockForClass:[ARNotificationView class]];

            [[mock reject] showNoticeInView:OCMOCK_ANY title:OCMOCK_ANY response:OCMOCK_ANY];
            [delegate applicationDidReceiveRemoteNotification:notification inApplicationState:appState];

            [mock verify];
            [mock stopMocking];
        });
    });

    describe(@"running in the foreground", ^{
        beforeEach(^{
            appState = UIApplicationStateActive;
        });

        it(@"triggers an analytics event for receiving a notification", ^{
            [[[mockTopMenuVC stub] andReturn:nil] sharedController];

            NSDictionary *notification = @{
                @"aps": @{ @"alert": @"New Works For You", @"badge": @(42), @"content-available": @(1) },
                @"url": @"http://artsy.net/works-for-you",
            };

            [[mockAnalytics expect] event:ARAnalyticsNotificationReceived withProperties:DictionaryWithAppState(notification, appState)];
            [[mockAnalytics reject] event:ARAnalyticsNotificationTapped withProperties:OCMOCK_ANY];

            [delegate applicationDidReceiveRemoteNotification:notification inApplicationState:appState];

            [mockAnalytics verify];
        });

        it(@"displays a notification", ^{
            [[[mockTopMenuVC stub] andReturn:nil] sharedController];

           NSDictionary *notification = @{
                @"aps": @{ @"alert": @"New Works For You", @"badge": @(42), @"content-available": @(1) },
                @"url": @"http://artsy.net/works-for-you",
            };

            id mock = [OCMockObject mockForClass:[ARNotificationView class]];
            [[mock expect] showNoticeInView:OCMOCK_ANY title:@"New Works For You" response:OCMOCK_ANY];

            [delegate applicationDidReceiveRemoteNotification:notification inApplicationState:appState];

            [mock verify];
            [mock stopMocking];
        });

        it(@"triggers an analytics event when a notification has been tapped", ^{
            [[[mockTopMenuVC stub] andReturn:nil] sharedController];

            NSDictionary *notification = @{
                @"aps": @{ @"alert": @"New Works For You", @"badge": @(42), @"content-available": @(1) },
                @"url": @"http://artsy.net/works-for-you",
            };

            id mockNotificationView = [OCMockObject mockForClass:[ARNotificationView class]];
            [[mockNotificationView stub] showNoticeInView:OCMOCK_ANY
                                                    title:OCMOCK_ANY
                                                 response:[OCMArg checkWithBlock:^(dispatch_block_t callback) {
                                                    callback();
                                                    return YES;
                                                 }]];

            [[mockAnalytics stub] event:ARAnalyticsNotificationReceived withProperties:OCMOCK_ANY];
            [[mockAnalytics expect] event:ARAnalyticsNotificationTapped withProperties:DictionaryWithAppState(notification, appState)];

            [delegate applicationDidReceiveRemoteNotification:notification inApplicationState:appState];

            [mockAnalytics verify];
            [mockNotificationView stopMocking];
        });

        it(@"defaults message to url", ^{
            [[[mockTopMenuVC stub] andReturn:nil] sharedController];

            id JSON = @{ @"url" : @"http://artsy.net/feature" };
            NSData *data = [NSJSONSerialization dataWithJSONObject:JSON options:0 error:nil];
            NSDictionary *notification = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
            id mock = [OCMockObject mockForClass:[ARNotificationView class]];

            [[mock expect] showNoticeInView:OCMOCK_ANY title:@"http://artsy.net/feature" response:OCMOCK_ANY];
            [delegate applicationDidReceiveRemoteNotification:notification inApplicationState:appState];

            [mock verify];
            [mock stopMocking];
        });

        pending(@"displays message in aps/alert and navigates to url provided");
    });
});

SpecEnd;
