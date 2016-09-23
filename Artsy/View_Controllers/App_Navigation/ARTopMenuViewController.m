#import "ARTopMenuViewController+DeveloperExtras.h"
#import "ARContentViewControllers.h"
#import "ARAppStatus.h"

#import "UIViewController+FullScreenLoading.h"
#import "ARTabContentView.h"
#import "ARTopMenuNavigationDataSource.h"
#import "ARUserManager.h"
#import "ArtsyAPI+Private.h"
#import "ARAppConstants.h"
#import "ARAnalyticsConstants.h"
#import "ARFonts.h"
#import "User.h"
#import "ARSwitchBoard.h"

#import "UIView+HitTestExpansion.h"
#import <objc/runtime.h>
#import "UIDevice-Hardware.h"
#import "Artsy-Swift.h"

#import <JSBadgeView/JSBadgeView.h>
#import <NPKeyboardLayoutGuide/NPKeyboardLayoutGuide.h>
#import <Artsy_UIButtons/ARButtonSubclasses.h>
#import <UIView_BooleanAnimations/UIView+BooleanAnimations.h>
#import <objc/runtime.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <ObjectiveSugar/ObjectiveSugar.h>

static const CGFloat ARMenuButtonDimension = 46;


@interface ARTopMenuViewController () <ARTabViewDelegate>
@property (readwrite, nonatomic, strong) NSArray *constraintsForButtons;

@property (readwrite, nonatomic, assign) BOOL hidesToolbarMenu;

@property (readwrite, nonatomic, assign) enum ARTopTabControllerIndex selectedTabIndex;
@property (readwrite, nonatomic, strong) NSLayoutConstraint *tabBottomConstraint;

@property (readwrite, nonatomic, strong) ARTopMenuNavigationDataSource *navigationDataSource;
@property (readwrite, nonatomic, strong) UIView *tabContainer;
@end


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
    self.selectedTabIndex = -1;

    self.navigationDataSource = _navigationDataSource ?: [[ARTopMenuNavigationDataSource alloc] init];

    // TODO: Turn into custom view?

    ARNavigationTabButton *homeButton = [[ARNavigationTabButton alloc] init];
    ARNavigationTabButton *showsButton = [[ARNavigationTabButton alloc] init];
    ARNavigationTabButton *browseButton = [[ARNavigationTabButton alloc] init];
    ARNavigationTabButton *magazineButton = [[ARNavigationTabButton alloc] init];
    ARNavigationTabButton *favoritesButton = [[ARNavigationTabButton alloc] init];
    ARNavigationTabButton *notificationsButton = [[ARNavigationTabButton alloc] init];
    notificationsButton.tag = ARNavButtonNotificationsTag;

    homeButton.accessibilityLabel = @"Home";
    [homeButton setImage:[UIImage imageNamed:@"HomeButton"] forState:UIControlStateNormal];
    [homeButton setImage:[UIImage imageNamed:@"HomeButton"] forState:UIControlStateSelected];
    CGFloat buttonImageSize = 20;
    CGFloat inset = (ARMenuButtonDimension - buttonImageSize) / 2;
    homeButton.contentEdgeInsets = UIEdgeInsetsMake(inset, inset, inset, inset);

    [showsButton setTitle:@"SHOWS" forState:UIControlStateNormal];
    [browseButton setTitle:@"EXPLORE" forState:UIControlStateNormal];
    [magazineButton setTitle:@"MAG" forState:UIControlStateNormal];
    [favoritesButton setTitle:@"YOU" forState:UIControlStateNormal];

    notificationsButton.accessibilityLabel = @"Notifications";
    [notificationsButton setImage:[UIImage imageNamed:@"NotificationsButton"] forState:UIControlStateNormal];
    [notificationsButton setImage:[UIImage imageNamed:@"NotificationsButton"] forState:UIControlStateSelected];
    [notificationsButton.imageView constrainWidth:@"12" height:@"14"];

    [magazineButton ar_extendHitTestSizeByWidth:5 andHeight:0];
    [favoritesButton ar_extendHitTestSizeByWidth:5 andHeight:0];
    [notificationsButton ar_extendHitTestSizeByWidth:10 andHeight:0];

    NSArray *buttons = @[ homeButton, showsButton, browseButton, magazineButton, favoritesButton, notificationsButton ];

    UIView *tabContainer = [[UIView alloc] init];
    self.tabContainer = tabContainer;
    self.tabContainer.backgroundColor = [UIColor blackColor];
    [self.view addSubview:tabContainer];

    ARTabContentView *tabContentView = [[ARTabContentView alloc] initWithFrame:CGRectZero
                                                            hostViewController:self
                                                                      delegate:self
                                                                    dataSource:self.navigationDataSource];
    tabContentView.supportSwipeGestures = NO;
    tabContentView.buttons = buttons;
    [tabContentView setCurrentViewIndex:ARTopTabControllerIndexFeed animated:NO];
    _tabContentView = tabContentView;
    [self.view addSubview:tabContentView];

    // Layout
    [tabContentView alignTopEdgeWithView:self.view predicate:@"0"];
    [tabContentView alignLeading:@"0" trailing:@"0" toView:self.view];
    [tabContentView constrainBottomSpaceToView:self.tabContainer predicate:@"0"];
    [tabContentView constrainWidthToView:self.view predicate:@"0"];

    [tabContainer constrainHeight:@(ARMenuButtonDimension).stringValue];
    [tabContainer alignLeading:@"0" trailing:@"0" toView:self.view];
    self.tabBottomConstraint = [tabContainer alignBottomEdgeWithView:self.view predicate:@"0"];

    for (ARNavigationTabButton *button in buttons) {
        [tabContainer addSubview:button];
    }

    UIView *separator = [[UIView alloc] init];
    [separator constrainHeight:@".5"];
    separator.backgroundColor = [UIColor colorWithWhite:.3 alpha:1];
    [tabContainer addSubview:separator];
    [separator alignTopEdgeWithView:tabContainer predicate:@"0"];
    [separator constrainWidthToView:tabContainer predicate:@"0"];

    NSMutableArray *constraintsForButtons = [NSMutableArray array];
    [buttons eachWithIndex:^(UIButton *button, NSUInteger index) {
        [button constrainTopSpaceToView:separator predicate:@"0"];
        [button alignBottomEdgeWithView:tabContainer predicate:@"0"];
        if (index == 0) {
            [button alignLeadingEdgeWithView:tabContainer predicate:@"0"];
        } else {
            [constraintsForButtons addObject:[button constrainLeadingSpaceToView:buttons[index - 1] predicate:@"0"]];
        }
        if (index == buttons.count - 1) {
            [constraintsForButtons addObject:[tabContainer alignTrailingEdgeWithView:button predicate:@"0"]];
        }
    }];
    self.constraintsForButtons = [constraintsForButtons copy];

    // Ensure it's created now and started listening for keyboard changes.
    // TODO Ideally this pod would start listening from launch of the app, so we don't need to rely on this one but can
    // be assured that any VCs guide can be trusted.
    (void)self.keyboardLayoutGuide;

    [self registerWithSwitchBoard:ARSwitchBoard.sharedInstance];
}

- (void)registerWithSwitchBoard:(ARSwitchBoard *)switchboard
{
    NSDictionary *menuToPaths = @{
        @(ARTopTabControllerIndexFeed) : @"/",
        @(ARTopTabControllerIndexBrowse) : @"/browse",
        @(ARTopTabControllerIndexMagazine) : @"/articles",
        @(ARTopTabControllerIndexFavorites) : @"/favorites",
        @(ARTopTabControllerIndexShows) : @"/shows",
        @(ARTopTabControllerIndexNotifications) : @"/works-for-you",
    };

    for (NSNumber *tabIndex in menuToPaths.keyEnumerator) {
        [switchboard registerPathCallbackAtPath:menuToPaths[tabIndex] callback:^id _Nullable(NSDictionary *_Nullable parameters) {
            return [self rootNavigationControllerAtIndex:tabIndex.integerValue].rootViewController;
        }];
    }
}

- (void)viewWillTransitionToSize:(CGSize)size withTransitionCoordinator:(id<UIViewControllerTransitionCoordinator>)coordinator
{
    [super viewWillTransitionToSize:size withTransitionCoordinator:coordinator];
    [self.view layoutSubviews];
}

- (void)viewWillLayoutSubviews
{
    NSArray *buttons = self.tabContentView.buttons;
    __block CGFloat buttonsWidth = ARMenuButtonDimension;
    [buttons eachWithIndex:^(UIButton *button, NSUInteger index) {
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

- (UIViewController *)visibleViewController;
{
    return self.presentedViewController ?: self.rootNavigationController.visibleViewController;
}

- (ARNavigationController *)rootNavigationController;
{
    return (ARNavigationController *)[self.tabContentView currentNavigationController];
}

- (ARNavigationController *)rootNavigationControllerAtIndex:(NSInteger)index;
{
    return (ARNavigationController *)[self.navigationDataSource navigationControllerAtIndex:index];
}

- (void)presentRootViewControllerAtIndex:(NSInteger)index animated:(BOOL)animated;
{
    BOOL alreadySelectedTab = self.selectedTabIndex == index;
    ARNavigationController *controller = [self rootNavigationControllerAtIndex:index];
    if (controller.viewControllers.count > 1) {
        [controller popToRootViewControllerAnimated:(animated && alreadySelectedTab)];
    }
    if (!alreadySelectedTab) {
        [self.tabContentView setCurrentViewIndex:index animated:animated];
    }
}

- (NSInteger)indexOfRootViewController:(UIViewController *)viewController;
{
    NSInteger numberOfTabs = [self.navigationDataSource numberOfViewControllersForTabContentView:self.tabContentView];
    for (NSInteger index = 0; index < numberOfTabs; index++) {
        ARNavigationController *rootController = [self rootNavigationControllerAtIndex:index];
        if (rootController.rootViewController == viewController) {
            return index;
        }
    }
    return NSNotFound;
}

#pragma mark - Badges

- (void)setNotificationCount:(NSUInteger)number forControllerAtIndex:(ARTopTabControllerIndex)index;
{
    [self.navigationDataSource setNotificationCount:number forControllerAtIndex:index];
    [self updateBadges];
}

- (void)updateBadges;
{
    [self.tabContentView.buttons eachWithIndex:^(UIButton *button, NSUInteger index) {
        NSUInteger number = [self.navigationDataSource badgeNumberForTabAtIndex:index];
        if (number > 0) {
            JSBadgeView *badgeView = [self badgeForButtonAtIndex:index createIfNecessary:YES];
            badgeView.badgeText = [NSString stringWithFormat:@"%lu", (long unsigned)number];
            badgeView.hidden = NO;
        } else {
            JSBadgeView *badgeView = [self badgeForButtonAtIndex:index createIfNecessary:NO];
            badgeView.badgeText = @"0";
            badgeView.hidden = YES;
        }
    }];
}

- (JSBadgeView *)badgeForButtonAtIndex:(NSInteger)index createIfNecessary:(BOOL)createIfNecessary;
{
    static char kButtonBadgeKey;
    UIButton *button = self.tabContentView.buttons[index];
    JSBadgeView *badgeView = objc_getAssociatedObject(button, &kButtonBadgeKey);
    if (badgeView == nil && createIfNecessary) {
        UIView *parentView = [button titleForState:UIControlStateNormal] == nil ? button.imageView : button.titleLabel;
        parentView.clipsToBounds = NO;
        badgeView = [[JSBadgeView alloc] initWithParentView:parentView alignment:JSBadgeViewAlignmentTopRight];
        badgeView.badgeTextFont = [UIFont sansSerifFontWithSize:10];
        // This is a unique purple color. If it ever needs to be used elsewhere it should be moved to Artsy-UIColors.
        badgeView.badgeBackgroundColor = [[UIColor alloc] initWithRed:139.0 / 255.0 green:0 blue:255.0 alpha:1];
        objc_setAssociatedObject(button, &kButtonBadgeKey, badgeView, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    }
    return badgeView;
}

#pragma mark - ARMenuAwareViewController

- (void)hideToolbar:(BOOL)hideToolbar animated:(BOOL)animated
{
    BOOL isCurrentlyHiding = (self.tabBottomConstraint.constant != 0);
    if (isCurrentlyHiding == hideToolbar) {
        return;
    }

    [UIView animateIf:animated duration:ARAnimationQuickDuration:^{
        self.tabBottomConstraint.constant = hideToolbar ? CGRectGetHeight(self.tabContainer.frame) : 0;

        [self.view setNeedsLayout];
        [self.view layoutIfNeeded];
    }];
}

- (BOOL)hidesNavigationButtons
{
    return YES;
}

#pragma mark - UIViewController

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];

#ifdef DEBUG
    if ([ARAppStatus isRunningTests] == NO) {
        static dispatch_once_t onceToken;
        dispatch_once(&onceToken, ^{
            [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(appHasBeenInjected:) name:@"INJECTION_BUNDLE_NOTIFICATION" object:nil];

            [self runSwiftDeveloperExtras];
            [self runDeveloperExtras];
        });
    }
#endif
}

// This is for when we would ever switch to VC controlled status bar showing, set in the Info.plist
//
//- (UIViewController *)childViewControllerForStatusBarHidden;
//{
//    return self.visibleViewController;
//}
//
//- (BOOL)prefersStatusBarHidden;
//{
//    return self.childViewControllerForStatusBarHidden.prefersStatusBarHidden;
//}

#pragma mark - Pushing VCs

- (void)pushViewController:(UIViewController *)viewController
{
    [self pushViewController:viewController animated:ARPerformWorkAsynchronously];
}

- (void)pushViewController:(UIViewController *)viewController animated:(BOOL)animated
{
    [self pushViewController:viewController animated:animated completion:nil];
}

+ (BOOL)shouldPresentViewControllerAsModal:(UIViewController *)viewController
{
    NSArray *modalClasses = @[ UINavigationController.class, UISplitViewController.class ];
    for (Class klass in modalClasses) {
        if ([viewController isKindOfClass:klass]) {
            return YES;
        }
    }
    return NO;
}

- (void)pushViewController:(UIViewController *)viewController animated:(BOOL)animated completion:(void (^__nullable)(void))completion
{
    NSAssert(viewController != nil, @"Attempt to push a nil view controller.");

    if ([self.class shouldPresentViewControllerAsModal:viewController]) {
        [self presentViewController:viewController animated:animated completion:completion];
        return;
    }

    NSInteger index = [self indexOfRootViewController:viewController];
    if (index != NSNotFound) {
        [self presentRootViewControllerAtIndex:index animated:(animated && index != self.selectedTabIndex)];
    } else {
        [self.rootNavigationController pushViewController:viewController animated:animated];
    }
}

#pragma mark - Auto Rotation

// Let the nav decide what rotations to support

- (BOOL)shouldAutorotate
{
    return [self.rootNavigationController shouldAutorotate];
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations
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

#pragma mark - ARTabViewDelegate

- (void)tabContentView:(ARTabContentView *)tabContentView didChangeSelectedIndex:(NSInteger)index
{
    self.selectedTabIndex = index;
}

- (BOOL)tabContentView:(ARTabContentView *)tabContentView shouldChangeToIndex:(NSInteger)index
{
    
    // TODO MAXIM : Change this for demo mode
//    BOOL favoritesInDemoMode = (index == ARTopTabControllerIndexFavorites && ARIsRunningInDemoMode);
//    BOOL loggedOutBellOrFavorites = (index == ARTopTabControllerIndexFavorites || index == ARTopTabControllerIndexNotifications) && [User isLocalTemporaryUser];
//    if (!favoritesInDemoMode && loggedOutBellOrFavorites) {
//        ARTrialContext context = (index == ARTopTabControllerIndexFavorites) ? ARTrialContextShowingFavorites : ARTrialContextNotifications;
//        [ARTrialController presentTrialWithContext:context success:^(BOOL newUser) {
//            if (newUser) {
//                [self.tabContentView setCurrentViewIndex:ARTopTabControllerIndexFeed animated:NO];
//            } else {
//                [self.tabContentView setCurrentViewIndex:index animated:NO];
//            }
//        }];
//        return NO;
//    }

    if (index == self.selectedTabIndex) {
        ARNavigationController *controller = (id)[tabContentView currentNavigationController];

        if (controller.viewControllers.count == 1) {
            UIScrollView *scrollView = nil;
            if (index == ARTopTabControllerIndexFeed) {
                scrollView = [(ARSimpleShowFeedViewController *)[controller.childViewControllers objectAtIndex:0] tableView];
            } else if (index == ARTopTabControllerIndexBrowse) {
                scrollView = [(ARBrowseViewController *)[controller.childViewControllers objectAtIndex:0] collectionView];
            } else if (index == ARTopTabControllerIndexFavorites) {
                scrollView = [(ARFavoritesViewController *)[controller.childViewControllers objectAtIndex:0] collectionView];
            }
            [scrollView setContentOffset:CGPointMake(scrollView.contentOffset.x, -scrollView.contentInset.top) animated:YES];

        } else {
            [controller popToRootViewControllerAnimated:YES];
        }

        return NO;
    }

    return YES;
}

@end
