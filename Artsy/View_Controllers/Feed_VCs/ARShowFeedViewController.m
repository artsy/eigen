#import "ARShowFeedViewController.h"
#import "ARHeroUnitViewController.h"
#import "ARHeroUnitsNetworkModel.h"
#import "ARModernPartnerShowTableViewCell.h"
#import "ARPageSubTitleView.h"
#import "ARFeedLinkUnitViewController.h"
#import "UIViewController+SimpleChildren.h"
#import "ArtsyAPI+Private.h"
#import "AROfflineView.h"

#import <DRKonamiCode/DRKonamiGestureRecognizer.h>
#import "ARKonamiKeyboardView.h"
#import <ARASCIISwizzle/UIFont+ASCII.h>
#import <ARASCIISwizzle/UIImageView+ASCII.h>
#import "ARTile+ASCII.h"
#import <ARAnalytics/ARAnalytics.h>
#import "ARAnalyticsConstants.h"
#import "ARTopTapThroughTableView.h"

static CGFloat ARShowFeedHeaderLabelMarginPad = 20;
static CGFloat ARShowFeedHeaderLabelHeightPad = 55;

static CGFloat ARFeedLinksNavMarginPhone = 20;
static CGFloat ARFeaturedShowsTitleHeightPhone = 40;


@interface ARShowFeedViewController () <ARMenuAwareViewController, DRKonamiGestureProtocol, AROfflineViewDelegate, ARNetworkErrorAwareViewController>

@property (nonatomic, strong) ARHeroUnitViewController *heroUnitVC;
@property (nonatomic, strong) ARFeedLinkUnitViewController *feedLinkVC;
@property (nonatomic, strong) UIView *pageTitle;
@property (nonatomic, strong) CALayer *separator;
@property (nonatomic, readonly) ARKonamiKeyboardView *konamiKeyboardView;
@property (nonatomic, strong, readwrite) UIView *headerView;

@property (nonatomic, strong) AROfflineView *offlineView;
@property (nonatomic, readwrite, getter=isSHowingOfflineView) BOOL showingOfflineView;
@property (nonatomic, strong) id networkNotificationObserver;

@end


@implementation ARShowFeedViewController

- (instancetype)initWithFeedTimeline:(ARFeedTimeline *)timeline
{
    self = [super initWithFeedTimeline:timeline];
    if (!self) {
        return nil;
    }

    _heroUnitVC = [[ARHeroUnitViewController alloc] init];

    @_weakify(self);
    NSNotificationCenter *defaultCenter = [NSNotificationCenter defaultCenter];
    self.networkNotificationObserver = [defaultCenter addObserverForName:ARNetworkUnavailableNotification object:nil queue:[NSOperationQueue mainQueue] usingBlock:^(NSNotification *note) {
        @_strongify(self);
        if (self.feedTimeline.numberOfItems == 0) {
            // The offline view will be hidden when we load content.
            [self showOfflineView];
        }
    }];

    self.automaticallyAdjustsScrollViewInsets = NO;

    return self;
}

- (void)dealloc
{
    NSNotificationCenter *defaultCenter = [NSNotificationCenter defaultCenter];
    [defaultCenter removeObserver:self.networkNotificationObserver];
}

- (void)viewWillAppear:(BOOL)animated
{
    [self.heroUnitVC.view setNeedsLayout];
    [self.heroUnitVC.view layoutIfNeeded];
    [super viewWillAppear:animated];
    [self addKonami];
}

#pragma mark - Overridden Properties

- (void)setShowingOfflineView:(BOOL)showingOfflineView
{
    // Force containing VC to re-evaluate the state of the menu button.
    [self willChangeValueForKey:@keypath(self, hidesToolbarMenu)];
    _showingOfflineView = showingOfflineView;
    [self didChangeValueForKey:@keypath(self, hidesToolbarMenu)];
}

#pragma mark - Offline View

- (void)showOfflineView
{
    self.showingOfflineView = YES;

    if (self.offlineView == nil) {
        self.offlineView = [[AROfflineView alloc] initWithFrame:self.view.bounds];
        self.offlineView.delegate = self;
    }

    [self.view addSubview:self.offlineView];

    [self.offlineView alignCenterWithView:self.view];
    [self.offlineView constrainWidthToView:self.view predicate:@""];
    [self.offlineView constrainHeightToView:self.view predicate:@""];
}

- (void)hideOfflineView
{
    self.showingOfflineView = NO;

    [self.offlineView removeFromSuperview];

    self.offlineView = nil;
}

- (void)offlineViewDidRequestRefresh:(AROfflineView *)offlineView;
{
    [self refreshFeed];
}

#pragma mark - ARNetworkErrorAwareViewController

- (BOOL)shouldShowActiveNetworkError;
{
    return !self.isSHowingOfflineView;
}

#pragma mark - ARMenuAwareViewController

- (BOOL)hidesBackButton
{
    return self.navigationController.viewControllers.count <= 1;
}

- (BOOL)hidesToolbarMenu
{
    return self.showingOfflineView;
}

- (BOOL)hidesSearchButton;
{
    return self.showingOfflineView;
}

#pragma mark - Implementation

- (void)refreshFeedItems
{
    [ARAnalytics startTimingEvent:ARAnalyticsInitialFeedLoadTime];
    if (!self.showingOfflineView) {
        [self presentLoadingView];
    }

    @_weakify(self);

    [ArtsyAPI getXappTokenWithCompletion:^(NSString *xappToken, NSDate *expirationDate) {
        [self.feedTimeline getNewItems:^{
            @_strongify(self);
            [self.tableView reloadData];
            [self hideLoadingView];
            [self hideOfflineView];
            [self loadHeroUnits];
            [self loadNextFeedPage];
            [ARAnalytics finishTimingEvent:ARAnalyticsInitialFeedLoadTime];

        } failure:^(NSError *error) {
            ARErrorLog(@"There was an error getting newest items for the feed: %@", error.localizedDescription);
            [self.offlineView refreshFailed];
            [self performSelector:@selector(refreshFeed) withObject:nil afterDelay:3];
            [ARAnalytics finishTimingEvent:ARAnalyticsInitialFeedLoadTime];
        }];
    } failure:^(NSError *error) {
        [self.offlineView refreshFailed];
    }];
}

- (void)loadHeroUnits
{
    [self.heroUnitDatasource getHeroUnitsWithSuccess:nil failure:nil];
}

- (void)setHeroUnitDatasource:(ARHeroUnitsNetworkModel *)heroUnitDatasource
{
    self.heroUnitVC.heroUnitNetworkModel = heroUnitDatasource;
}

- (ARHeroUnitsNetworkModel *)heroUnitDatasource
{
    return self.heroUnitVC.heroUnitNetworkModel;
}

- (NSDictionary *)tableViewCellIdentifiers
{
    return @{
        @"PartnerShowCellIdentifier" : [ARModernPartnerShowTableViewCell class]
    };
}

- (Class)classForTableView
{
    return [ARTopTapThroughTableView class];
}

- (void)setupTableView
{
    [super setupTableView];

    self.tableView.backgroundColor = [UIColor clearColor];
    self.tableView.restorationIdentifier = @"ARShowFeedTableViewRID";

    [self.tableView layoutIfNeeded];

    CGFloat sideMargin = [UIDevice isPad] ? 50 : 20;

    if ([UIDevice isPad]) {
        ARSerifLabel *featuredShowsLabel = [[ARSerifLabel alloc] init];
        [featuredShowsLabel constrainHeight:@(ARShowFeedHeaderLabelHeightPad).stringValue];
        featuredShowsLabel.font = [featuredShowsLabel.font fontWithSize:24];
        featuredShowsLabel.text = @"Featured Shows";

        ARSeparatorView *showsTitleSeparator = [[ARSeparatorView alloc] init];

        self.headerView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, self.view.frame.size.width, [self heightForHeader])];
        self.headerView.backgroundColor = [UIColor whiteColor];

        [self.headerView addSubview:featuredShowsLabel];
        [featuredShowsLabel alignTop:@(ARShowFeedHeaderLabelMarginPad).stringValue
                             leading:@(sideMargin).stringValue
                              bottom:nil
                            trailing:@(-sideMargin).stringValue
                              toView:self.headerView];
        [featuredShowsLabel alignLeading:@(sideMargin).stringValue trailing:@(-sideMargin).stringValue toView:self.headerView];
        [featuredShowsLabel alignBottomEdgeWithView:self.headerView predicate:@"0"];

        [self.headerView addSubview:showsTitleSeparator];
        [showsTitleSeparator alignBottomEdgeWithView:featuredShowsLabel predicate:nil];
        [showsTitleSeparator alignLeading:@(sideMargin).stringValue trailing:@(-sideMargin).stringValue toView:self.headerView];

    } else {
        self.feedLinkVC = [[ARFeedLinkUnitViewController alloc] init];
        @_weakify(self);
        [ArtsyAPI getXappTokenWithCompletion:^(NSString *xappToken, NSDate *expirationDate) {
            [self.feedLinkVC fetchLinks:^{
                @_strongify(self);
                if (![UIDevice isPad]) { [self layoutFeedLinks]; }
            }];
        }];

        ARPageSubTitleView *featuredShowsLabel = [[ARPageSubTitleView alloc] initWithTitle:@"Current Shows"];
        [featuredShowsLabel constrainHeight:@(ARFeaturedShowsTitleHeightPhone).stringValue];

        self.headerView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, self.view.frame.size.width, [self heightForHeader])];
        self.headerView.backgroundColor = [UIColor whiteColor];

        [self ar_addModernChildViewController:self.feedLinkVC intoView:self.headerView];
        [self.feedLinkVC.view alignTop:@(ARFeedLinksNavMarginPhone).stringValue leading:@(sideMargin).stringValue bottom:nil trailing:@(-sideMargin).stringValue toView:self.headerView];

        [self.headerView addSubview:featuredShowsLabel];
        [featuredShowsLabel constrainTopSpaceToView:self.feedLinkVC.view predicate:@"0"];
        [featuredShowsLabel alignLeading:@"0" trailing:@"0" toView:self.headerView];
    }

    [self.headerView layoutIfNeeded];
    self.tableView.tableHeaderView = self.headerView;
}

- (void)layoutFeedLinks
{
    CGRect frame = self.headerView.frame;
    frame.size.height = [self heightForHeader];
    self.headerView.frame = frame;
    self.tableView.tableHeaderView = self.headerView;
    [self.feedLinkVC.view setNeedsLayout];
    [self.feedLinkVC.view layoutIfNeeded];
}

- (CGFloat)heightForHeader
{
    CGFloat height;
    if ([UIDevice isPad]) {
        height = ARShowFeedHeaderLabelMarginPad + ARShowFeedHeaderLabelHeightPad;
    } else {
        height = ARFeedLinksNavMarginPhone + self.feedLinkVC.preferredContentSize.height + ARFeaturedShowsTitleHeightPhone;
    }
    return height;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];

    [self ar_addModernChildViewController:self.heroUnitVC intoView:self.view belowSubview:self.tableView];
    [self.heroUnitVC.view alignLeading:@"0" trailing:@"0" toView:self.view];
    [self.heroUnitVC.view constrainTopSpaceToView:(UIView *)self.topLayoutGuide predicate:@"0"];
    UIEdgeInsets insets = self.tableView.contentInset;
    insets.top = 20 + self.heroUnitVC.preferredContentSize.height;
    self.tableView.contentInset = insets;

    // Ensure that the table view begins at the correct offset to avoid covering part of the hero unit.
    CGPoint offset = self.tableView.contentOffset;
    offset.y = -insets.top;
    self.tableView.contentOffset = offset;
}

- (BOOL)shouldAutorotate
{
    return [UIDevice isPad];
}

- (BOOL)shouldAutomaticallyForwardAppearanceMethods
{
    return YES;
}

- (NSUInteger)supportedInterfaceOrientations
{
    return [UIDevice isPad] ? UIInterfaceOrientationMaskAll : UIInterfaceOrientationMaskPortrait;
}

- (void)konami:(DRKonamiGestureRecognizer *)recognizer
{
    if ([recognizer konamiState] == DRKonamiGestureStateRecognized) {
        UIFont.ascii = !UIFont.ascii;
        UIImageView.ascii = !UIImageView.ascii;
        ARTile.ascii = !ARTile.ascii;
        [self.tableView reloadData];
    }
}

- (void)addKonami
{
    DRKonamiGestureRecognizer *konamiGestureRecognizer = [[DRKonamiGestureRecognizer alloc] initWithTarget:self action:@selector(konami:)];
    _konamiKeyboardView = [[ARKonamiKeyboardView alloc] initWithKonamiGestureRecognizer:konamiGestureRecognizer];
    [konamiGestureRecognizer setKonamiDelegate:self];
    [konamiGestureRecognizer setRequiresABEnterToUnlock:YES];
    [self.view addGestureRecognizer:konamiGestureRecognizer];
}

#pragma mark -
#pragma mark DRKonamiGestureProtocol

- (void)DRKonamiGestureRecognizerNeedsABEnterSequence:(DRKonamiGestureRecognizer *)gesture
{
    [self.view addSubview:self.konamiKeyboardView];
    [self.konamiKeyboardView becomeFirstResponder];
}

- (void)DRKonamiGestureRecognizer:(DRKonamiGestureRecognizer *)gesture didFinishNeedingABEnterSequenceWithError:(BOOL)error
{
    [self.konamiKeyboardView resignFirstResponder];
    [self.konamiKeyboardView removeFromSuperview];
}

@end
