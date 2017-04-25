#import "ARTabContentView.h"

@class ARHomeComponentViewController, ARNavigationController;

typedef NS_ENUM(NSInteger, ARTopTabControllerIndex) {
    ARTopTabControllerIndexSearch,
    ARTopTabControllerIndexFeed,
    ARTopTabControllerIndexBrowse,
    ARTopTabControllerIndexFavorites,
    ARTopTabControllerIndexNotifications,
    // This should not really be used. It should always be the last and is meant only to have a count of total number
    // of tabs/view controllers the tab view should hold.
    ARTopTabControllerIndexDelimiter
};

@protocol ARTopMenuRootViewController <NSObject>
@optional
- (void)remoteNotificationsReceived:(NSUInteger)notificationCount;
@end


@interface ARTopMenuNavigationDataSource : NSObject <ARTabViewDataSource>

- (ARNavigationController *)navigationControllerAtIndex:(NSInteger)index;
- (ARNavigationController *)navigationControllerAtIndex:(NSInteger)index parameters:(NSDictionary *)params;
- (void)setNotificationCount:(NSUInteger)number forControllerAtIndex:(ARTopTabControllerIndex)index;
- (BOOL)searchButtonAtIndex:(NSInteger)index;

@end
