#import "ARShowFeedNetworkStatusModel.h"
#import "ARSimpleShowFeedViewController.h"
#import "AROfflineView.h"


@interface ARShowFeedNetworkStatusModel () <AROfflineViewDelegate>
@property (nonatomic, weak, readwrite) ARSimpleShowFeedViewController *showFeedVC;

@property (nonatomic, readwrite, getter=isShowingOfflineView) BOOL showingOfflineView;
@end


@implementation ARShowFeedNetworkStatusModel

- (instancetype)initWithShowFeedVC:(ARSimpleShowFeedViewController *)showFeedVC
{
    self = [super init];
    if (!self) {
        return nil;
    }

    self.showFeedVC = showFeedVC;

    NSNotificationCenter *defaultCenter = [NSNotificationCenter defaultCenter];
    [defaultCenter addObserver:self selector:@selector(showOfflineViewIfNeeded) name:ARNetworkUnavailableNotification object:nil];

    return self;
}

- (void)dealloc
{
    NSNotificationCenter *defaultCenter = [NSNotificationCenter defaultCenter];
    [defaultCenter removeObserver:self];
}

- (void)setShowingOfflineView:(BOOL)showingOfflineView
{
    // Force the containing VC to re-evaluate the state of the menu buttons.

    [self.showFeedVC willChangeValueForKey:@keypath(self.showFeedVC, hidesToolbarMenu)];
    _showingOfflineView = showingOfflineView;
    [self.showFeedVC didChangeValueForKey:@keypath(self.showFeedVC, hidesToolbarMenu)];
}

- (void)showOfflineViewIfNeeded
{
    id<UITableViewDataSource> dataSource = self.showFeedVC.tableView.dataSource;
    BOOL feedViewHasItems = [dataSource tableView:self.showFeedVC.tableView numberOfRowsInSection:0] > 0;

    if (feedViewHasItems == NO) {
        // The offline view will be hidden when we load content.
        [self showOfflineView];
    }
}

- (void)showOfflineView
{
    UIView *hostView = self.showFeedVC.view;
    self.showingOfflineView = YES;

    if (self.offlineView == nil) {
        _offlineView = [[AROfflineView alloc] initWithFrame:hostView.bounds];
        self.offlineView.delegate = self;
    }

    [hostView addSubview:self.offlineView];

    [self.offlineView alignCenterWithView:hostView];
    [self.offlineView constrainWidthToView:hostView predicate:@""];
    [self.offlineView constrainHeightToView:hostView predicate:@""];
}

- (void)hideOfflineView
{
    self.showingOfflineView = NO;

    [self.offlineView removeFromSuperview];

    _offlineView = nil;
}

- (void)offlineViewDidRequestRefresh:(AROfflineView *)offlineView;
{
    [self.showFeedVC refreshFeedItems];
}

@end
