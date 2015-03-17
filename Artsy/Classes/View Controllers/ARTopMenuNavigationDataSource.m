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
@property (readwrite, nonatomic, strong) ARNavigationController *browseNavigationController;
@property (readwrite, nonatomic, strong) ARNavigationController *searchNavigationController;

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

    ARBrowseViewController *browseViewController = [[ARBrowseViewController alloc] init];

    _browseNavigationController = [[ARNavigationController alloc] initWithRootViewController:browseViewController];

    return self;
}

- (ARNavigationController *)favoritesNavigationController
{
    // Make a new one each time the favorites tab is selected

    ARFavoritesViewController *favoritesViewController = [[ARFavoritesViewController alloc] init];
    return [[ARNavigationController alloc] initWithRootViewController:favoritesViewController];
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
        case ARTopTabControllerIndexBrowse:
            return self.browseNavigationController;
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
