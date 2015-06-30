// If we choose to add a pull to refresh
// : http://stackoverflow.com/a/14148118/385754

#import "ARFeedViewController.h"
#import "ARFeedItem.h"

#import "ARReusableLoadingView.h"
#import "ARFeedStatusIndicatorTableViewCell.h"
#import "UIViewController+ARStateRestoration.h"
#import "ARModernPartnerShowTableViewCell.h"
#import "UIViewController+FullScreenLoading.h"
#import "ARtsyAPI+Private.h"

@interface ARFeedViewController() <ARModernPartnerShowTableViewCellDelegate>
@property (nonatomic, strong) ARReusableLoadingView *loadingView;
@property (nonatomic, strong) ARFeedTimeline *feedTimeline;
@property (nonatomic, strong) UITableView *tableView;
@property (nonatomic, assign) enum ARFeedStatusState footerState;
@property (nonatomic, readonly) NSDate *refreshDateTime;
@property (nonatomic, readonly) BOOL shouldRefreshFeed;
@property (nonatomic, readwrite, assign) NSInteger refreshFeedInterval;
@property (nonatomic, readonly, assign) BOOL loading;
@property (nonatomic, readwrite) BOOL useLandscapeValues;
@end

@implementation ARFeedViewController

- (instancetype)initWithFeedTimeline:(ARFeedTimeline *)feedTimeline
{
    self = [super init];
    if(!self) return nil;

    _feedTimeline = feedTimeline;
    _footerState = ARFeedStatusStateLoading;
    _refreshFeedInterval = 60 * 60 * 2;
    _loading = NO;

    return self;
}

- (void)viewDidLoad
{
    self.view.backgroundColor = [UIColor blackColor];

    [self setupTableView];
    [self.tableView registerClass:[ARModernPartnerShowTableViewCell class] forCellReuseIdentifier:@"PartnerShowCellIdentifier"];

    [super viewDidLoad];
}

- (void)setupTableView
{
    UITableView *tableView = [[[self classForTableView] alloc] init];
    tableView.separatorStyle = UITableViewCellSelectionStyleNone;
    tableView.dataSource = self;
    tableView.delegate = self;
    tableView.backgroundColor = [UIColor whiteColor];
    tableView.restorationIdentifier = @"ARFeedTableViewRID";

    [self.view addSubview:tableView];

    [tableView alignToView:self.view];
    self.tableView = tableView;
}

- (void)viewWillTransitionToSize:(CGSize)size withTransitionCoordinator:(id<UIViewControllerTransitionCoordinator>)coordinator
{
    self.useLandscapeValues = size.width > size.height;
}

- (Class)classForTableView
{
    return [UITableView class];
}

// refresh feed every 2 hours by default, otherwise just keep loading more items
- (BOOL)shouldRefreshFeed
{
    return self.refreshDateTime && [[NSDate date] timeIntervalSinceDate:self.refreshDateTime] > self.refreshFeedInterval;
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];

    if (self.shouldRefreshFeed) {
        [self refreshFeedItems];
    }
}

- (BOOL)prefersStatusBarHidden
{
    return NO;
}

// during onboarding the feed is shown, so don't display it again
- (BOOL)isOnboarding
{
    return ![User currentUser] && ![User isTrialUser];
}

- (void)refreshFeed
{
    if (self.loading) {
        return;
    }

    _loading = YES;
    [self refreshFeedItems];

    _refreshDateTime = [NSDate date];
    _loading = NO;
}

- (void)refreshFeedItems
{
    @weakify(self)
    [ArtsyAPI getXappTokenWithCompletion:^(NSString *xappToken, NSDate *expirationDate) {
        [self.feedTimeline getNewItems:^{
            @strongify(self);
            [self hideLoadingView];
            [self.tableView reloadData];
        } failure:^(NSError *error) {
            ARErrorLog(@"There was an error getting newest items for the feed: %@", error.localizedDescription);
            [self performSelector:@selector(refreshFeed) withObject:nil afterDelay:3];
        }];
    }];
}

#pragma mark - Table view data source

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    if(indexPath.row == self.feedTimeline.numberOfItems) {
        return [ARFeedStatusIndicatorTableViewCell heightForFeedItemWithState:_footerState];
    } else {
        ARFeedItem *item = [self.feedTimeline itemAtIndex:indexPath.row];
        return [ARModernPartnerShowTableViewCell heightForItem:item useLandscapeValues:self.useLandscapeValues];
    }
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return self.feedTimeline.numberOfItems + 1;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    if(indexPath.row == self.feedTimeline.numberOfItems) {
        return [ARFeedStatusIndicatorTableViewCell cellWithInitialState:_footerState];
    } else {
        ARFeedItem *feedItem = [self.feedTimeline itemAtIndex:indexPath.row];
        ARModernPartnerShowTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:feedItem.cellIdentifier forIndexPath:indexPath];
        cell.delegate = self;
        [cell configureWithFeedItem:feedItem];
        return cell;
    }
}

- (void)loadNextFeedPage
{
    if (self.loading || ! self.feedTimeline.hasNext || self.feedTimeline.loading) {
        return;
    }

    _loading = YES;
    [self setFooterStatus:ARFeedStatusStateLoading];

    @weakify(self)
    NSInteger oldCount = self.feedTimeline.numberOfItems;

    [self.feedTimeline getNextPage:^{
        @strongify(self);
        if (!self) { return; }

        NSMutableArray *indexPaths = [NSMutableArray array];
        NSInteger newCount = self.feedTimeline.numberOfItems;
        for (NSInteger i = oldCount; i < newCount; i++) {
            [indexPaths addObject:[NSIndexPath indexPathForRow:i inSection:0]];
        }
        [self.tableView insertRowsAtIndexPaths:indexPaths withRowAnimation:UITableViewRowAnimationFade];
        self->_loading = NO;
    }
    failure:^(NSError *error) {
        @strongify(self);
        if (!self) { return; }

        // add a "network error, retry?" state to footer
        ARErrorLog(@"There was an error getting next feed page: %@", error.localizedDescription);
        [self setFooterStatus:ARFeedStatusStateNetworkError];
        self->_loading = NO;
    }
    completion:^{
        @strongify(self);
        if (!self) { return; }

        [self setFooterStatus:ARFeedStatusStateEndOfFeed];
        self->_loading = NO;
    }];
}

- (void)setFooterStatus:(ARFeedStatusState)state
{
    _footerState = state;

    NSIndexPath *lastItem = [NSIndexPath indexPathForRow:self.feedTimeline.numberOfItems inSection:0];
    id cell = [self.tableView cellForRowAtIndexPath:lastItem];

    if ([cell isKindOfClass:[ARFeedStatusIndicatorTableViewCell class]]) {
        // Animate the height change
        [self.tableView beginUpdates];

        [cell setState:state];
        [self.tableView reloadRowsAtIndexPaths:@[lastItem] withRowAnimation:UITableViewRowAnimationFade];

        [self.tableView endUpdates];
        [self.tableView scrollToRowAtIndexPath:lastItem atScrollPosition:UITableViewScrollPositionBottom animated:YES];
    }
}

/// These are for the initial first load, show a centered progress indicator

- (void)presentLoadingView
{
    [self ar_presentIndeterminateLoadingIndicatorAnimated:YES];
}

- (void)hideLoadingView
{
    [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];
}

#pragma mark - Table view delegate

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
}

#pragma mark - Scroll view delegate

- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
    // nav transitions wanna send us scroll events after the transition and we are all like
    // nuh-uh

    if (self.navigationController.topViewController == self && scrollView == self.tableView) {
        [[ARScrollNavigationChief chief] scrollViewDidScroll:scrollView];
    }

    if((scrollView.contentSize.height - scrollView.contentOffset.y) < scrollView.bounds.size.height) {
        [self loadNextFeedPage];
    }
}

#pragma mark -
#pragma mark State Restoration

+ (UIViewController *)viewControllerWithRestorationIdentifierPath:(NSArray *)identifierComponents coder:(NSCoder *)coder
{
    ARFeedViewController *mainFeedViewController = [[ARFeedViewController alloc] init];
    [mainFeedViewController setupRestorationIdentifierAndClass];

    return mainFeedViewController;
}

#pragma mark - Orientation

-(BOOL)shouldAutorotate
{
    return NO;
}

-(NSUInteger)supportedInterfaceOrientations
{
    return [UIDevice isPad] ? UIInterfaceOrientationMaskAll : UIInterfaceOrientationMaskAllButUpsideDown;
}

- (UIInterfaceOrientation)preferredInterfaceOrientationForPresentation
{
    return UIInterfaceOrientationPortrait;
}

#pragma mark - ARModernPartnerShowTableViewCellDelegate

-(void)modernPartnerShowTableViewCell:(ARModernPartnerShowTableViewCell *)cell shouldShowViewController:(UIViewController *)viewController
{
    [self.navigationController pushViewController:viewController animated:YES];
}

@end
