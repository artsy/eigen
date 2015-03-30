#import "ARTopMenuNavigationDataSource.h"
#import "ARShowFeedViewController.h"
#import "ARBrowseViewController.h"
#import "ARFavoritesViewController.h"
#import "ARAppSearchViewController.h"
#import "ARHeroUnitsNetworkModel.h"
#import "ARInternalMobileWebViewController.h"
#import <SDWebImage/SDWebImagePrefetcher.h>

@interface ARTopMenuNavigationDataSource()

@property (nonatomic, assign, readwrite) NSInteger currentIndex;
@property (nonatomic, strong, readonly) NSArray *navigationControllers;

@property (nonatomic, strong, readonly) ARBrowseViewController *browseViewController;

@property (readonly, nonatomic, strong) ARNavigationController *feedNavigationController;
@property (readonly, nonatomic, strong) ARNavigationController *browseNavigationController;
@property (readonly, nonatomic, strong) ARNavigationController *searchNavigationController;

@end

@implementation ARTopMenuNavigationDataSource

- (instancetype)init
{
    self = [super init];

    // Search

    ARSearchViewController *searchController = [[ARAppSearchViewController alloc] init];
    _searchNavigationController = [[ARNavigationController alloc] initWithRootViewController: searchController];

    // Feed

    ARShowFeed *showFeed = [[ARShowFeed alloc] init];
    ARFeedTimeline *showFeedTimeline = [[ARFeedTimeline alloc] initWithFeed:showFeed];

    _showFeedViewController = [[ARShowFeedViewController alloc] initWithFeedTimeline:showFeedTimeline];
    _showFeedViewController.heroUnitDatasource = [[ARHeroUnitsNetworkModel alloc] init];
    _feedNavigationController = [[ARNavigationController alloc] initWithRootViewController: _showFeedViewController];

    // Browse

    _browseViewController = [[ARBrowseViewController alloc] init];
    _browseViewController.networkModel = [[ARBrowseNetworkModel alloc] init];
    _browseNavigationController = [[ARNavigationController alloc] initWithRootViewController:_browseViewController];

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
    [self.showFeedViewController.heroUnitDatasource getHeroUnitsWithSuccess:^(NSArray *heroUnits){

        // Grab all but the first and try to pre-download them.
        NSArray *urls = [heroUnits map:^id(SiteHeroUnit *unit) {
            return unit.preferredImageURL;
        }];

        SDWebImagePrefetcher *heroUnitPrefetcher = [[SDWebImagePrefetcher alloc] init];
        [heroUnitPrefetcher prefetchURLs:urls];
        
    } failure:nil];
}

- (ARNavigationController *)favoritesNavigationController
{
    // Make a new one each time the favorites tab is selected

    ARFavoritesViewController *favoritesViewController = [[ARFavoritesViewController alloc] init];
    return [[ARNavigationController alloc] initWithRootViewController:favoritesViewController];
}

- (ARNavigationController *)showsNavigationController;
{
    return [self internalWebViewNavigationController:@"/shows"];
}

- (ARNavigationController *)magazineNavigationController;
{
    return [self internalWebViewNavigationController:@"/magazine"];
}

- (ARNavigationController *)internalWebViewNavigationController:(NSString *)path;
{
    NSURL *URL = [NSURL URLWithString:path];
    ARInternalMobileWebViewController *viewController = [[ARInternalMobileWebViewController alloc] initWithURL:URL];
    return [[ARNavigationController alloc] initWithRootViewController:viewController];
}

#pragma mark ARTabViewDataSource

- (UINavigationController *)viewControllerForTabContentView:(ARTabContentView *)tabContentView atIndex:(NSInteger)index
{
    _currentIndex = index;

    switch (index){
        case ARTopTabControllerIndexSearch:
            return self.searchNavigationController;
        case ARTopTabControllerIndexFeed:
            return self.feedNavigationController;
        case ARTopTabControllerIndexShows:
            return self.showsNavigationController;
        case ARTopTabControllerIndexBrowse:
            return self.browseNavigationController;
        case ARTopTabControllerIndexMagazine:
            return self.magazineNavigationController;
        case ARTopTabControllerIndexFavorites:
            return self.favoritesNavigationController;
    }

    return nil;
}

- (BOOL)tabContentView:(ARTabContentView *)tabContentView canPresentViewControllerAtIndex:(NSInteger)index
{
    return YES;
}

- (NSInteger)numberOfViewControllersForTabContentView:(ARTabContentView *)tabContentView
{
    return 4;
}

@end
