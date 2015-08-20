#import "ARBrowseViewController.h"
#import "ARStubbedBrowseNetworkModel.h"


@interface ARBrowseViewController (Tests)
@property (nonatomic, strong, readonly) NSArray *menuLinks;
@property (nonatomic, strong, readonly) ARBrowseNetworkModel *networkModel;
- (void)fetchMenuItems;
@end

SpecBegin(ARBrowseViewController);

__block ARBrowseViewController *viewController;

before(^{
    ARStubbedBrowseNetworkModel *networkModel = [[ARStubbedBrowseNetworkModel alloc] init];
    networkModel.links = @[[FeaturedLink modelWithJSON:@{@"title": @"Link 1"}],
                           [FeaturedLink modelWithJSON:@{@"title": @"Link 2"}],
                           [FeaturedLink modelWithJSON:@{@"title": @"Link 3"}],
                           [FeaturedLink modelWithJSON:@{@"title": @"Link 4"}],
                           [FeaturedLink modelWithJSON:@{@"title": @"Link 5"}]];

    viewController = [[ARBrowseViewController alloc] init];
    viewController.networkModel = networkModel;
});

it(@"sets its menu items", ^{
    expect(viewController.menuLinks.count).will.equal(5);
});

it(@"fetches on viewDidAppear:", ^{
    id networkModelMock = [OCMockObject niceMockForClass:[ARBrowseNetworkModel class]];
    [[networkModelMock expect] getBrowseFeaturedLinks:OCMOCK_ANY failure:OCMOCK_ANY];
    viewController.networkModel = networkModelMock;

    [viewController viewDidAppear:false];

    [networkModelMock verify];
});

it(@"doesn't fetch on viewDidAppear: if menu links present already", ^{
    id networkModelMock = [OCMockObject partialMockForObject:viewController.networkModel];
    [[networkModelMock reject] getBrowseFeaturedLinks:OCMOCK_ANY failure:OCMOCK_ANY];
    viewController.networkModel = networkModelMock;

    [viewController viewDidAppear:false];

    [networkModelMock verify];
});

itHasSnapshotsForDevicesWithName(@"looks correct", ^{
    return viewController;
});

SpecEnd
