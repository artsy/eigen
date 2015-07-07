#import "ARTabContentView.h"

@class ARShowFeedViewController, ARNavigationController;

typedef NS_ENUM(NSInteger, ARTopTabControllerIndex) {
    ARTopTabControllerIndexSearch,
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


@interface ARTopMenuNavigationDataSource : NSObject <ARTabViewDataSource>

@property (readwrite, nonatomic, strong) ARShowFeedViewController *showFeedViewController;

- (void)prefetchBrowse;
- (void)prefetchHeroUnits;
- (void)fetchNotificationCount:(void (^)())success;

@end
