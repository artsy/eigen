#import "ARTopMenuNavigationDataSource.h"

#import "ARFeedTimeline.h"
#import <Emission/AREmission.h>
#import <Emission/ARHomeComponentViewController.h>
#import <Emission/ARInboxComponentViewController.h>
#import <Emission/ARFavoritesComponentViewController.h>
#import <Emission/ARMyProfileComponentViewController.h>
#import <Emission/ARMapContainerViewController.h>
#import <Emission/ARSearchComponentViewController.h>

#import "AREigenMapContainerViewController.h"
#import "UIDevice-Hardware.h"
#import "ARFeedSubclasses.h"
#import "FeaturedLink.h"
#import "ARNavigationController.h"
#import "AROptions.h"
#import "ARDefaults.h"
#import "ARSwitchBoard.h"
#import "ArtsyEcho.h"

#import <SDWebImage/SDWebImagePrefetcher.h>
#import <ObjectiveSugar/ObjectiveSugar.h>


@interface ARTopMenuNavigationDataSource ()

@property (nonatomic, assign, readwrite) NSInteger currentIndex;
@property (nonatomic, assign, readonly) NSUInteger *badgeCounts;

@property (readonly, nonatomic, strong) ArtsyEcho *echo;

@property (readonly, nonatomic, strong) ARNavigationController *feedNavigationController;
@property (nonatomic, strong) ARNavigationController *searchNavigationController;
@property (nonatomic, strong) ARNavigationController *favoritesNavigationController;
@property (nonatomic, strong) ARNavigationController *localDiscoveryNavigationController;
@property (nonatomic, strong) ARNavigationController *messagingNavigationController;
@property (nonatomic, strong) ARNavigationController *profileNavigationController;

@end

@implementation ARTopMenuNavigationDataSource

- (void)dealloc;
{
    free(_badgeCounts);
}

- (instancetype)init
{
    self = [super init];

    _echo = [[ArtsyEcho alloc] init];

    _badgeCounts = malloc(sizeof(NSUInteger) * self.tabOrder.count);
    for (int i = 0; i < self.tabOrder.count; i++) {
        _badgeCounts[i] = 0;
    }

    ARHomeComponentViewController *homeVC = [[ARHomeComponentViewController alloc] init];
    _feedNavigationController = [[ARNavigationController alloc] initWithRootViewController:homeVC];

    return self;
}

- (ARNavigationController *)searchNavigationController
{
    if (_searchNavigationController) {
        return _searchNavigationController;
    }

    ARSearchComponentViewController *searchVC = [[ARSearchComponentViewController alloc] init];
    _searchNavigationController = [[ARNavigationController alloc] initWithRootViewController:searchVC];
    return _searchNavigationController;
}

- (ARNavigationController *)messagingNavigationController
{
    if (_messagingNavigationController) {
        return _messagingNavigationController;
    }

    ARComponentViewController *messagingVC = [[ARInboxComponentViewController alloc] initWithInbox];
    _messagingNavigationController = [[ARNavigationController alloc] initWithRootViewController:messagingVC];
    return _messagingNavigationController;
}

- (ARNavigationController *)localDiscoveryNavigationController
{
    if (_localDiscoveryNavigationController) {
        return _localDiscoveryNavigationController;
    }

    AREigenMapContainerViewController *mapVC = [[AREigenMapContainerViewController alloc] init];
    _localDiscoveryNavigationController = [[ARNavigationController alloc] initWithRootViewController:mapVC];
    return _localDiscoveryNavigationController;
}

- (ARNavigationController *)profileNavigationController
{
    if (_profileNavigationController) {
        return _profileNavigationController;
    }

    ARComponentViewController *profileVC = [[ARMyProfileComponentViewController alloc] init];
    _profileNavigationController = [[ARNavigationController alloc] initWithRootViewController:profileVC];
    return _profileNavigationController;
}

- (ARNavigationController *)favoritesNavigationController
{
    ARFavoritesComponentViewController *favoritesVC = [[ARFavoritesComponentViewController alloc] init];
    _favoritesNavigationController = [[ARNavigationController alloc] initWithRootViewController:favoritesVC];
    return _favoritesNavigationController;
}

- (ARNavigationController *)navigationControllerAtIndex:(NSInteger)index;
{
    NSInteger tab = [self tabTypeAtIndex:index];
    switch (tab) {
        case ARTopTabControllerHome:
            return self.feedNavigationController;
        case ARTopTabControllerSearch:
            return self.searchNavigationController;
        case ARTopTabControllerMessaging:
            return self.messagingNavigationController;
        case ARTopTabControllerLocalDiscovery:
            return self.localDiscoveryNavigationController;
        case ARTopTabControllerFavorites:
            return self.favoritesNavigationController;
        case ARTopTabControllerProfile:
            return self.profileNavigationController;
        default:
            return nil;
    }
}

# pragma mark Analytics

- (NSString *)analyticsDescriptionForTabAtIndex:(NSInteger)index {
    ARTopTabControllerTabType tab = [self tabTypeAtIndex:index];
    switch (tab) {
        case ARTopTabControllerHome:
            return @"home";
        case ARTopTabControllerSearch:
            return @"search";
        case ARTopTabControllerMessaging:
            return @"messages";
        case ARTopTabControllerLocalDiscovery:
            return @"cityGuide";
        case ARTopTabControllerFavorites:
            return @"favorites";
        case ARTopTabControllerProfile:
            return @"profile";
        default:
            return @"unknown";
    }
}

- (NSArray *)tabOrder
{
    if ([UIDevice isPhone]) {
        NSArray *iPhoneTabOrder = @[
            @(ARTopTabControllerHome),
            @(ARTopTabControllerSearch),
            @(ARTopTabControllerLocalDiscovery),
            @(ARTopTabControllerMessaging),
            @(ARTopTabControllerProfile)
        ];
        return iPhoneTabOrder;
    } else {
        NSArray *iPadTabOrder = @[
           @(ARTopTabControllerHome),
           @(ARTopTabControllerSearch),
           @(ARTopTabControllerMessaging),
           @(ARTopTabControllerProfile)
        ];
        return iPadTabOrder;
    }
}

- (ARTopTabControllerTabType)tabTypeAtIndex:(NSInteger)index
{
    return (ARTopTabControllerTabType) [self.tabOrder[index] integerValue];;
}

- (NSUInteger)indexForTabType:(ARTopTabControllerTabType)tabType
{
    return [self.tabOrder indexOfObject:@(tabType)];
}

#pragma mark Search

- (BOOL)searchButtonAtIndex:(NSInteger)index
{
    return [self tabTypeAtIndex:index] == ARTopTabControllerSearch;
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
    return self.tabOrder.count;
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
    for (NSInteger i = 0; i < self.tabOrder.count; i++) {
        total += self.badgeCounts[i];
    }
    [[UIApplication sharedApplication] setApplicationIconBadgeNumber:total];
}

// Just an alias for the above, which keeps the ARTabViewDataSource and ARTopMenuViewController concerns seperated.
- (void)setNotificationCount:(NSUInteger)number forControllerAtTab:(ARTopTabControllerTabType)tabType;
{
    NSUInteger index = [self indexForTabType:tabType];
    if (index != NSNotFound) {
        [self setBadgeNumber:number forTabAtIndex:index];
    }
}

@end
