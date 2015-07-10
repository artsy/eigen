#import "ARTabContentView.h"

@class ARShowFeedViewController, ARNavigationController;

typedef NS_ENUM(NSInteger, ARTopTabControllerIndex) {
    ARTopTabControllerIndexFeed,
    ARTopTabControllerIndexShows,
    ARTopTabControllerIndexBrowse,
    ARTopTabControllerIndexMagazine,
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

@property (readwrite, nonatomic, strong) ARShowFeedViewController *showFeedViewController;

- (void)prefetchBrowse;
- (void)prefetchHeroUnits;
- (ARNavigationController *)navigationControllerAtIndex:(NSInteger)index;
- (void)setNotificationCount:(NSUInteger)number forControllerAtIndex:(ARTopTabControllerIndex)index;

@end
