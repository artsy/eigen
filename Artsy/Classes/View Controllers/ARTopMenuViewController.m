#import "ARTopMenuViewController+DeveloperExtras.h"
#import "ARContentViewControllers.h"

#import "UIViewController+FullScreenLoading.h"
#import "ARTabContentView.h"
#import "ARTopMenuNavigationDataSource.h"
#import "ARSearchViewController.h"
#import "ArtsyAPI+Private.h"

@interface ARTopMenuViewController () <ARTabViewDelegate>
@property (readwrite, nonatomic, strong) NSArray *constraintsForButtons;

@property (readwrite, nonatomic, assign) BOOL hidesToolbarMenu;

@property (readwrite, nonatomic, assign) enum ARTopTabControllerIndex selectedTabIndex;
@property (readwrite, nonatomic, strong) NSLayoutConstraint *tabHeightConstraint;

@property (readwrite, nonatomic, strong) ARTopMenuNavigationDataSource *navigationDataSource;
@property (readonly, nonatomic, strong) UIView *tabContainer;
@property (readonly, nonatomic, strong) CALayer *divider;
@end

static const CGFloat ARSearchMenuButtonDimension = 46;

@implementation ARTopMenuViewController

+ (ARTopMenuViewController *)sharedController
{
    static ARTopMenuViewController *_sharedManager = nil;
    static dispatch_once_t oncePredicate;
    dispatch_once(&oncePredicate, ^{
        _sharedManager = [[self alloc] init];
    });
    return _sharedManager;
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    self.view.backgroundColor = [UIColor blackColor];
    _selectedTabIndex = -1;

    _navigationDataSource = _navigationDataSource ?: [[ARTopMenuNavigationDataSource alloc] init];

    UIView *tabContainer = [[UIView alloc] init];
    _tabContainer = tabContainer;

    ARNavigationTabButton *searchButton = [[ARNavigationTabButton alloc] init];
    ARNavigationTabButton *homeButton = [[ARNavigationTabButton alloc] init];
    ARNavigationTabButton *showsButton = [[ARNavigationTabButton alloc] init];
    ARNavigationTabButton *browseButton = [[ARNavigationTabButton alloc] init];
    ARNavigationTabButton *magazineButton = [[ARNavigationTabButton alloc] init];
    ARNavigationTabButton *favoritesButton = [[ARNavigationTabButton alloc] init];

    [searchButton setImage:[UIImage imageNamed:@"SearchIcon_White"] forState:UIControlStateNormal];
    [searchButton setImage:[UIImage imageNamed:@"SearchIcon_White"] forState:UIControlStateSelected];
    [searchButton.imageView constrainWidth:@"16" height:@"16"];
    searchButton.adjustsImageWhenHighlighted = NO;

    [homeButton setTitle:@"HOME" forState:UIControlStateNormal];
    [showsButton setTitle:@"SHOWS" forState:UIControlStateNormal];
    [browseButton setTitle:@"EXPLORE" forState:UIControlStateNormal];
    [magazineButton setTitle:@"MAG" forState:UIControlStateNormal];
    [favoritesButton setTitle:@"YOU" forState:UIControlStateNormal];

    NSArray *buttons = @[searchButton, homeButton, showsButton, browseButton, magazineButton, favoritesButton];

    ARTabContentView *tabContentView = [[ARTabContentView alloc] initWithFrame:CGRectZero hostViewController:self delegate:self dataSource:self.navigationDataSource];
    tabContentView.supportSwipeGestures = NO;
    tabContentView.buttons = buttons;
    [tabContentView setCurrentViewIndex:ARTopTabControllerIndexFeed animated:NO];
    _tabContentView = tabContentView;

    // Layout
    [self.view addSubview:tabContentView];
    [tabContentView alignTop:@"0" leading:@"0" bottom:nil trailing:@"0" toView:self.view];
    [tabContentView constrainWidthToView:self.view predicate:@"0"];

    [self.view addSubview:tabContainer];
    [tabContainer constrainHeight:@(ARSearchMenuButtonDimension).stringValue];
    [tabContainer constrainTopSpaceToView:tabContentView predicate:nil];
    [tabContainer alignLeading:@"0" trailing:@"0" toView:self.view];

    for (ARNavigationTabButton *button in buttons) {
        [tabContainer addSubview:button];
    }

    UIView *separator = [[UIView alloc] init];
    [separator constrainHeight:@".5"];
    separator.backgroundColor = [UIColor colorWithWhite:.3 alpha:1];
    [tabContainer addSubview:separator];
    [separator alignTop:@"0" leading:@"0" bottom:nil trailing:@"0" toView:tabContainer];

    [searchButton constrainWidth:@(ARSearchMenuButtonDimension).stringValue];
    NSMutableArray *constraintsForButtons = [NSMutableArray array];
    [buttons eachWithIndex:^(UIButton *button, NSUInteger index){
        [button constrainTopSpaceToView:separator predicate:@"0"];
        [button alignBottomEdgeWithView:tabContainer predicate:@"0"];
        if (index == 0) {
            [button alignLeadingEdgeWithView:tabContainer predicate:nil];
        } else {
            [constraintsForButtons addObject:[[button constrainLeadingSpaceToView:buttons[index - 1] predicate:nil] lastObject] ];
        }
        if (index == buttons.count - 1) {
            [constraintsForButtons addObject:[[tabContainer alignTrailingEdgeWithView:button predicate:nil] lastObject]];
        }
    }];

    self.constraintsForButtons = [constraintsForButtons copy];

    CALayer *divider = [[CALayer alloc] init];
    divider.backgroundColor = [UIColor artsyHeavyGrey].CGColor;
    divider.opacity = 0.5;
    [tabContainer.layer addSublayer:divider];
    _divider = divider;

    self.tabHeightConstraint = [[tabContainer alignBottomEdgeWithView:self.view predicate:@"0"] lastObject];
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    [ArtsyAPI getXappTokenWithCompletion:^(NSString *xappToken, NSDate *expirationDate) {
        [self.navigationDataSource prefetchBrowse];
        [self.navigationDataSource prefetchHeroUnits];
    }];
}

- (void)viewWillTransitionToSize:(CGSize)size withTransitionCoordinator:(id<UIViewControllerTransitionCoordinator>)coordinator
{
    [super viewWillTransitionToSize:size withTransitionCoordinator:coordinator];
    [self.view layoutSubviews];

}

- (void)viewWillLayoutSubviews
{
    NSArray *buttons = self.tabContentView.buttons;
    __block CGFloat buttonsWidth = ARSearchMenuButtonDimension;
    [buttons eachWithIndex:^(UIButton *button, NSUInteger index){
        if (index == 0){ return; }
        buttonsWidth += button.intrinsicContentSize.width;
    }];

    CGFloat viewWidth = self.view.frame.size.width;
    CGFloat extraWidth = viewWidth - buttonsWidth;
    CGFloat eachMargin = floorf(extraWidth / (self.tabContentView.buttons.count - 1));

    [self.constraintsForButtons eachWithIndex:^(NSLayoutConstraint *constraint, NSUInteger index) {
        CGFloat margin = eachMargin;
        if (index == 0 || index == self.constraintsForButtons.count - 1){ margin /= 2; }
        constraint.constant = margin;
    }];
}

- (ARNavigationController *)rootNavigationController
{
    return (ARNavigationController *)[self.tabContentView currentNavigationController];
}

#pragma mark - ARMenuAwareViewController

- (void)hideToolbar:(BOOL)hideToolbar animated:(BOOL)animated
{
    BOOL isCurrentlyHiding = (self.tabHeightConstraint.constant != 0);
    if (isCurrentlyHiding == hideToolbar) { return; }

    [UIView animateIf:animated duration:ARAnimationQuickDuration :^{
        self.tabHeightConstraint.constant = hideToolbar ? self.tabContainer.frame.size.height : 0;

        [self.view setNeedsLayout];
        [self.view layoutIfNeeded];
    }];
}

- (BOOL)hidesBackButton
{
    return YES;
}

#pragma mark - UIViewController

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];

#ifdef DEBUG
    [self runDeveloperExtras];
#endif
}

- (void)viewDidLayoutSubviews
{
    CGFloat tabHeight = self.tabContainer.frame.size.height;
    self.divider.frame = CGRectMake(tabHeight, tabHeight * .25, 1, tabHeight * .5);
}

- (void)moveToInAppAnimated:(BOOL)animated
{
    if (self.presentedViewController) {
        self.presentedViewController.transitioningDelegate = self;
        [self.presentedViewController dismissViewControllerAnimated:animated completion:^{
            if ([User currentUser]) {
                [ARTrialController performPostSignupEvent];
            }
        }];
    }
}

#pragma mark - Pushing VCs

- (void)loadFeed
{

}

- (void)pushViewController:(UIViewController *)viewController
{
    [self pushViewController:viewController animated:YES];
}

- (void)pushViewController:(UIViewController *)viewController animated:(BOOL)animated
{
    NSAssert(viewController != nil, @"Attempt to push a nil view controller. ");
    [self.rootNavigationController pushViewController:viewController animated:animated];
}

#pragma mark - Auto Rotation

// Let the nav decide what rotations to support

-(BOOL)shouldAutorotate
{
    return [self.rootNavigationController shouldAutorotate];
}

-(NSUInteger)supportedInterfaceOrientations
{
    return self.rootNavigationController.supportedInterfaceOrientations ?: ([UIDevice isPad] ? UIInterfaceOrientationMaskAll : UIInterfaceOrientationMaskPortrait);
}

- (UIInterfaceOrientation)preferredInterfaceOrientationForPresentation
{
    return self.rootNavigationController.preferredInterfaceOrientationForPresentation ?: UIInterfaceOrientationPortrait;
}

#pragma mark Spinners

- (void)startLoading
{
    ARTopMenuViewController *topMenuViewController = [ARTopMenuViewController sharedController];
    [topMenuViewController ar_presentIndeterminateLoadingIndicatorAnimated:YES];
}

- (void)stopLoading
{
    ARTopMenuViewController *topMenuViewController = [ARTopMenuViewController sharedController];
    [topMenuViewController ar_removeIndeterminateLoadingIndicatorAnimated:YES];
}

#pragma mark - Tab selection flow handling

- (void)returnToPreviousTab
{
    [self.tabContentView returnToPreviousViewIndex];
}

- (void)userDidSignUp
{
    [self.tabContentView setCurrentViewIndex:ARTopTabControllerIndexFavorites animated:NO];
}

#pragma mark - ARTabViewDelegate

- (void)tabContentView:(ARTabContentView *)tabContentView didChangeSelectedIndex:(NSInteger)index
{
    _selectedTabIndex = index;

    if (index == ARTopTabControllerIndexSearch) {
        ARNavigationController *controller = (id)[tabContentView currentNavigationController];

        [controller popToRootViewControllerAnimated:NO];
        ARSearchViewController *searchViewController = (id)controller.topViewController;
        [searchViewController clearSearchAnimated:NO];
    }
}

- (BOOL)tabContentView:(ARTabContentView *)tabContentView shouldChangeToIndex:(NSInteger)index
{
    if (index == ARTopTabControllerIndexFavorites && [User isTrialUser]) {
        [ARTrialController presentTrialWithContext:ARTrialContextShowingFavorites fromTarget:self selector:@selector(userDidSignUp)];
        return NO;
    }

    // Remove any existing x-callback-url actions if you change tabs or pop to the root.

    [ARTopMenuViewController sharedController].backButtonCallbackManager = nil;

    if (index == _selectedTabIndex) {

        ARNavigationController *controller = (id)[tabContentView currentNavigationController];

        if (controller.viewControllers.count == 1) {

            if (index == ARTopTabControllerIndexSearch) {
                [self returnToPreviousTab];

            } else {
                UIScrollView *scrollView = nil;

                if (index == ARTopTabControllerIndexFeed) {
                    scrollView = [(ARShowFeedViewController *)[controller.childViewControllers objectAtIndex:0] tableView];
                } else if (index == ARTopTabControllerIndexBrowse) {
                    scrollView = [(ARBrowseViewController *)[controller.childViewControllers objectAtIndex:0] collectionView];
                } else if (index == ARTopTabControllerIndexFavorites) {
                    scrollView = [(ARFavoritesViewController *)[controller.childViewControllers objectAtIndex:0] collectionView];
                }

                [scrollView setContentOffset:CGPointMake(scrollView.contentOffset.x, -scrollView.contentInset.top) animated:YES];
            }

        } else {
            [controller popToRootViewControllerAnimated:YES];
        }

        return NO;
    }

    return YES;
}

@end
