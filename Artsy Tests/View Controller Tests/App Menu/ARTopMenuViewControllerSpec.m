#import "ARTopMenuViewController.h"
#import "ARTestTopMenuNavigationDataSource.h"
#import "ARTabContentView.h"
#import "ARTopMenuNavigationDataSource.h"
#import "ARFairViewController.h"

@interface ARTopMenuViewController(Testing)
@property (readwrite, nonatomic, strong) ARTopMenuNavigationDataSource *navigationDataSource;
@end

SpecBegin(ARTopMenuViewController)

__block ARTopMenuViewController *sut;
__block ARTopMenuNavigationDataSource *dataSource;

dispatch_block_t sharedBefore = ^{
    sut = [[ARTopMenuViewController alloc] init];
    sut.navigationDataSource = dataSource;
    [sut ar_presentWithFrame:[UIScreen mainScreen].bounds];

    [sut beginAppearanceTransition:YES animated:NO];
    [sut endAppearanceTransition];
    [sut.view layoutIfNeeded];
};

itHasSnapshotsForDevices(@"selects 'home' by default", ^{
    dataSource = [[ARTestTopMenuNavigationDataSource alloc] init];
    sharedBefore();
    return sut;
});

itHasSnapshotsForDevices(@"should be able to hide", ^{
    dataSource = [[ARTestTopMenuNavigationDataSource alloc] init];
    sharedBefore();
    [sut hideToolbar:YES animated:NO];
    return sut;
});

describe(@"navigation", ^{
    it(@"resets the search view controller to the root", ^{
        dataSource = [[ARTopMenuNavigationDataSource alloc] init];
        sharedBefore();

        [sut.tabContentView setCurrentViewIndex:ARTopTabControllerIndexSearch animated:NO];
        [sut pushViewController:[[ARFairViewController alloc] init] animated:NO];

        [sut.tabContentView setCurrentViewIndex:ARTopTabControllerIndexFeed animated:NO];
        [sut.tabContentView setCurrentViewIndex:ARTopTabControllerIndexSearch animated:NO];

        expect(sut.rootNavigationController.viewControllers.count).to.equal(1);
    });
});

SpecEnd
