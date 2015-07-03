#import "ARTopMenuNavigationDataSource.h"
#import "ARShowFeedViewController.h"
#import "ARBrowseViewController.h"
#import "ARFavoritesViewController.h"
#import "ARAppSearchViewController.h"
#import "ARHeroUnitsNetworkModel.h"
#import "ARTopMenuInternalMobileWebViewController.h"
#import <SDWebImage/SDWebImagePrefetcher.h>

static ARNavigationController *
WebViewNavigationControllerWithPath(NSString *path)
{
    NSURL *URL = [NSURL URLWithString:path];
    ARTopMenuInternalMobileWebViewController *viewController = [[ARTopMenuInternalMobileWebViewController alloc] initWithURL:URL];
    return [[ARNavigationController alloc] initWithRootViewController:viewController];
}

static ARNavigationController *
RefreshedWebViewNavigationController(ARNavigationController *navigationController)
{
    NSArray *viewControllers = navigationController.viewControllers;
    ARTopMenuInternalMobileWebViewController *viewController = (ARTopMenuInternalMobileWebViewController *)viewControllers[0];
    if (viewController.shouldBeReloaded) {
        [viewController reload];
    }
    return navigationController;
}


@interface ARTopMenuNavigationDataSource ()

@property (nonatomic, assign, readwrite) NSInteger currentIndex;
@property (nonatomic, strong, readonly) NSArray *navigationControllers;

@property (nonatomic, strong, readonly) ARBrowseViewController *browseViewController;

@property (readonly, nonatomic, strong) ARNavigationController *searchNavigationController;
@property (readonly, nonatomic, strong) ARNavigationController *feedNavigationController;
@property (readonly, nonatomic, strong) ARNavigationController *showsNavigationController;
@property (readonly, nonatomic, strong) ARNavigationController *browseNavigationController;
@property (readonly, nonatomic, strong) ARNavigationController *magazineNavigationController;
@property (readonly, nonatomic, strong) ARNavigationController *notificationsNavigationController;

@end


@implementation ARTopMenuNavigationDataSource

- (instancetype)init
{
    self = [super init];

    ARSearchViewController *searchController = [[ARAppSearchViewController alloc] init];
    _searchNavigationController = [[ARNavigationController alloc] initWithRootViewController:searchController];

    ARShowFeed *showFeed = [[ARShowFeed alloc] init];
    ARFeedTimeline *showFeedTimeline = [[ARFeedTimeline alloc] initWithFeed:showFeed];
    _showFeedViewController = [[ARShowFeedViewController alloc] initWithFeedTimeline:showFeedTimeline];
    _showFeedViewController.heroUnitDatasource = [[ARHeroUnitsNetworkModel alloc] init];
    _feedNavigationController = [[ARNavigationController alloc] initWithRootViewController:_showFeedViewController];

    _showsNavigationController = WebViewNavigationControllerWithPath(@"/shows");

    _browseViewController = [[ARBrowseViewController alloc] init];
    _browseViewController.networkModel = [[ARBrowseNetworkModel alloc] init];
    _browseNavigationController = [[ARNavigationController alloc] initWithRootViewController:_browseViewController];

    _magazineNavigationController = WebViewNavigationControllerWithPath(@"/articles");

    _notificationsNavigationController = WebViewNavigationControllerWithPath(@"/works-for-you");

    return self;
}

- (void)prefetchBrowse
{
    [self.browseViewController.networkModel getBrowseFeaturedLinks:^(NSArray *links) {
        NSArray *urls = [links map:^(FeaturedLink * link){
            return link.largeImageURL;
        }];
        SDWebImagePrefetcher *browsePrefetcher = [[SDWebImagePrefetcher alloc] init];
        [browsePrefetcher prefetchURLs:urls];
    } failure:nil];
}

- (void)prefetchHeroUnits
{
    [self.showFeedViewController.heroUnitDatasource getHeroUnitsWithSuccess:^(NSArray *heroUnits) {
        NSArray *urls = [heroUnits map:^id(SiteHeroUnit *unit) {
            return unit.preferredImageURL;
        }];

        SDWebImagePrefetcher *heroUnitPrefetcher = [[SDWebImagePrefetcher alloc] init];
        [heroUnitPrefetcher prefetchURLs:urls];

    } failure:nil];
}

- (ARNavigationController *)favoritesNavigationController
{
    // Make a new one each time the favorites tab is selected, so that it presents up-to-date data.
    //
    // According to Laura, the existing instance was kept alive in the past and updated whenever new favourite data
    // became available, but it was removed because of some crashes. This likely had to do with
    // https://github.com/artsy/eigen/issues/287#issuecomment-88036710
    ARFavoritesViewController *favoritesViewController = [[ARFavoritesViewController alloc] init];
    return [[ARNavigationController alloc] initWithRootViewController:favoritesViewController];
}

#pragma mark ARTabViewDataSource

- (UINavigationController *)viewControllerForTabContentView:(ARTabContentView *)tabContentView atIndex:(NSInteger)index
{
    _currentIndex = index;

    switch (index) {
        case ARTopTabControllerIndexSearch:
            return self.searchNavigationController;
        case ARTopTabControllerIndexFeed:
            return self.feedNavigationController;
        case ARTopTabControllerIndexShows:
            return RefreshedWebViewNavigationController(self.showsNavigationController);
        case ARTopTabControllerIndexBrowse:
            return self.browseNavigationController;
        case ARTopTabControllerIndexMagazine:
            return RefreshedWebViewNavigationController(self.magazineNavigationController);
        case ARTopTabControllerIndexFavorites:
            return self.favoritesNavigationController;
        case ARTopTabControllerIndexNotifications:
            return RefreshedWebViewNavigationController(self.notificationsNavigationController);
    }

    return nil;
}

- (BOOL)tabContentView:(ARTabContentView *)tabContentView canPresentViewControllerAtIndex:(NSInteger)index
{
    return YES;
}

- (NSInteger)numberOfViewControllersForTabContentView:(ARTabContentView *)tabContentView
{
    return 6;
}

- (NSUInteger)badgeNumberForTabAtIndex:(NSInteger)index;
{
    return index == ARTopTabControllerIndexNotifications ? 42 : 0;
}

@end
