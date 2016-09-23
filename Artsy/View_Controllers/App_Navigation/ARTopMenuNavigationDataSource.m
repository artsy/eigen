#import "ARTopMenuNavigationDataSource.h"

#import "ARFeedTimeline.h"
#import "ARBrowseViewController.h"
#import <Emission/AREmission.h>
#import <Emission/ARHomeComponentViewController.h>
#import "ARFavoritesViewController.h"
#import "ARHeroUnitsNetworkModel.h"
#import "ARHeroUnitViewController.h"
#import "ARTopMenuInternalMobileWebViewController.h"
#import "ARFeedSubclasses.h"
#import "FeaturedLink.h"
#import "SiteHeroUnit.h"
#import "ARNavigationController.h"
#import "ARAppBackgroundFetchDelegate.h"
#import "ARWorksForYouReloadingHostViewController.h"
#import "AROptions.h"
#import "ARSwitchBoard.h"

#import <SDWebImage/SDWebImagePrefetcher.h>
#import <ObjectiveSugar/ObjectiveSugar.h>

static ARNavigationController *
WebViewNavigationControllerWithPath(NSString *path)
{
    NSURL *URL = [NSURL URLWithString:path];
    ARTopMenuInternalMobileWebViewController *viewController = [[ARTopMenuInternalMobileWebViewController alloc] initWithURL:URL];
    return [[ARNavigationController alloc] initWithRootViewController:viewController];
}


@interface ARTopMenuNavigationDataSource ()

@property (nonatomic, assign, readwrite) NSInteger currentIndex;

@property (nonatomic, assign, readonly) NSUInteger *badgeCounts;

@property (nonatomic, strong, readonly) ARBrowseViewController *browseViewController;

@property (readonly, nonatomic, strong) ARNavigationController *feedNavigationController;
@property (readonly, nonatomic, strong) ARNavigationController *showsNavigationController;
@property (readonly, nonatomic, strong) ARNavigationController *browseNavigationController;
@property (readonly, nonatomic, strong) ARNavigationController *magazineNavigationController;
@property (readonly, nonatomic, strong) ARNavigationController *worksForYouNavigationController;

@end


@implementation ARTopMenuNavigationDataSource

- (void)dealloc;
{
    free(_badgeCounts);
}

- (instancetype)init
{
    self = [super init];

    _badgeCounts = malloc(sizeof(NSUInteger) * ARTopTabControllerIndexDelimiter);
    for (int i = 0; i < ARTopTabControllerIndexDelimiter; i++) {
        _badgeCounts[i] = 0;
    }

    ARHomeComponentViewController *homeVC = [[ARHomeComponentViewController alloc] init];
    _feedNavigationController = [[ARNavigationController alloc] initWithRootViewController:homeVC];

    _showsNavigationController = WebViewNavigationControllerWithPath(@"/shows");

    _browseViewController = [[ARBrowseViewController alloc] init];
    _browseViewController.networkModel = [[ARBrowseNetworkModel alloc] init];
    _browseNavigationController = [[ARNavigationController alloc] initWithRootViewController:_browseViewController];

    _magazineNavigationController = WebViewNavigationControllerWithPath(@"/articles");

    ARWorksForYouReloadingHostViewController *worksForYouHostViewController = [[ARWorksForYouReloadingHostViewController alloc] init];
    _worksForYouNavigationController = [[ARNavigationController alloc] initWithRootViewController:worksForYouHostViewController];

    return self;
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

- (ARNavigationController *)navigationControllerAtIndex:(NSInteger)index;
{
    switch (index) {
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
        case ARTopTabControllerIndexNotifications:
            return self.worksForYouNavigationController;
    }

    return nil;
}

#pragma mark ARTabViewDataSource

- (UINavigationController *)viewControllerForTabContentView:(ARTabContentView *)tabContentView atIndex:(NSInteger)index
{
    _currentIndex = index;
    return [self navigationControllerAtIndex:index];
}

- (BOOL)tabContentView:(ARTabContentView *)tabContentView canPresentViewControllerAtIndex:(NSInteger)index
{
    return YES;
}

- (NSInteger)numberOfViewControllersForTabContentView:(ARTabContentView *)tabContentView
{
    return ARTopTabControllerIndexDelimiter;
}

- (NSUInteger)badgeNumberForTabAtIndex:(NSInteger)index;
{
    return self.badgeCounts[index];
}

- (void)setBadgeNumber:(NSUInteger)number forTabAtIndex:(NSInteger)index;
{
    // Don’t send superfluous remoteNotificationsReceived: events to the controllers.
    if (self.badgeCounts[index] != number) {
        self.badgeCounts[index] = number;

        // When setting 0, that just means to remove the badge, no remote notifications were received.
        if (number > 0) {
            ARNavigationController *navigationController = [self navigationControllerAtIndex:index];
            id<ARTopMenuRootViewController> rootViewController = (id<ARTopMenuRootViewController>)navigationController.rootViewController;
            if ([rootViewController respondsToSelector:@selector(remoteNotificationsReceived:)]) {
                [rootViewController remoteNotificationsReceived:number];
            }
        }
    }

    // Always ensure the app icon badge is updated to the right count.
    NSInteger total = 0;
    for (NSInteger i = 0; i < ARTopTabControllerIndexDelimiter; i++) {
        total += self.badgeCounts[i];
    }
    [[UIApplication sharedApplication] setApplicationIconBadgeNumber:total];
}

// Just an alias for the above, which keeps the ARTabViewDataSource and ARTopMenuViewController concerns seperated.
- (void)setNotificationCount:(NSUInteger)number forControllerAtIndex:(ARTopTabControllerIndex)index;
{
    [self setBadgeNumber:number forTabAtIndex:index];
}

@end
