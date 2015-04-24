#import "ARBrowseViewController.h"
#import "ARStubbedBrowseNetworkModel.h"

@interface ARBrowseViewController (Tests)
@property (nonatomic, assign, readwrite) BOOL shouldAnimate;
@property (nonatomic, strong, readonly) NSArray *menuLinks;
@property (nonatomic, strong, readonly) ARBrowseNetworkModel *networkModel;
- (void)fetchMenuItems;
@end

SpecBegin(ARBrowseViewController)

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
    viewController.shouldAnimate = NO;
});

it(@"sets its menu items", ^{
    expect(viewController.menuLinks.count).will.equal(5);
});

itHasSnapshotsForDevicesWithName(@"looks correct", ^{
    return viewController;
});

SpecEnd
