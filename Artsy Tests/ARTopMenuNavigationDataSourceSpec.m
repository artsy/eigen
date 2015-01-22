#import "ARTopMenuNavigationDataSource.h"
#import "ARNavigationController.h"
#import "ARBrowseViewController.h"
#import "ARFavoritesViewController.h"
#import "ARAppSearchViewController.h"
#import "ARShowFeedViewController.h"

@interface ARTopMenuNavigationDataSource (Testing)
-(ARNavigationController *)navigationControllerForSearch;
-(ARNavigationController *)navigationControllerForFeed;
-(ARNavigationController *)navigationControllerForBrowse;
-(ARNavigationController *)navigationControllerForFavorites;
@end


SpecBegin(ARTopMenuNavigationDataSource)
__block ARTopMenuNavigationDataSource *navDataSource;
before(^{
    navDataSource = [[ARTopMenuNavigationDataSource alloc] init];
});

it(@"uses a single search vc", ^{
    ARNavigationController *navigationController = [navDataSource navigationControllerForSearch];
    UIViewController *rootVC = [[navigationController viewControllers] objectAtIndex:0];
    expect(rootVC).to.beKindOf([ARAppSearchViewController class]);

    ARNavigationController *newNavigationController = [navDataSource navigationControllerForSearch];
    UIViewController *newRootVC = [[newNavigationController viewControllers] objectAtIndex:0];
    expect(newNavigationController).to.equal(navigationController);
    expect(newRootVC).to.equal(rootVC);
});

it(@"uses a single feed vc", ^{
    ARNavigationController *navigationController = [navDataSource navigationControllerForFeed];
    UIViewController *rootVC = [[navigationController viewControllers] objectAtIndex:0];
    expect(rootVC).to.beKindOf([ARShowFeedViewController class]);

    ARNavigationController *newNavigationController = [navDataSource navigationControllerForFeed];
    UIViewController *newRootVC = [[newNavigationController viewControllers] objectAtIndex:0];
    expect(newNavigationController).to.equal(navigationController);
    expect(newRootVC).to.equal(rootVC);
});


it(@"uses a single browse vc", ^{
    ARNavigationController *navigationController = [navDataSource navigationControllerForBrowse];
    UIViewController *rootVC = [[navigationController viewControllers] objectAtIndex:0];
    expect(rootVC).to.beKindOf([ARBrowseViewController class]);

    ARNavigationController *newNavigationController = [navDataSource navigationControllerForBrowse];
    UIViewController *newRootVC = [[newNavigationController viewControllers] objectAtIndex:0];
    expect(newNavigationController).to.equal(navigationController);
    expect(newRootVC).to.equal(rootVC);
});

// TODO: use the same favorites VC. Requires fixing collection view bug.
pending(@"uses a single favorites vc", ^{
    ARNavigationController *navigationController = [navDataSource navigationControllerForFavorites];
    UIViewController *rootVC = [[navigationController viewControllers] objectAtIndex:0];
    expect(rootVC).to.beKindOf([ARFavoritesViewController class]);

    ARNavigationController *newNavigationController = [navDataSource navigationControllerForFavorites];
    UIViewController *newRootVC = [[newNavigationController viewControllers] objectAtIndex:0];
    expect(newNavigationController).to.equal(navigationController);
    expect(newRootVC).to.equal(rootVC);
});

it(@"reinstantiates favorites vc", ^{
    ARNavigationController *navigationController = [navDataSource navigationControllerForFavorites];
    UIViewController *rootVC = [[navigationController viewControllers] objectAtIndex:0];
    expect(rootVC).to.beKindOf([ARFavoritesViewController class]);

    ARNavigationController *newNavigationController = [navDataSource navigationControllerForFavorites];
    UIViewController *newRootVC = [[newNavigationController viewControllers] objectAtIndex:0];
    expect(newNavigationController).notTo.equal(navigationController);
    expect(newRootVC).to.beKindOf([ARFavoritesViewController class]);
    expect(newRootVC).notTo.equal(rootVC);
});
SpecEnd
