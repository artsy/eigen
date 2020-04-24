#import "ARTabContentView.h"
#import "ARNavigationTabButtonWithBadge.h"

@class ARHomeComponentViewController, ARNavigationController;

typedef NS_ENUM(NSInteger, ARTopTabControllerIndex) {
    ARTopTabControllerIndexHome,
    ARTopTabControllerIndexSearch,
    ARTopTabControllerIndexLocalDiscovery,
    ARTopTabControllerIndexMessaging,
    ARTopTabControllerIndexFavorites,
    ARTopTabControllerIndexProfile,
    // This should not really be used. It should always be the last and is meant only to have a count of total number
    // of tabs/view controllers the tab view should hold.
    ARTopTabControllerIndexDelimiter
};

typedef NS_ENUM(NSInteger, ARTopTabControllerTabType) {
    ARHomeTab,
    ARSearchTab,
    ARLocalDiscoveryTab,
    ARMessagingTab,
    ARFavoritesTab,
    ARProfileTab,
    ARNoneSelected
};

@protocol ARTopMenuRootViewController <NSObject>
@optional
- (void)remoteNotificationsReceived:(NSUInteger)notificationCount;
@end

@interface ARTopMenuNavigationDataSource : NSObject <ARTabViewDataSource>

@property (readonly, nonatomic, strong) ARNavigationController *messagingNavigationController;
@property (readonly, nonatomic, strong) ARNavigationController *profileNavigationController;
@property (readonly, nonatomic, strong) ARNavigationController *favoritesNavigationController;

- (ARNavigationController *)navigationControllerAtTab:(ARTopTabControllerTabType)tabType;
- (void)setNotificationCount:(NSUInteger)number forControllerAtTab:(ARTopTabControllerTabType)tabType;
- (NSUInteger)indexForTabType:(ARTopTabControllerTabType)tabType;
- (ARTopTabControllerTabType)tabTypeForIndex:(NSInteger)index;
- (NSArray *)tabOrder;

@end
