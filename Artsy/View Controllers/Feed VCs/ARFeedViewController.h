#import "ARFeedConstants.h"
#import "ARFeedTimeline.h"

/**
    The ARFeedVC shows items in a feed using an ARFeedTimeline, a feed
    is generally a collection of ARFeedItem subclasses that you can optionally filter.

    It is expected that people would subclass it and can use the
    tableViewHeader/tableViewFooter to provide additional meta-data around the feed
*/

@interface ARFeedViewController : UIViewController < UITableViewDataSource, UITableViewDelegate, UIViewControllerRestoration>

/// The designated initializer
- (instancetype)initWithFeedTimeline:(ARFeedTimeline *)feedTimeline;


- (void)refreshFeed;
- (void)loadNextFeedPage;

- (void)presentLoadingView;
- (void)hideLoadingView;

/// Overriding this in subclasses allows you to make changes to the subclasses
- (void)setupTableView;

@property (nonatomic, strong, readonly) ARFeedTimeline *feedTimeline;
@property (nonatomic, strong, readonly) UITableView *tableView;
@property (nonatomic, readonly, assign, getter=isOnboarding) BOOL onboarding;
@end
