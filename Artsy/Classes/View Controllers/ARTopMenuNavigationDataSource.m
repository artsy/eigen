#import "ARTopMenuNavigationDataSource.h"
#import "ARShowFeedViewController.h"
#import "ARBrowseViewController.h"
#import "ARFavoritesViewController.h"
#import "ARAppSearchViewController.h"
#import "ARHeroUnitsNetworkModel.h"

@interface ARTopMenuNavigationDataSource()

@property (nonatomic, assign, readwrite) NSInteger currentIndex;
@property (nonatomic, strong, readonly) NSArray *navigationControllers;

@property (readwrite, nonatomic, strong) ARNavigationController *feedNavigationController;
@property (readwrite, nonatomic, strong) ARNavigationController *favoritesNavigationController;
@property (readwrite, nonatomic, strong) ARNavigationController *browseNavigationController;
@property (readwrite, nonatomic, strong) ARNavigationController *searchNavigationController;

@end

@implementation ARTopMenuNavigationDataSource

- (ARNavigationController *)navigationControllerForSearch
{
    if (self.searchNavigationController) { return self.searchNavigationController; }

    ARSearchViewController *searchController = [[ARAppSearchViewController alloc] init];
    _searchNavigationController = [[ARNavigationController alloc] initWithRootViewController: searchController];
    return self.searchNavigationController;
}

- (ARNavigationController *)navigationControllerForFeed
{
    if (self.feedNavigationController) { return self.feedNavigationController; }

    ARShowFeed *showFeed = [[ARShowFeed alloc] init];
    ARFeedTimeline *showFeedTimeline = [[ARFeedTimeline alloc] initWithFeed:showFeed];

    _showFeedViewController = [[ARShowFeedViewController alloc] initWithFeedTimeline:showFeedTimeline];
    self.showFeedViewController.heroUnitDatasource = [[ARHeroUnitsNetworkModel alloc] init];

    _feedNavigationController = [[ARNavigationController alloc] initWithRootViewController: _showFeedViewController];
    return self.feedNavigationController;
}

- (ARNavigationController *)navigationControllerForBrowse
{
    if (self.browseNavigationController) { return self.browseNavigationController; }

    ARBrowseViewController *browseViewController = [[ARBrowseViewController alloc] init];
    _browseNavigationController = [[ARNavigationController alloc] initWithRootViewController:browseViewController];
    return self.browseNavigationController;
}

- (ARNavigationController *)navigationControllerForFavorites
{
    ARFavoritesViewController *favoritesViewController = [[ARFavoritesViewController alloc] init];
    _favoritesNavigationController = [[ARNavigationController alloc] initWithRootViewController:favoritesViewController];
    return self.favoritesNavigationController;
}

#pragma mark ARTabViewDataSource

- (UINavigationController *)viewControllerForTabContentView:(ARTabContentView *)tabContentView atIndex:(NSInteger)index
{
    _currentIndex = index;

    switch (index){
        case ARTopTabControllerIndexSearch:
            return [self navigationControllerForSearch];
        case ARTopTabControllerIndexBrowse:
            return [self navigationControllerForBrowse];
        case ARTopTabControllerIndexFavorites:
            return [self navigationControllerForFavorites];
        case ARTopTabControllerIndexFeed:
            return [self navigationControllerForFeed];
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
