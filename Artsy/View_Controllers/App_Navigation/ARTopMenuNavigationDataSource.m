#import "ARTopMenuNavigationDataSource.h"

#import "ARFeedTimeline.h"
#import <Emission/AREmission.h>
#import <Emission/ARHomeComponentViewController.h>
#import <Emission/ARInboxComponentViewController.h>
#import <Emission/ARFavoritesComponentViewController.h>
#import <Emission/ARMyProfileComponentViewController.h>
#import <Emission/ARMapContainerViewController.h>
#import <Emission/ARSearchComponentViewController.h>
#import <Emission/ARSalesComponentViewController.h>

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
@property (nonatomic, strong) ARNavigationController *salesNavigationController;

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


- (ARNavigationController *)salesNavigationController
{
    if (_salesNavigationController) {
        return _salesNavigationController;
    }

    ARSalesComponentViewController *salesVC = [[ARSalesComponentViewController alloc] init];
    _salesNavigationController = [[ARNavigationController alloc] initWithRootViewController:salesVC];
    return _salesNavigationController;
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

    ARInboxComponentViewController *messagingVC = [[ARInboxComponentViewController alloc] initWithInbox];
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

    ARMyProfileComponentViewController *profileVC = [[ARMyProfileComponentViewController alloc] init];
    _profileNavigationController = [[ARNavigationController alloc] initWithRootViewController:profileVC];
    return _profileNavigationController;
}

- (ARNavigationController *)favoritesNavigationController
{
    ARFavoritesComponentViewController *favoritesVC = [[ARFavoritesComponentViewController alloc] init];
    _favoritesNavigationController = [[ARNavigationController alloc] initWithRootViewController:favoritesVC];
    return _favoritesNavigationController;
}

- (ARNavigationController *)navigationControllerAtTab:(ARTopTabControllerTabType)tabType;
{
    switch (tabType) {
        case ARHomeTab:
            return self.feedNavigationController;
        case ARSearchTab:
            return self.searchNavigationController;
        case ARMessagingTab:
            return self.messagingNavigationController;
        case ARLocalDiscoveryTab:
            return self.localDiscoveryNavigationController;
        case ARFavoritesTab:
            return self.favoritesNavigationController;
        case ARSalesTab:
            return self.salesNavigationController;
        case ARMyProfileTab:
            return self.profileNavigationController;
        default:
            return nil;
    }
}

- (ARNavigationController *)navigationControllerAtIndex:(NSInteger)index;
{
    NSInteger tab = [self tabTypeForIndex:index];
    return [self navigationControllerAtTab:tab];
}

# pragma mark Analytics

- (NSString *)analyticsDescriptionForTabAtIndex:(NSInteger)index {
    ARTopTabControllerTabType tab = [self tabTypeForIndex:index];
    switch (tab) {
        case ARHomeTab:
            return @"home";
        case ARSearchTab:
            return @"search";
        case ARMessagingTab:
            return @"messages";
        case ARLocalDiscoveryTab:
            return @"cityGuide";
        case ARFavoritesTab:
            return @"favorites";
        case ARSalesTab:
            return @"sell";
        case ARMyProfileTab:
            // TODO: check with mike what this should be
            return @"profile";
        default:
            return @"unknown";
    }
}

- (NSArray *)tabOrder
{
    BOOL shouldShowSalesTab = [[ARSwitchBoard sharedInstance] isFeatureEnabled:AROptionsEnableSales];

    if ([UIDevice isPhone]) {
        NSMutableArray *iPhoneTabOrder = @[
            @(ARHomeTab),
            @(ARSearchTab),
            @(ARMessagingTab),
            @([AROptions boolForOption:AROptionsEnableNewProfileTab] ? ARMyProfileTab : ARFavoritesTab)
        ].mutableCopy;

        if (shouldShowSalesTab) {
            [iPhoneTabOrder insertObject:@(ARSalesTab) atIndex:3];
        } else {
            [iPhoneTabOrder insertObject:@(ARLocalDiscoveryTab) atIndex:2];
        }

        return iPhoneTabOrder;
    } else {
        NSMutableArray *iPadTabOrder = @[
           @(ARHomeTab),
           @(ARSearchTab),
           @(ARMessagingTab),
           @([AROptions boolForOption:AROptionsEnableNewProfileTab] ? ARMyProfileTab : ARFavoritesTab)
        ].mutableCopy;

        if (shouldShowSalesTab) {
            [iPadTabOrder insertObject:@(ARSalesTab) atIndex:3];
        }

        return iPadTabOrder;
    }
}

- (ARTopTabControllerTabType)tabTypeForIndex:(NSInteger)index
{
    return (ARTopTabControllerTabType) [self.tabOrder[index] integerValue];
}

- (NSUInteger)indexForTabType:(ARTopTabControllerTabType)tabType
{
    return [self.tabOrder indexOfObject:@(tabType)];
}

- (NSString *)tabNameForIndex:(NSInteger)index
{
    ARTopTabControllerTabType tab = [self tabTypeForIndex:index];
    switch (tab) {
        case ARHomeTab:
            return @"ARHomeTab";
        case ARSearchTab:
            return @"ARSearchTab";
        case ARMessagingTab:
            return @"ARMessagingTab";
        case ARLocalDiscoveryTab:
            return @"ARLocalDiscoveryTab";
        case ARFavoritesTab:
            return @"ARFavoritesTab";
        case ARSalesTab:
            return @"ARSalesTab";
        case ARMyProfileTab:
            return @"ARMyProfileTab";
        default:
            return @"Unknown";
    }
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
