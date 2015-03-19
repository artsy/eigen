#import "ARTabContentView.h"

@class ARShowFeedViewController, ARNavigationController;

NS_ENUM(NSInteger, ARTopTabControllerIndex){
    ARTopTabControllerIndexSearch,
    ARTopTabControllerIndexFeed,
    ARTopTabControllerIndexBrowse,
    ARTopTabControllerIndexFavorites
};

@interface ARTopMenuNavigationDataSource : NSObject <ARTabViewDataSource>

@property (readwrite, nonatomic, strong) ARShowFeedViewController *showFeedViewController;

- (void)prefetchBrowse;

@end
