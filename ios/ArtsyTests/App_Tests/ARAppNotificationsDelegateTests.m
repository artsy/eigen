#import "ARAppNotificationsDelegate.h"
#import "ARAnalyticsConstants.h"
#import "ARNotificationView.h"
#import "ARSerifNavigationViewController.h"
#import "UIApplicationStateEnum.h"
#import "AREmission.h"
#import <Analytics/SEGAnalytics.h>

static NSDictionary *
DictionaryWithAppState(NSDictionary *input, UIApplicationState appState)
{
    NSMutableDictionary *dictionary = [input mutableCopy];
    dictionary[@"UIApplicationState"] = [UIApplicationStateEnum toString:appState];
    return [dictionary copy];
}

@interface ARAppNotificationsDelegate()
- (UIViewController *)getGlobalTopViewController;
@end

SpecBegin(ARAppNotificationsDelegate);

describe(@"receiveRemoteNotification", ^{
    NSDictionary *notification = @{
        @"aps": @{ @"alert": @"New Works For You", @"badge": @(42), @"content-available": @(1) },
        @"url": @"http://artsy.net/works-for-you",
    };

    __block UIApplication *app = nil;
    __block ARAppNotificationsDelegate *delegate = nil;
    __block UIApplicationState appState = -1;
    __block id mockEmissionSharedInstance = nil;
    __block id mockSegmentSharedInstance = nil;

    beforeEach(^{
        app = [UIApplication sharedApplication];
        delegate = [[ARAppNotificationsDelegate alloc] init];

        mockEmissionSharedInstance = [OCMockObject partialMockForObject:AREmission.sharedInstance];;

        // Setup a segment shared instance otherwise the tests will crash
        SEGAnalyticsConfiguration *configuration = [SEGAnalyticsConfiguration configurationWithWriteKey:@"GARBAGE"];
        [SEGAnalytics setupWithConfiguration:configuration];
    });

    afterEach(^{
        [mockEmissionSharedInstance stopMocking];
        [mockSegmentSharedInstance stopMocking];
    });

    sharedExamplesFor(@"when receiving a notification", ^(id _) {
        it(@"triggers an analytics event for receiving a notification", ^{
            [[mockEmissionSharedInstance expect] sendEvent:ARAnalyticsNotificationReceived traits:DictionaryWithAppState(notification, appState)];
            [[mockEmissionSharedInstance reject] sendEvent:ARAnalyticsNotificationTapped traits:OCMOCK_ANY];

            [delegate applicationDidReceiveRemoteNotification:notification inApplicationState:appState];

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
});

SpecEnd;
