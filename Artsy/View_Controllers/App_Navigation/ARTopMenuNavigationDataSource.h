#import "ARTabContentView.h"
#import "ARNavigationTabButtonWithBadge.h"

@class ARHomeComponentViewController, ARNavigationController;

typedef NS_ENUM(NSInteger, ARTopTabControllerTabType) {
    ARHomeTab,
    ARSearchTab,
    ARLocalDiscoveryTab,
    ARSalesTab,
    ARMessagingTab,
    ARFavoritesTab,
    ARProfileTab
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
