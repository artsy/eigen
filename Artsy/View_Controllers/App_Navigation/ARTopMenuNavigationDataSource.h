#import "ARTabContentView.h"

@class ARShowFeedViewController, ARNavigationController;

typedef NS_ENUM(NSInteger, ARTopTabControllerIndex) {
    ARTopTabControllerIndexSearch,
    ARTopTabControllerIndexFeed,
    ARTopTabControllerIndexShows,
    ARTopTabControllerIndexBrowse,
    ARTopTabControllerIndexMagazine,
    ARTopTabControllerIndexFavorites,
    ARTopTabControllerIndexNotifications
};


@interface ARTopMenuNavigationDataSource : NSObject <ARTabViewDataSource>

@property (readwrite, nonatomic, strong) ARShowFeedViewController *showFeedViewController;

- (void)prefetchBrowse;
- (void)prefetchHeroUnits;
- (void)fetchNotificationCount:(void (^)())success;

@end
