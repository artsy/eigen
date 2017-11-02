#import "ARTopMenuNavigationDataSource.h"

#import "ARFeedTimeline.h"
#import <Emission/AREmission.h>
#import <Emission/ARHomeComponentViewController.h>
#import <Emission/ARWorksForYouComponentViewController.h>
#import <Emission/ARInboxComponentViewController.h>
#import "ARFavoritesViewController.h"
#import "ARTopMenuInternalMobileWebViewController.h"
#import "ARFeedSubclasses.h"
#import "FeaturedLink.h"
#import "ARNavigationController.h"
#import "AROptions.h"
#import "ARSwitchBoard.h"

#import <SDWebImage/SDWebImagePrefetcher.h>
#import <ObjectiveSugar/ObjectiveSugar.h>


@interface ARTopMenuNavigationDataSource ()

@property (nonatomic, assign, readwrite) NSInteger currentIndex;

@property (nonatomic, assign, readonly) NSUInteger *badgeCounts;

@property (readonly, nonatomic, strong) ARNavigationController *feedNavigationController;
@property (readonly, nonatomic, strong) ARNavigationController *messagingNavigationController;
@property (readonly, nonatomic, strong) ARNavigationController *savedNavigationController;
@property (readonly, nonatomic, strong) ARNavigationController *profileNavigationController;

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

    ARHomeComponentViewController *homeVC = [[ARHomeComponentViewController alloc] initWithEmission:nil];
    _feedNavigationController = [[ARNavigationController alloc] initWithRootViewController:homeVC];

    return self;
}

- (ARNavigationController *)getMessagingNavigationController
{
    // Make a new one each time the favorites tab is selected, so that it presents up-to-date data.
    //
    // This is an assumption baked into the component itself ( see the header for ARInboxComponentViewController)

    ARComponentViewController *messagingVC = [[ARInboxComponentViewController alloc] initWithInbox];
    _messagingNavigationController = [[ARNavigationController alloc] initWithRootViewController:messagingVC];
    return _messagingNavigationController;
}


- (ARNavigationController *)getProfileNavigationController
{
    if (self.profileNavigationController) {
        return self.profileNavigationController;
    }
    // TODO: Replace with real Emission UIVC
    ARComponentViewController *profileVC = [[ARComponentViewController alloc] initWithEmission:nil moduleName:@"MyAccount" initialProperties:@{}];
    _profileNavigationController = [[ARNavigationController alloc] initWithRootViewController:profileVC];
    return _profileNavigationController;
}

- (ARNavigationController *)getFavoritesNavigationController
{
    // Make a new one each time the favorites tab is selected, so that it presents up-to-date data.
    //
    // According to Laura, the existing instance was kept alive in the past and updated whenever new favourite data
    // became available, but it was removed because of some crashes. This likely had to do with
    // https://github.com/artsy/eigen/issues/287#issuecomment-88036710
    ARFavoritesViewController *favoritesViewController = [[ARFavoritesViewController alloc] init];
    return [[ARNavigationController alloc] initWithRootViewController:favoritesViewController];
}

- (ARNavigationController *)worksForYouNavigationControllerWithSelectedArtist:(NSString *)artistID
{
    ARWorksForYouComponentViewController *worksForYouComponentVC = [[ARWorksForYouComponentViewController alloc] initWithSelectedArtist:artistID];
    return [[ARNavigationController alloc] initWithRootViewController:worksForYouComponentVC];
}

- (ARNavigationController *)navigationControllerAtIndex:(NSInteger)index;
{
    return (ARNavigationController *)[self navigationControllerAtIndex:index parameters:nil];
}

- (ARNavigationController *)navigationControllerAtIndex:(NSInteger)index parameters:(NSDictionary *)params;
{
    switch (index) {
        case ARTopTabControllerIndexHome:
            return [self feedNavigationController];

        case ARTopTabControllerIndexMessaging:
            return [self getMessagingNavigationController];

        case ARTopTabControllerIndexFavorites:
            return self.getFavoritesNavigationController;

        case ARTopTabControllerIndexProfile:
        return [self getProfileNavigationController];

    }

    return nil;
}

#pragma mark Search

- (BOOL)searchButtonAtIndex:(NSInteger)index
{
    return index == ARTopTabControllerIndexSearch;
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
