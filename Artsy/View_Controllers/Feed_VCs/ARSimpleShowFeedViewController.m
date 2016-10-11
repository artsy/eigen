#import "ARSimpleShowFeedViewController.h"
#import "ARModernPartnerShowTableViewCell.h"
#import "ARFeedLinkUnitViewController.h"
#import "ARHeroUnitViewController.h"
#import "ARHeroUnitsNetworkModel.h"
#import "ARFeedTimeline.h"
#import "ARSimpleShowFeedViewController+Konami.h"
#import "UIViewController+SimpleChildren.h"
#import "ARReusableLoadingView.h"
#import "ARPartnerShowFeedItem.h"
#import "AROfflineView.h"
#import "ARTopTapThroughTableView.h"
#import "ARUserManager.h"
#import "ARAnalyticsConstants.h"
#import "User.h"
#import "ArtsyAPI+Private.h"
#import "ARPageSubtitleView.h"
#import "ARShowFeedNetworkStatusModel.h"
#import "ARNetworkErrorManager.h"
#import "ARLogger.h"
#import "ARScrollNavigationChief.h"
#import "UIDevice-Hardware.h"

#import <ObjectiveSugar/ObjectiveSugar.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <FLKAutoLayout/UIViewController+FLKAutoLayout.h>
#import <ARAnalytics/ARAnalytics.h>
#import <ORStackView/ORStackView.h>
#import <AFNetworking/AFNetworking.h>

static NSString *ARShowCellIdentifier = @"ARShowCellIdentifier";


@interface ARSimpleShowFeedViewController () <ARModernPartnerShowTableViewCellDelegate, ARNetworkErrorAwareViewController>

@end


@interface ARSimpleShowFeedViewController ()
@property (nonatomic, strong) ARSectionData *section;
@property (nonatomic, strong) ORStackView *headerStackView;
@property (nonatomic, strong) ARFeedTimeline *feedTimeline;
@property (nonatomic, strong) ARShowFeedNetworkStatusModel *networkStatus;
@end


@implementation ARSimpleShowFeedViewController

- (instancetype)initWithFeedTimeline:(ARFeedTimeline *)timeline
{
    self = [super initWithStyle:UITableViewStylePlain];
    if (!self) {
        return nil;
    }

    _feedTimeline = timeline;
    _feedLinkVC = [[ARFeedLinkUnitViewController alloc] init];
    _heroUnitVC = [[ARHeroUnitViewController alloc] init];
    _networkStatus = [[ARShowFeedNetworkStatusModel alloc] initWithShowFeedVC:self];

    return self;
}

- (Class)classForTableView
{
    return [ARTopTapThroughTableView class];
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    [self registerClass:ARModernPartnerShowTableViewCell.class forCellReuseIdentifier:ARShowCellIdentifier];

    self.view.backgroundColor = [UIColor whiteColor];
    self.tableView.backgroundColor = [UIColor clearColor];

    // Add the hero unit view behind the tableview and inset the tableview.
    // This is so the tableview will initially start below the hero unit, but scroll
    // *over* the hero unit view.
    [self ar_addModernChildViewController:self.heroUnitVC intoView:self.view belowSubview:self.tableView];
    [self.heroUnitVC.view alignLeading:@"0" trailing:@"0" toView:self.view];
    [self.heroUnitVC.view constrainTopSpaceToView:self.flk_topLayoutGuide predicate:@"0"];

    UIEdgeInsets insets = self.tableView.contentInset;
    insets.top = 20 + self.heroUnitVC.preferredContentSize.height;
    self.tableView.contentInset = insets;

    // Ensure that the table view begins at the correct offset to avoid covering part of the hero unit.
    CGPoint offset = self.tableView.contentOffset;
    offset.y = -insets.top;
    self.tableView.contentOffset = offset;

    ORStackView *stack = [[ORStackView alloc] initWithFrame:CGRectMake(0, 0, 320, 320)];
    stack.backgroundColor = [UIColor whiteColor];
    [stack addViewController:self.feedLinkVC toParent:self withTopMargin:@"20" sideMargin:@"40"];

    ARPageSubTitleView *featuredShowsLabel = [[ARPageSubTitleView alloc] initWithTitle:@"Current Shows"];
    [featuredShowsLabel constrainHeight:@"40"];
    [stack addSubview:featuredShowsLabel withTopMargin:@"20" sideMargin:@"40"];

    self.headerStackView = stack;

    self.tableView.tableHeaderView = [self wrapperForHeaderStack];

    // This is done in its own category now
    [self registerKonamiCode];

    // Older builds used to assume that one day you might hit the end of the feed. ( 'Cause you could in 1.0. )
    // I think it's now a safe assumption that you can never hit the end of the shows feed. :tada:
    ARReusableLoadingView *footerView = [[ARReusableLoadingView alloc] initWithFrame:CGRectMake(0, 0, 320, 60)];
    [footerView startIndeterminateAnimated:NO];
    self.tableView.tableFooterView = footerView;

    [ArtsyAPI getXappTokenWithCompletion:^(NSString *xappToken, NSDate *expirationDate) {
        [self.feedLinkVC fetchLinks:^{

            UIView *newWrapper = [self wrapperForHeaderStack];
            self.tableView.tableHeaderView = newWrapper;
        }];
    }];

    self.section = [[ARSectionData alloc] init];

    /// Deal with background cached'd data
    for (ARPartnerShowFeedItem *show in self.feedTimeline.items) {
        [self addShowToTable:show];
    }
    self.tableViewData = [[ARTableViewData alloc] initWithSectionDataArray:@[ self.section ]];

    // And to wrap this up, grab first few feed items
    [self refreshFeedItems];
}

- (UIView *)wrapperForHeaderStack
{
    // A tableview header cannot be resized dynamically. This gets tricksy when
    // we want to add things like the feed links below the hero units.

    // So we generate a new wrapper view, ensure all AL has been ran in the
    // stack and create a new wrapper to put our stack in and the tableview
    // uses that.

    UIView *wrapper = [[UIView alloc] init];
    UIView *stack = self.headerStackView;

    [stack updateConstraints];
    wrapper.frame = (CGRect){
        .size = [stack systemLayoutSizeFittingSize:CGSizeZero],
        .origin = CGPointZero};

    stack.frame = wrapper.bounds;
    [stack removeFromSuperview];

    [wrapper addSubview:stack];
    [stack alignToView:wrapper];
    return wrapper;
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];

    self.tableView.separatorStyle = UITableViewCellSelectionStyleNone;
}

- (void)refreshFeedItems
{
    // This will get overwritten on event next refresh, so no need to cancel
    [ARAnalytics startTimingEvent:ARAnalyticsInitialFeedLoadTime];
    __weak typeof(self) wself = self;

    [ArtsyAPI getXappTokenWithCompletion:^(NSString *xappToken, NSDate *expirationDate) {
        [self.feedTimeline getNewItems:^(NSArray *items) {
            __strong typeof (wself) sself = wself;

            for (ARPartnerShowFeedItem *show in items) {
                [sself addShowToTable:show];
            }
            [sself.tableView reloadData];

            [sself loadNextFeedPage];
            [sself.heroUnitVC.heroUnitNetworkModel downloadHeroUnits];
            [sself.networkStatus hideOfflineView];

            [ARAnalytics finishTimingEvent:ARAnalyticsInitialFeedLoadTime];

        } failure:^(NSError *error) {
            NSHTTPURLResponse *response = error.userInfo[AFURLResponseSerializationErrorDomain]
                                          ?: error.userInfo[AFNetworkingOperationFailingURLResponseErrorKey];
            ARErrorLog(@"There was a %@ error getting newest items for the feed: %@", @(response.statusCode), error.localizedDescription);
            __strong typeof (wself) sself = wself;

            // So that it won't stop the first one
            [sself.networkStatus.offlineView refreshFailed];
            [sself.networkStatus showOfflineViewIfNeeded];

            [sself performSelector:@selector(refreshFeedItems) withObject:nil afterDelay:1];
            [ARAnalytics finishTimingEvent:ARAnalyticsInitialFeedLoadTime];

            if (response.statusCode == 401) {
                // If you have changed your password
                [self offerLogoutForExpiredCredentials];
            }
        }];

    } failure:^(NSError *error) {
        [self.networkStatus.offlineView refreshFailed];
    }];
}

- (void)loadNextFeedPage
{
    [self.feedTimeline getNextPage:^(NSArray *items) {
        for (ARPartnerShowFeedItem *show in items) {
            [self addShowToTable:show];
        }
        [self.tableView reloadData];

    } failure:^(NSError *error) {
        ARErrorLog(@"There was an error getting next feed page: %@", error.localizedDescription);
        [ARNetworkErrorManager presentActiveError:error withMessage:@"We're having trouble accessing the show feed."];

    } completion:^{

    }];
}

- (void)addShowToTable:(ARPartnerShowFeedItem *)show
{
    ARCellData *data = [[ARCellData alloc] initWithIdentifier:ARShowCellIdentifier];
    [data setCellConfigurationBlock:^(ARModernPartnerShowTableViewCell *cell) {
        [cell configureWithFeedItem:show];
        cell.delegate = self;
    }];

    BOOL useLandscape = self.view.bounds.size.width > self.view.bounds.size.height;
    data.height = [ARModernPartnerShowTableViewCell heightForItem:show useLandscapeValues:useLandscape];
    [self.section addCellData:data];
}

- (void)offerLogoutForExpiredCredentials
{
    if (self.presentedViewController) {
        return;
    }

    UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"About to Log Out" message:@"Your Artsy credentials are out of date." preferredStyle:UIAlertControllerStyleAlert];
    [alertController addAction:[UIAlertAction actionWithTitle:@"Log Out" style:UIAlertActionStyleDestructive handler:^(UIAlertAction *_Nonnull action) {

        [ARUserManager logout];
    }]];

    [self presentViewController:alertController animated:YES completion:nil];
}

#pragma mark - ARMenuAwareViewController

- (BOOL)hidesBackButton
{
    return self.navigationController.viewControllers.count <= 1;
}

- (BOOL)hidesToolbarMenu
{
    return self.networkStatus.showingOfflineView;
}

#pragma mark - ARNetworkErrorAwareViewController

- (BOOL)shouldShowActiveNetworkError
{
    return !self.networkStatus.isShowingOfflineView;
}


- (void)scrollViewDidScroll:(UIScrollView *)scrollView
{
    // nav transitions wanna send us scroll events after the transition and we are all like nuh-uh
    if (self.navigationController.topViewController == self && scrollView == self.tableView) {
        [[ARScrollNavigationChief chief] scrollViewDidScroll:scrollView];
    }

    if ((scrollView.contentSize.height - scrollView.contentOffset.y) < scrollView.bounds.size.height) {
        [self loadNextFeedPage];
    }
}

#pragma mark - Orientation

- (BOOL)shouldAutorotate
{
    return [UIDevice isPad];
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations
{
    return [UIDevice isPad] ? UIInterfaceOrientationMaskAll : UIInterfaceOrientationMaskAllButUpsideDown;
}

- (UIInterfaceOrientation)preferredInterfaceOrientationForPresentation
{
    return UIInterfaceOrientationPortrait;
}

#pragma mark - ARModernPartnerShowTableViewCellDelegate

- (void)modernPartnerShowTableViewCell:(ARModernPartnerShowTableViewCell *)cell shouldShowViewController:(UIViewController *)viewController
{
    [self.navigationController pushViewController:viewController animated:YES];
}

@end
