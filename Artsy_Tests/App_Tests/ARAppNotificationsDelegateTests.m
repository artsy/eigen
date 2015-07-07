#import "ARAppNotificationsDelegate.h"
#import "ARSwitchBoard.h"
#import <ARAnalytics/ARAnalytics.h>
#import "ARAnalyticsConstants.h"
#import "ARNotificationView.h"
#import "ARTopMenuViewController.h"
#import "ARTopMenuNavigationDataSource.h"


SpecBegin(ARAppNotificationsDelegate);

describe(@"receiveRemoteNotification", ^{

    __block id mockApplication = nil;
    __block id mockAnalytics = nil;

    beforeEach(^{
        mockApplication = [OCMockObject partialMockForObject:[UIApplication sharedApplication]];
        mockAnalytics = [OCMockObject mockForClass:[ARAnalytics class]];
        [[mockAnalytics stub] event:OCMOCK_ANY withProperties:OCMOCK_ANY];
    });

    afterEach(^{
        [mockAnalytics stopMocking];
        [mockApplication stopMocking];
    });

    describe(@"brought back from the background", ^{
        beforeEach(^{
            UIApplicationState state = UIApplicationStateBackground;
            [[[mockApplication stub] andReturnValue:OCMOCK_VALUE(state)] applicationState];
        });

        it(@"navigates to the url provided", ^{
            id classMock = [OCMockObject mockForClass:[ARTopMenuViewController class]];
            // Just to silence runtime assertion failure.
            [[[classMock stub] andReturn:nil] sharedController];
            
            id JSON = @{ @"url" : @"http://artsy.net/feature" };
            NSData *data = [NSJSONSerialization dataWithJSONObject:JSON options:0 error:nil];
            NSDictionary *notification = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
            UIApplication *app = [UIApplication sharedApplication];

            id mock = [OCMockObject partialMockForObject:ARSwitchBoard.sharedInstance];
            [[mock expect] loadPath:@"http://artsy.net/feature"];
            [[app delegate] application:app didReceiveRemoteNotification:notification];
            [mock verify];
            [mock stopMocking];
            [classMock stopMocking];
        });

        it(@"updates the badge count", ^{
            id classMock = [OCMockObject mockForClass:[ARTopMenuViewController class]];
            id controllerMock = [OCMockObject partialMockForObject:[ARTopMenuViewController sharedController]];
            [[[classMock stub] andReturn:controllerMock] sharedController];

            [[[controllerMock stub] andReturnValue:@(ARTopTabControllerIndexNotifications)] indexOfRootViewController:OCMOCK_ANY];
            [[controllerMock expect] setBadgeNumber:42 forTabAtIndex:ARTopTabControllerIndexNotifications];

            NSDictionary *notification = @{
                @"url": @"http://artsy.net/works-for-you",
                @"aps": @{ @"badge": @(42) }
            };

            UIApplication *app = [UIApplication sharedApplication];
            [[app delegate] application:app didReceiveRemoteNotification:notification];

            [controllerMock verify];
            [controllerMock stopMocking];
            [classMock stopMocking];
        });

        it(@"triggers an analytics event for a notification with an url received and tapped", ^{
            id classMock = [OCMockObject mockForClass:[ARTopMenuViewController class]];
            // Just to silence runtime assertion failure.
            [[[classMock stub] andReturn:nil] sharedController];
            id JSON = @{ @"url" : @"http://artsy.net/feature" };
            NSData *data = [NSJSONSerialization dataWithJSONObject:JSON options:0 error:nil];
            NSDictionary *notification = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
            NSMutableDictionary *notificationWithAppState = [[NSMutableDictionary alloc] initWithDictionary:notification];
            [notificationWithAppState setObject:@"background" forKey:@"UIApplicationState"];
            UIApplication *app = [UIApplication sharedApplication];
            id mock = [OCMockObject mockForClass:[ARAnalytics class]];
            [[mock expect] event:ARAnalyticsNotificationReceived withProperties:notificationWithAppState];
            [[mock expect] event:ARAnalyticsNotificationTapped withProperties:notificationWithAppState];
            [[app delegate] application:app didReceiveRemoteNotification:notification];
            [mock verify];
            [mock stopMocking];
            [classMock stopMocking];
        });

        it(@"triggers an analytics event for a notification without a url received and tapped", ^{
            id JSON = @{ @"aps" : @{ @"alert" : @"hello world" } };
            NSData *data = [NSJSONSerialization dataWithJSONObject:JSON options:0 error:nil];
            NSDictionary *notification = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
            NSMutableDictionary *notificationWithAppState = [[NSMutableDictionary alloc] initWithDictionary:notification];
            [notificationWithAppState setObject:@"background" forKey:@"UIApplicationState"];
            UIApplication *app = [UIApplication sharedApplication];
            id mock = [OCMockObject mockForClass:[ARAnalytics class]];
            [[mock expect] event:ARAnalyticsNotificationReceived withProperties:notificationWithAppState];
            [[mock expect] event:ARAnalyticsNotificationTapped withProperties:notificationWithAppState];
            [[app delegate] application:app didReceiveRemoteNotification:notification];
            [mock verify];
            [mock stopMocking];
        });

        it(@"does not display the message in aps/alert", ^{
            id JSON = @{ @"aps" : @{ @"alert" : @"hello world" } };
            NSData *data = [NSJSONSerialization dataWithJSONObject:JSON options:0 error:nil];
            NSDictionary *notification = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
            id mock = [OCMockObject mockForClass:[ARNotificationView class]];
            [[mock reject]
             showNoticeInView:OCMOCK_ANY
             title:OCMOCK_ANY
             hideAfter:0
             response:OCMOCK_ANY];
            UIApplication *app = [UIApplication sharedApplication];
            [[app delegate] application:app didReceiveRemoteNotification:notification];
            [mock verify];
            [mock stopMocking];
        });
    });

    describe(@"running in the foreground", ^{
        beforeEach(^{
            UIApplicationState state = UIApplicationStateActive;
            [[[mockApplication stub] andReturnValue:OCMOCK_VALUE(state)] applicationState];
        });

        it(@"triggers only an analytics event for the notification received", ^{
            id JSON = @{ @"url" : @"http://artsy.net/feature" };
            NSData *data = [NSJSONSerialization dataWithJSONObject:JSON options:0 error:nil];
            NSDictionary *notification = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
            NSMutableDictionary *notificationWithAppState = [[NSMutableDictionary alloc] initWithDictionary:notification];
            [notificationWithAppState setObject:@"active" forKey:@"UIApplicationState"];
            UIApplication *app = [UIApplication sharedApplication];
            id mock = [OCMockObject mockForClass:[ARAnalytics class]];
            [[mock expect] event:ARAnalyticsNotificationReceived withProperties:notificationWithAppState];
            [[mock reject] event:ARAnalyticsNotificationTapped withProperties:notificationWithAppState];
            [[app delegate] application:app didReceiveRemoteNotification:notification];
            [mock verify];
            [mock stopMocking];
        });

        it(@"displays message in aps/alert", ^{
            id JSON = @{ @"url" : @"http://artsy.net/feature", @"aps" : @{ @"alert" : @"hello world" } };
            NSData *data = [NSJSONSerialization dataWithJSONObject:JSON options:0 error:nil];
            NSDictionary *notification = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
            id mock = [OCMockObject mockForClass:[ARNotificationView class]];
            [[mock expect]
             showNoticeInView:OCMOCK_ANY
             title:@"hello world"
             hideAfter:0
             response:OCMOCK_ANY];
            UIApplication *app = [UIApplication sharedApplication];
            [[app delegate] application:app didReceiveRemoteNotification:notification];
            [mock verify];
            [mock stopMocking];
        });

        it(@"defaults message to url", ^{
            id JSON = @{ @"url" : @"http://artsy.net/feature" };
            NSData *data = [NSJSONSerialization dataWithJSONObject:JSON options:0 error:nil];
            NSDictionary *notification = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
            id mock = [OCMockObject mockForClass:[ARNotificationView class]];
            [[mock expect]
             showNoticeInView:OCMOCK_ANY
             title:@"http://artsy.net/feature"
             hideAfter:0
             response:OCMOCK_ANY];
            UIApplication *app = [UIApplication sharedApplication];
            [[app delegate] application:app didReceiveRemoteNotification:notification];
            [mock verify];
            [mock stopMocking];
        });

        pending(@"displays message in aps/alert and navigates to url provided");
    });
});

SpecEnd
