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
#import "ARAppNotificationsDelegate.h"
#import "ARRootViewController.h"

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

#import <Emission/ARHomeComponentViewController.h>
#import <Emission/ARWorksForYouComponentViewController.h>
#import <React/RCTScrollView.h>

static const CGFloat ARMenuButtonDimension = 50;


@interface ARTopMenuViewController () <ARTabViewDelegate>
@property (readwrite, nonatomic, strong) NSArray *constraintsForButtons;

@property (readwrite, nonatomic, assign) BOOL hidesToolbarMenu;

@property (readwrite, nonatomic, assign) enum ARTopTabControllerIndex selectedTabIndex;
@property (readwrite, nonatomic, strong) NSLayoutConstraint *tabBottomConstraint;

@property (readwrite, nonatomic, strong) ARTopMenuNavigationDataSource *navigationDataSource;
@property (readwrite, nonatomic, strong) UIView *tabContainer;
@property (readwrite, nonatomic, strong) UIView *buttonContainer;
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

    self.view.backgroundColor = [UIColor whiteColor];
    self.selectedTabIndex = -1;

    self.navigationDataSource = _navigationDataSource ?: [[ARTopMenuNavigationDataSource alloc] init];

    // TODO: Turn into custom view?

    NSArray *buttons = [self buttons];

    UIView *tabContainer = [[UIView alloc] init];
    self.tabContainer = tabContainer;
    self.tabContainer.backgroundColor = [UIColor whiteColor];
    [self.view addSubview:tabContainer];

    UIView *buttonContainer = [[UIView alloc] init];
    self.buttonContainer = buttonContainer;
    self.buttonContainer.backgroundColor = [UIColor whiteColor];
    [self.tabContainer addSubview:buttonContainer];

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

    [buttonContainer constrainHeight:@(ARMenuButtonDimension).stringValue];
    [buttonContainer alignBottomEdgeWithView:self.tabContainer predicate:@"0"];

    BOOL regularHorizontalSizeClass = self.traitCollection.horizontalSizeClass == UIUserInterfaceSizeClassRegular;

    if (regularHorizontalSizeClass) {
        [buttonContainer alignCenterXWithView:tabContainer predicate:@"0"];
    } else {
        [buttonContainer alignLeading:@"0" trailing:@"0" toView:self.tabContainer];
    }

    for (ARNavigationTabButton *button in buttons) {
        [buttonContainer addSubview:button];
    }

    UIView *separator = [[UIView alloc] init];
    [separator constrainHeight:@"1"];
    separator.backgroundColor = [UIColor artsyGrayRegular];
    [tabContainer addSubview:separator];
    [separator alignTopEdgeWithView:tabContainer predicate:@"0"];
    [separator constrainWidthToView:tabContainer predicate:@"0"];

    NSMutableArray *constraintsForButtons = [NSMutableArray array];
    [buttons eachWithIndex:^(UIButton *button, NSUInteger index) {
        [button alignCenterYWithView:buttonContainer predicate:@"0"];
        
        NSString *marginToContainerEdges = regularHorizontalSizeClass ? @"0" : @"20";
        NSString *marginBetweenButtons = regularHorizontalSizeClass ? @"100" : @"0";
        if (index == 0) {
            [button alignLeadingEdgeWithView:buttonContainer predicate:marginToContainerEdges];
        } else {
            [constraintsForButtons addObject:[button constrainLeadingSpaceToView:buttons[index - 1] predicate:marginBetweenButtons]];
        }
        
        if (index == buttons.count - 1 && !regularHorizontalSizeClass) {
            [buttonContainer alignTrailingEdgeWithView:button predicate:@"20"];
        }
    }];
    self.constraintsForButtons = [constraintsForButtons copy];

    // Ensure it's created now and started listening for keyboard changes.
    // TODO Ideally this pod would start listening from launch of the app, so we don't need to rely on this one but can
    // be assured that any VCs guide can be trusted.
    (void)self.keyboardLayoutGuide;

    [self registerWithSwitchBoard:ARSwitchBoard.sharedInstance];
    
    if ([[NSUserDefaults standardUserDefaults] integerForKey:AROnboardingUserProgressionStage] == AROnboardingStageOnboarding)  {
        [self fadeInFromOnboarding];
    }
}

- (void)fadeInFromOnboarding
{
    UIView *done = [[UIView alloc] init];
    done.backgroundColor = [UIColor blackColor];

    UIImageView *spinner = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"onboardingspinner"]];

    UILabel *label = [[UILabel alloc] init];
    label.text = @"Personalizing your Artsy experience";
    label.font = [UIFont serifFontWithSize:20.0];
    label.textColor = [UIColor whiteColor];
    label.textAlignment = NSTextAlignmentCenter;

    [done addSubview:spinner];
    [done addSubview:label];
    [self.view addSubview:done];

    [done alignTop:@"0" leading:@"0" bottom:@"0" trailing:@"0" toView:self.view];
    [spinner alignCenterXWithView:done predicate:@"0"];
    [spinner alignCenterYWithView:done predicate:@"-50"];
    [spinner constrainWidth:@"100" height:@"100"];
    [label constrainTopSpaceToView:spinner predicate:@"20"];
    [label alignCenterXWithView:done predicate:@"0"];
    [label constrainWidthToView:done predicate:@"0"];
    [label constrainHeight:@"100"];
    [spinner ar_startSpinningIndefinitely];

    done.alpha = 0.95;

    [UIView animateWithDuration:0.4 delay:0.3 options:UIViewAnimationOptionCurveEaseInOut animations:^{
        done.alpha = 1;
    } completion:^(BOOL finished) {
        [UIView animateWithDuration:1.2 delay:1.2 options:UIViewAnimationOptionCurveEaseInOut animations:^{
            spinner.alpha = 0;
            label.alpha = 0;
            done.alpha = 0;
        } completion:^(BOOL finished) {
            [done removeFromSuperview];
            [[NSUserDefaults standardUserDefaults] setInteger:AROnboardingStageOnboarded forKey:AROnboardingUserProgressionStage];
            ARAppNotificationsDelegate *remoteNotificationsDelegate = [[JSDecoupledAppDelegate sharedAppDelegate] remoteNotificationsDelegate];
            [remoteNotificationsDelegate registerForDeviceNotificationsWithContext:ARAppNotificationsRequestContextOnboarding];
        }];
    }];
}

- (NSArray *)buttons
{
    ARNavigationTabButton *homeButton = [[ARNavigationTabButton alloc] init];
    ARNavigationTabButton *browseButton = [[ARNavigationTabButton alloc] init];
    ARNavigationTabButton *favoritesButton = [[ARNavigationTabButton alloc] init];
    ARNavigationTabButton *notificationsButton = [[ARNavigationTabButton alloc] init];
    ARNavigationTabButton *searchButton = [[ARNavigationTabButton alloc] init];
    notificationsButton.tag = ARNavButtonNotificationsTag;

    searchButton.accessibilityLabel = @"Search";
    [searchButton setImage:[[UIImage imageNamed:@"SearchButton"] imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate] forState:UIControlStateNormal];
    [searchButton setImage:[[UIImage imageNamed:@"SearchButton"] imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate] forState:UIControlStateSelected];
    [searchButton.imageView constrainWidth:@"15" height:@"15"];
    [searchButton setTintColor:[UIColor blackColor]];

    [homeButton setTitle:@"HOME" forState:UIControlStateNormal];
    [browseButton setTitle:@"EXPLORE" forState:UIControlStateNormal];
    [favoritesButton setTitle:@"YOU" forState:UIControlStateNormal];

    notificationsButton.accessibilityLabel = @"Notifications";
    [notificationsButton setImage:[[UIImage imageNamed:@"NotificationsButton"] imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate] forState:UIControlStateNormal];
    [notificationsButton setImage:[[UIImage imageNamed:@"NotificationsButton"] imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate] forState:UIControlStateSelected];
    [notificationsButton.imageView constrainWidth:@"12" height:@"14"];
    [notificationsButton setTintColor:[UIColor blackColor]];

    [favoritesButton ar_extendHitTestSizeByWidth:5 andHeight:0];
    [notificationsButton ar_extendHitTestSizeByWidth:10 andHeight:0];

    return @[ searchButton, homeButton, browseButton, favoritesButton, notificationsButton ];
}

- (void)registerWithSwitchBoard:(ARSwitchBoard *)switchboard
{
    NSDictionary *menuToPaths = @{
        @(ARTopTabControllerIndexFeed) : @"/",
        @(ARTopTabControllerIndexBrowse) : @"/browse",
        @(ARTopTabControllerIndexFavorites) : @"/favorites",
        @(ARTopTabControllerIndexNotifications) : @"/works-for-you",
    };

    for (NSNumber *tabIndex in menuToPaths.keyEnumerator) {
        [switchboard registerPathCallbackAtPath:menuToPaths[tabIndex] callback:^id _Nullable(NSDictionary *_Nullable parameters) {
            return [self rootNavigationControllerAtIndex:tabIndex.integerValue parameters:parameters].rootViewController;
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
    __block CGFloat buttonsWidth = 0;
    [buttons eachWithIndex:^(UIButton *button, NSUInteger index) {
        buttonsWidth += button.intrinsicContentSize.width;
    }];

    if (self.traitCollection.horizontalSizeClass == UIUserInterfaceSizeClassRegular) {
        CGFloat totalMarginWidth = 100 * (buttons.count - 1);
        CGFloat buttonContainerWidth = buttonsWidth + totalMarginWidth;
        [self.buttonContainer constrainWidth:[NSString stringWithFormat:@"%f", buttonContainerWidth]];
        return;
    }

    CGFloat viewWidth = self.view.frame.size.width;
    CGFloat extraWidth = viewWidth - buttonsWidth - 40;
    CGFloat eachMargin = floorf(extraWidth / (self.tabContentView.buttons.count - 1));

    [self.constraintsForButtons eachWithIndex:^(NSLayoutConstraint *constraint, NSUInteger index) {
        CGFloat margin = eachMargin;
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
    return (ARNavigationController *)[self rootNavigationControllerAtIndex:index parameters:nil];
}

- (ARNavigationController *)rootNavigationControllerAtIndex:(NSInteger)index parameters:(NSDictionary *)params;
{
    return (ARNavigationController *)[self.navigationDataSource navigationControllerAtIndex:index parameters:params];
}


- (NSInteger)indexOfRootViewController:(UIViewController *)viewController;
{
    NSInteger numberOfTabs = [self.navigationDataSource numberOfViewControllersForTabContentView:self.tabContentView];
    for (NSInteger index = 0; index < numberOfTabs; index++) {
        ARNavigationController *rootController = [self rootNavigationControllerAtIndex:index];
        if (rootController.rootViewController == viewController) {
            return index;
        } else if ([viewController isKindOfClass:ARFavoritesViewController.class]) {
            return ARTopTabControllerIndexFavorites;
        } else if ([viewController isKindOfClass:ARWorksForYouComponentViewController.class]) {
            return ARTopTabControllerIndexNotifications;
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
        badgeView.badgeBackgroundColor = [UIColor artsyRedRegular];
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
    
    // Essentially the else part of the check in viewDidLoad
    // If not coming from a new account (with animation), then prompt for push on the usual constraints
    if (!([[NSUserDefaults standardUserDefaults] integerForKey:AROnboardingUserProgressionStage] == AROnboardingStageOnboarding))  {
        ARAppNotificationsDelegate *remoteNotificationsDelegate = [[JSDecoupledAppDelegate sharedAppDelegate] remoteNotificationsDelegate];
        [remoteNotificationsDelegate registerForDeviceNotificationsWithContext:ARAppNotificationsRequestContextOnboarding];
    }

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

- (UIViewController *)childViewControllerForStatusBarHidden
{
    return self.visibleViewController;
}

- (UIViewController *)childViewControllerForStatusBarStyle
{
    return self.visibleViewController;
}

// TODO: Are these two functions needed, given we override the functions above?
- (BOOL)prefersStatusBarHidden
{
    return self.childViewControllerForStatusBarHidden.prefersStatusBarHidden;
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
    return self.childViewControllerForStatusBarStyle.preferredStatusBarStyle;
}

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
    NSArray *modalClasses = @[ UINavigationController.class, UISplitViewController.class, LiveAuctionViewController.class ];
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

    if ([viewController respondsToSelector:@selector(isRootViewController)] && [(id<ARRootViewController>)viewController isRootViewController]) {
        [self presentRootViewController:viewController animated:animated];
    } else {
        [self.rootNavigationController pushViewController:viewController animated:animated];
    }
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


- (void)presentRootViewController:(UIViewController *)viewController animated:(BOOL)animated;
{
    ARNavigationController *presentableController;
    
    NSInteger index = [self indexOfRootViewController:viewController];
    
    // If there is an existing instance at that index, use it. Otherwise use the instance passed in as viewController.
    // If for some reason something went wrong, default to Home
    BOOL alreadySelectedTab = self.selectedTabIndex == index;
    
    switch (index) {
        case ARTopTabControllerIndexFeed:
        case ARTopTabControllerIndexBrowse:
            presentableController = [self rootNavigationControllerAtIndex:index];
            break;
        case ARTopTabControllerIndexFavorites:
        case ARTopTabControllerIndexNotifications:
            presentableController = [[ARNavigationController alloc] initWithRootViewController:viewController];
            
            // Setting alreadySelectedTab to NO so the notification (Works for you) view controller gets presented even though
            // the tab index hasn't changed. animated is to NO since we're transitioning to the same VC
            alreadySelectedTab = NO;
            animated = NO;
            break;
        default:
            presentableController = [self rootNavigationControllerAtIndex:ARTopTabControllerIndexFeed];
    }
    
    if (presentableController.viewControllers.count > 1) {
        [presentableController popToRootViewControllerAnimated:(animated && alreadySelectedTab)];
    }
    
    if (!alreadySelectedTab) {
        [self.tabContentView forceSetViewController:presentableController atIndex:index animated:animated];
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

        // If there's multiple VCs jump to the root
        if (controller.viewControllers.count > 1) {
            [controller popToRootViewControllerAnimated:YES];
        }

        // Otherwise find the first scrollview and pop to top
        else if (index == ARTopTabControllerIndexFeed ||
                 index == ARTopTabControllerIndexBrowse ||
                 index == ARTopTabControllerIndexFavorites) {
            UIViewController *currentRootViewController = [controller.childViewControllers first];
            UIScrollView *rootScrollView = (id)[self firstScrollToTopScrollViewFromRootView:currentRootViewController.view];
            [rootScrollView setContentOffset:CGPointMake(rootScrollView.contentOffset.x, -rootScrollView.contentInset.top) animated:YES];
        }

        return NO;
    }

    return YES;
}

- (NSObject *_Nullable)firstScrollToTopScrollViewFromRootView:(UIView *)initialView
{
    UIView *rootView = initialView;
    while (rootView.subviews.firstObject && (![rootView isKindOfClass:UIScrollView.class] || ![(id)rootView scrollsToTop])) {
        rootView = rootView.subviews.firstObject;
    }
    return ([rootView isKindOfClass:UIScrollView.class] && [(id)rootView scrollsToTop]) ? rootView : nil;
}

@end
