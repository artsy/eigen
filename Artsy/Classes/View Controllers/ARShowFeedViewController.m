#import "ARShowFeedViewController.h"
#import "ARHeroUnitViewController.h"
#import "ARHeroUnitsNetworkModel.h"
#import "ARModernPartnerShowTableViewCell.h"
#import "ARPageSubTitleView.h"
#import "ARFeedLinkUnitViewController.h"
#import "ARFeaturedArtworksViewController.h"
#import "UIViewController+SimpleChildren.h"
#import "ARAppNotificationsDelegate.h"
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

@interface ARShowFeedViewController() <ARMenuAwareViewController, DRKonamiGestureProtocol>

@property (nonatomic, strong) ARHeroUnitViewController *heroUnitVC;
@property (nonatomic, strong) ARFeedLinkUnitViewController *feedLinkVC;
@property (nonatomic, strong) UIView *pageTitle;
@property (nonatomic, strong) CALayer *separator;
@property (nonatomic, strong) UIView *featuredArtworksView;
@property (nonatomic, strong) ARFeaturedArtworksViewController *featuredArtworksVC;
@property (nonatomic, readonly) ARKonamiKeyboardView *konamiKeyboardView;
@property (nonatomic, strong, readwrite) UIView *headerView;

@property (nonatomic, strong) AROfflineView *offlineView;
@property (nonatomic, readwrite, getter = isSHowingOfflineView) BOOL showingOfflineView;
@property (nonatomic, strong) id networkNotificationObserver;

@end

@implementation ARShowFeedViewController

- (instancetype)initWithFeedTimeline:(ARFeedTimeline *)timeline
{
    self = [super initWithFeedTimeline:timeline];
    if (!self) { return nil; }

    _heroUnitVC = [[ARHeroUnitViewController alloc] init];

    @weakify(self);
    NSNotificationCenter *defaultCenter = [NSNotificationCenter defaultCenter];
    self.networkNotificationObserver = [defaultCenter addObserverForName:ARNetworkUnavailableNotification object:nil queue:[NSOperationQueue mainQueue] usingBlock:^(NSNotification *note) {
        @strongify(self);
        if (self.feedTimeline.numberOfItems == 0) {
            // The offline view will be hidden when we load content.
            [self showOfflineView];
        }
    }];
    self.automaticallyAdjustsScrollViewInsets = NO;
    return self;
}

- (void)dealloc {
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

- (void)setShowingOfflineView:(BOOL)showingOfflineView {
    // Force containing VC to re-evaluate the state of the menu button.
    [self willChangeValueForKey:@keypath(self, hidesToolbarMenu)];
    _showingOfflineView = showingOfflineView;
    [self didChangeValueForKey:@keypath(self, hidesToolbarMenu)];
}

#pragma mark - Private Methods

- (void)showOfflineView {
    self.showingOfflineView = YES;

    if (self.offlineView == nil) {
        self.offlineView = [[AROfflineView alloc] initWithFrame:self.view.bounds];
    }

    [self.view addSubview:self.offlineView];

    [self.offlineView alignCenterWithView:self.view];
    [self.offlineView constrainWidthToView:self.view predicate:@""];
    [self.offlineView constrainHeightToView:self.view predicate:@""];
}

- (void)hideOfflineView {
    self.showingOfflineView = NO;

    [self.offlineView removeFromSuperview];

    self.offlineView = nil;
}

#pragma mark - ARMenuAwareViewController

- (BOOL)hidesBackButton {
    return self.navigationController.viewControllers.count <= 1;
}

- (BOOL)hidesToolbarMenu {
    return self.showingOfflineView == YES;
}
- (void)refreshFeedItems
{
    [ARAnalytics startTimingEvent:ARAnalyticsInitialFeedLoadTime];
    [self presentLoadingView];

    @weakify(self)
    [ArtsyAPI getXappTokenWithCompletion:^(NSString *xappToken, NSDate *expirationDate) {
        [self.feedTimeline getNewItems:^{
            @strongify(self);
            [self.tableView reloadData];
            [self hideLoadingView];
            [self hideOfflineView];
            [self loadNextFeedPage];
            [ARAnalytics finishTimingEvent:ARAnalyticsInitialFeedLoadTime];

        } failure:^(NSError *error) {
            ARErrorLog(@"There was an error getting newest items for the feed: %@", error.localizedDescription);
            [self performSelector:@selector(refreshFeed) withObject:nil afterDelay:3];
            [ARAnalytics finishTimingEvent:ARAnalyticsInitialFeedLoadTime];
        }];
    }];
    // TODO: unify this across iPad/iPhone
    if ([UIDevice isPad]) {
        [ArtsyAPI getFeaturedWorks:^(NSArray *works) {
            @strongify(self);
            self.featuredArtworksVC.artworks = works;
        } failure:^(NSError *error) {
            ARErrorLog(@"Couldn't fetch featured artworks. Error: %@", error.localizedDescription);
        }];
    }
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
        ARSerifLabel *featuredArtworksLabel = [[ARSerifLabel alloc] init];
        [featuredArtworksLabel constrainHeight:@(ARShowFeedHeaderLabelHeightPad).stringValue];
        featuredArtworksLabel.font = [featuredArtworksLabel.font fontWithSize:24];
        featuredArtworksLabel.text = @"Featured Artworks";

        self.featuredArtworksVC = [[ARFeaturedArtworksViewController alloc] init];

        ARSerifLabel *featuredShowsLabel = [[ARSerifLabel alloc] init];
        [featuredShowsLabel constrainHeight:@(ARShowFeedHeaderLabelHeightPad).stringValue];
        featuredShowsLabel.font = [featuredShowsLabel.font fontWithSize:24];
        featuredShowsLabel.text = @"Featured Shows";

        ARSeparatorView *artworksTitleSeparator = [[ARSeparatorView alloc] init];
        ARSeparatorView *showsTitleSeparator = [[ARSeparatorView alloc] init];

        self.headerView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, self.view.frame.size.width, [self heightForHeader])];
        self.headerView.backgroundColor = [UIColor whiteColor];

        [self.headerView addSubview:featuredArtworksLabel];
        [featuredArtworksLabel alignTop:@(ARShowFeedHeaderLabelMarginPad).stringValue leading:@(sideMargin).stringValue
            bottom:nil trailing:@(-sideMargin).stringValue toView:self.headerView];

        [self.headerView addSubview:artworksTitleSeparator];
        [artworksTitleSeparator alignBottomEdgeWithView:featuredArtworksLabel predicate:nil];
        [artworksTitleSeparator alignLeading:@(sideMargin).stringValue trailing:@(-sideMargin).stringValue toView:self.headerView];

        [self ar_addModernChildViewController:self.featuredArtworksVC intoView:self.headerView];
        [self.featuredArtworksVC.view alignLeading:@"0" trailing:@"0" toView:self.headerView];
        [self.featuredArtworksVC.view constrainTopSpaceToView:featuredArtworksLabel predicate:@(ARShowFeedHeaderLabelMarginPad).stringValue];

        [self.headerView addSubview:featuredShowsLabel];
        [featuredShowsLabel constrainTopSpaceToView:self.featuredArtworksVC.view predicate:@(ARShowFeedHeaderLabelMarginPad).stringValue];
        [featuredShowsLabel alignLeading:@(sideMargin).stringValue trailing:@(-sideMargin).stringValue toView:self.headerView];
        [featuredShowsLabel alignBottomEdgeWithView:self.headerView predicate:@"0"];

        [self.headerView addSubview:showsTitleSeparator];
        [showsTitleSeparator alignBottomEdgeWithView:featuredShowsLabel predicate:nil];
        [showsTitleSeparator alignLeading:@(sideMargin).stringValue trailing:@(-sideMargin).stringValue toView:self.headerView];

    } else {
        self.feedLinkVC = [[ARFeedLinkUnitViewController alloc] init];
        @weakify(self);
        [ArtsyAPI getXappTokenWithCompletion:^(NSString *xappToken, NSDate *expirationDate) {
            [self.feedLinkVC fetchLinks:^{
                @strongify(self);
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
    if ([UIDevice isPad] ) {
        CGFloat labelHeight = ARShowFeedHeaderLabelMarginPad + ARShowFeedHeaderLabelHeightPad;
        CGFloat artworksHeight = ARShowFeedHeaderLabelMarginPad + self.featuredArtworksVC.preferredContentSize.height;
        height = (2 * labelHeight) + artworksHeight;
    } else {
        height =  ARFeedLinksNavMarginPhone + self.feedLinkVC.preferredContentSize.height + ARFeaturedShowsTitleHeightPhone;
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
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];

    ARAppNotificationsDelegate * delegate = (ARAppNotificationsDelegate *) [JSDecoupledAppDelegate sharedAppDelegate].remoteNotificationsDelegate;
    [delegate registerForDeviceNotificationsOnce];
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
    if ([recognizer konamiState] == DRKonamiGestureStateRecognized ) {
        UIFont.ascii = ! UIFont.ascii;
        UIImageView.ascii = ! UIImageView.ascii;
        ARTile.ascii = ! ARTile.ascii;
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

- (void)DRKonamiGestureRecognizerNeedsABEnterSequence:(DRKonamiGestureRecognizer*)gesture
{
    [self.view addSubview:self.konamiKeyboardView];
    [self.konamiKeyboardView becomeFirstResponder];
}

- (void)DRKonamiGestureRecognizer:(DRKonamiGestureRecognizer*)gesture didFinishNeedingABEnterSequenceWithError:(BOOL)error
{
    [self.konamiKeyboardView resignFirstResponder];
    [self.konamiKeyboardView removeFromSuperview];
}

@end
