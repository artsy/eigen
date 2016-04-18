#import "ARWorksForYouReloadingHostViewController.h"
#import "ARStubbedWorksForYouNetworkModel.h"


@interface ARWorksForYouViewController (Private)
@property (nonatomic, strong, readwrite) id<ARWorksForYouNetworkModelable> worksForYouNetworkModel;
@end


@interface ARWorksForYouReloadingHostViewController (Private)
@property (nonatomic, strong, readwrite) NSDate *lastLoadedAt;
@end

SpecBegin(ARWorksForYouReloadingHostViewController);

__block ARWorksForYouReloadingHostViewController *hostViewController;

beforeEach(^{
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/me/notifications" withResponse:@{}];

    ARStubbedWorksForYouNetworkModel *networkModel = [ARStubbedWorksForYouNetworkModel new];
    [networkModel stubNotificationItemWithNumberOfArtworks:2];
    [networkModel stubNotificationItemWithNumberOfArtworks:1];

    hostViewController = [ARWorksForYouReloadingHostViewController new];
    hostViewController.worksForYouViewController.worksForYouNetworkModel = networkModel;
    
    [hostViewController ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
});

it(@"hosts the works-for-you VC", ^{
    expect(hostViewController).to.haveValidSnapshot();
});

it(@"reloads all the data", ^{
    ARWorksForYouViewController *before = hostViewController.worksForYouViewController;
    [hostViewController reloadData];
    expect(hostViewController.worksForYouViewController).toNot.equal(before);
    expect(hostViewController).to.haveValidSnapshot();
});

describe(@"after 1 hour", ^{
    beforeEach(^{
        hostViewController.lastLoadedAt = [NSDate dateWithTimeIntervalSinceNow:-3601];
    });

    it(@"reports the content being stale", ^{
        expect(hostViewController.isContentStale).to.beTruthy();
    });

    it(@"automatically reloads when presenting the view", ^{
        id hostViewControllerMock = [OCMockObject partialMockForObject:hostViewController];
        [[hostViewControllerMock expect] reloadData];

        [hostViewController viewWillAppear:NO];

        [hostViewControllerMock verify];
        [hostViewControllerMock stopMocking];
    });

    it(@"resets the lastLoadedAt state", ^{
        NSDate *now = [NSDate date];
        id dateMock = [OCMockObject mockForClass:NSDate.class];
        [[[dateMock stub] andReturn:now] date];

        [hostViewController viewWillAppear:NO];
        expect(hostViewController.lastLoadedAt).to.equal(now);

        [dateMock stopMocking];
    });
});

describe(@"handling network errors", ^{
    it(@"reloads if networking failed", ^{
        ARStubbedWorksForYouNetworkModel *networkModel = hostViewController.worksForYouViewController.worksForYouNetworkModel;
        networkModel.networkingDidFail = YES;

        id hostViewControllerMock = [OCMockObject partialMockForObject:hostViewController];
        [[hostViewControllerMock expect] reloadData];
        
        [hostViewController viewWillAppear:NO];
        
        [hostViewControllerMock verify];
        [hostViewControllerMock stopMocking];
    });
    
    it(@"does not reload if networking succeeded", ^{
        id hostViewControllerMock = [OCMockObject partialMockForObject:hostViewController];
        [[hostViewControllerMock reject] reloadData];
        
        [hostViewController viewWillAppear:NO];
        
        [hostViewControllerMock verify];
        [hostViewControllerMock stopMocking];
    });
});

SpecEnd;
