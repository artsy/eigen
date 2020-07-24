#import "ARAppNotificationsDelegate.h"
#import "ARSwitchBoard.h"
#import "ARSwitchBoard+Eigen.h"
#import <ARAnalytics/ARAnalytics.h>
#import "ARAnalyticsConstants.h"
#import "ARNotificationView.h"
#import "ARTopMenuViewController.h"
#import "ARSerifNavigationViewController.h"
#import "ARTopMenuNavigationDataSource.h"
#import "UIApplicationStateEnum.h"
#import <Emission/ARBidFlowViewController.h>

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
    __block id mockAnalytics = nil;
    __block id mockTopMenuVC = nil;

    beforeEach(^{
        app = [UIApplication sharedApplication];
        delegate = [[ARAppNotificationsDelegate alloc] init];

        mockAnalytics = [OCMockObject mockForClass:[ARAnalytics class]];
        mockTopMenuVC = [OCMockObject mockForClass:ARTopMenuViewController.class];
    });

    afterEach(^{
        [mockAnalytics stopMocking];
        [mockTopMenuVC stopMocking];
    });

    sharedExamplesFor(@"when receiving a notification", ^(id _) {
        it(@"triggers an analytics event for receiving a notification", ^{
            [[mockAnalytics expect] event:ARAnalyticsNotificationReceived withProperties:DictionaryWithAppState(notification, appState)];
            [[mockAnalytics reject] event:ARAnalyticsNotificationTapped withProperties:OCMOCK_ANY];

            [delegate applicationDidReceiveRemoteNotification:notification inApplicationState:appState];

            [mockAnalytics verify];
        });
    });

    describe(@"while running in the background", ^{
        beforeEach(^{
            appState = UIApplicationStateBackground;
            [[[mockTopMenuVC stub] andReturn:nil] sharedController];
        });

        itBehavesLike(@"when receiving a notification", nil);
    });

    describe(@"brought back from the background", ^{
        beforeEach(^{
            appState = UIApplicationStateInactive;
        });

        describe(@"with stubbed top menu VC", ^{
            beforeEach(^{
                [[[mockTopMenuVC stub] andReturn:nil] sharedController];
            });

            it(@"navigates to the url provided", ^{
                id mock = [OCMockObject partialMockForObject:ARSwitchBoard.sharedInstance];
                [[mock expect] loadPath:@"http://artsy.net/works-for-you"];
                [delegate applicationDidReceiveRemoteNotification:notification inApplicationState:appState];

                [mock verify];
                [mock stopMocking];
            });

            it(@"triggers an analytics event when a notification has been tapped", ^{
                [[mockAnalytics reject] event:ARAnalyticsNotificationReceived withProperties:OCMOCK_ANY];
                [[mockAnalytics expect] event:ARAnalyticsNotificationTapped withProperties:DictionaryWithAppState(notification, appState)];

                [delegate applicationDidReceiveRemoteNotification:notification inApplicationState:appState];

                [mockAnalytics verify];
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
            appState = UIApplicationStateActive;
            [[[mockTopMenuVC stub] andReturn:nil] sharedController];
        });

        itBehavesLike(@"when receiving a notification", nil);

        it(@"displays a notification", ^{
            id mock = [OCMockObject mockForClass:[ARNotificationView class]];
            [[mock expect] showNoticeInView:OCMOCK_ANY title:@"New Works For You" response:OCMOCK_ANY];

            [delegate applicationDidReceiveRemoteNotification:notification inApplicationState:appState];

            [mock verify];
            [mock stopMocking];
        });

        it(@"triggers an analytics event when a notification has been tapped", ^{
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
            id mock = [OCMockObject mockForClass:[ARNotificationView class]];
            [[mock expect] showNoticeInView:OCMOCK_ANY title:@"http://artsy.net/feature" response:OCMOCK_ANY];
            [delegate applicationDidReceiveRemoteNotification:@{ @"url" : @"http://artsy.net/feature" } inApplicationState:appState];

            [mock verify];
            [mock stopMocking];
        });

        it(@"suppresses showing the notification view when a notification about outbidding ", ^{
            UIViewController *globalRootController = [UIViewController new];
            ARBidFlowViewController *bidController = [[ARBidFlowViewController alloc] initWithArtworkID:@"artwork-by-someone-famous" saleID:@"some-sale-id"];
            ARSerifNavigationViewController *navigationController = [[ARSerifNavigationViewController alloc] initWithRootViewController:bidController];

            id mockGlbalRootController = [OCMockObject partialMockForObject:globalRootController];
            [[[mockGlbalRootController stub] andReturn:navigationController] presentedViewController];

            id mockedNotificationsDelegate = [OCMockObject partialMockForObject:delegate];
            [[[mockedNotificationsDelegate stub] andReturn:mockGlbalRootController] getGlobalTopViewController];

            id mock = [OCMockObject mockForClass:[ARNotificationView class]];
            [[mock reject] showNoticeInView:OCMOCK_ANY title:OCMOCK_ANY response:OCMOCK_ANY];

            [delegate applicationDidReceiveRemoteNotification:@{ @"sale_slug" : @"some-sale-id", @"artwork_slug": @"artwork-by-someone-famous", @"action": @"bid outbid" } inApplicationState:appState];

            [mock verify];
            [mock stopMocking];
            [mockedNotificationsDelegate stopMocking];
        });

        it(@"shows the notification view when a notification about bidding stuff but not the action outbid ", ^{
            ARBidFlowViewController *bidController = [[ARBidFlowViewController alloc] initWithArtworkID:@"asd1432asda" saleID:@"123ffg3edfsd"];

            id mockedNotificationsDelegate = [OCMockObject partialMockForObject:delegate];
            [[[mockedNotificationsDelegate stub] andReturn:bidController] getGlobalTopViewController];

            id mock = [OCMockObject mockForClass:[ARNotificationView class]];
            [[mock expect] showNoticeInView:OCMOCK_ANY title:OCMOCK_ANY response:OCMOCK_ANY];

            [delegate applicationDidReceiveRemoteNotification:@{ @"sale_id" : @"123ffg3edfsd", @"artwork_id": @"asd1432asda", @"action": @"winning" } inApplicationState:appState];

            [mock verify];
            [mock stopMocking];
            [mockedNotificationsDelegate stopMocking];
        });
    });
});

SpecEnd;
