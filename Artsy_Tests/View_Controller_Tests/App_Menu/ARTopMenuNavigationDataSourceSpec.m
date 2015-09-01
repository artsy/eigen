#import "ARTopMenuNavigationDataSource.h"
#import "ARNavigationController.h"
#import "ARBrowseViewController.h"
#import "ARFavoritesViewController.h"
#import "ARShowFeedViewController.h"
#import "ArtsyAPI.h"
#import "ArtsyAPI+Artworks.h"


@interface ARTopMenuNavigationDataSource (Testing)
@property (readonly, nonatomic, strong) ARNavigationController *feedNavigationController;
@property (readonly, nonatomic, strong) ARNavigationController *browseNavigationController;
- (ARNavigationController *)favoritesNavigationController;
@end


SpecBegin(ARTopMenuNavigationDataSource);

__block ARTopMenuNavigationDataSource *navDataSource;

before(^{
    navDataSource = [[ARTopMenuNavigationDataSource alloc] init];
});

it(@"uses a single feed vc", ^{
    ARNavigationController *navigationController = [navDataSource feedNavigationController];
    UIViewController *rootVC = [[navigationController viewControllers] objectAtIndex:0];
    expect(rootVC).to.beKindOf([ARShowFeedViewController class]);

    ARNavigationController *newNavigationController = [navDataSource feedNavigationController];
    UIViewController *newRootVC = [[newNavigationController viewControllers] objectAtIndex:0];
    expect(newNavigationController).to.equal(navigationController);
    expect(newRootVC).to.equal(rootVC);
});


it(@"uses a single browse vc", ^{
    ARNavigationController *navigationController = [navDataSource browseNavigationController];
    UIViewController *rootVC = [[navigationController viewControllers] objectAtIndex:0];
    expect(rootVC).to.beKindOf([ARBrowseViewController class]);

    ARNavigationController *newNavigationController = [navDataSource browseNavigationController];
    UIViewController *newRootVC = [[newNavigationController viewControllers] objectAtIndex:0];
    expect(newNavigationController).to.equal(navigationController);
    expect(newRootVC).to.equal(rootVC);
});

// TODO: use the same favorites VC. Requires fixing collection view bug.
pending(@"uses a single favorites vc", ^{
    ARNavigationController *navigationController = [navDataSource favoritesNavigationController];
    UIViewController *rootVC = [[navigationController viewControllers] objectAtIndex:0];
    expect(rootVC).to.beKindOf([ARFavoritesViewController class]);

    ARNavigationController *newNavigationController = [navDataSource favoritesNavigationController];
    UIViewController *newRootVC = [[newNavigationController viewControllers] objectAtIndex:0];
    expect(newNavigationController).to.equal(navigationController);
    expect(newRootVC).to.equal(rootVC);
});

it(@"reinstantiates favorites vc", ^{
    ARNavigationController *navigationController = [navDataSource favoritesNavigationController];
    UIViewController *rootVC = [[navigationController viewControllers] objectAtIndex:0];
    expect(rootVC).to.beKindOf([ARFavoritesViewController class]);

    ARNavigationController *newNavigationController = [navDataSource favoritesNavigationController];
    UIViewController *newRootVC = [[newNavigationController viewControllers] objectAtIndex:0];
    expect(newNavigationController).notTo.equal(navigationController);
    expect(newRootVC).to.beKindOf([ARFavoritesViewController class]);
    expect(newRootVC).notTo.equal(rootVC);
});

SpecEnd;
