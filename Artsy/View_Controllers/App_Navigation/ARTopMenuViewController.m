#import "ARTopMenuViewController+DeveloperExtras.h"
#import "ARContentViewControllers.h"
#import "ARAppStatus.h"
#import "ArtsyEcho.h"

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
#import "ARNavigationTabButtonWithBadge.h"

#import "UIView+HitTestExpansion.h"
#import <objc/runtime.h>
#import "UIDevice-Hardware.h"
#import "Artsy-Swift.h"

#import <NPKeyboardLayoutGuide/NPKeyboardLayoutGuide.h>
#import <Artsy-UIButtons/ARButtonSubclasses.h>
#import <UIView+BooleanAnimations/UIView+BooleanAnimations.h>
#import <objc/runtime.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <FLKAutoLayout/UIViewController+FLKAutoLayout.h>
#import <ObjectiveSugar/ObjectiveSugar.h>

#import <Emission/ARHomeComponentViewController.h>
#import <Emission/ARInboxComponentViewController.h>
#import <Emission/ARFavoritesComponentViewController.h>
#import <Emission/ARMyProfileComponentViewController.h>
#import <Emission/ARMapContainerViewController.h>
#import <Emission/ARShowConsignmentsFlowViewController.h>
#import <Emission/ARBidFlowViewController.h>
#import <React/RCTScrollView.h>

static const CGFloat ARMenuButtonDimension = 50;

@interface ARTopMenuViewController () <ARTabViewDelegate>
@property (readwrite, nonatomic, strong) NSArray *constraintsForButtons;

@property (readwrite, nonatomic, assign) BOOL hidesToolbarMenu;

@property (readwrite, nonatomic, assign) NSInteger selectedTabIndex;
@property (readwrite, nonatomic, strong) NSLayoutConstraint *tabContentViewTopConstraint;
@property (readwrite, nonatomic, strong) NSLayoutConstraint *tabBottomConstraint;

@property (readwrite, nonatomic, strong) ARTopMenuNavigationDataSource *navigationDataSource;
@property (readwrite, nonatomic, strong) UIView *tabContainer;
@property (readwrite, nonatomic, strong) UIView *buttonContainer;

@property (readonly, nonatomic, strong) ArtsyEcho *echo;
@end

static ARTopMenuViewController *_sharedManager = nil;

@implementation ARTopMenuViewController

+ (ARTopMenuViewController *)sharedController
{
    if (_sharedManager == nil) {
        _sharedManager = [[self alloc] init];
    }
    return _sharedManager;
}

+ (void)teardownSharedInstance
{
    _sharedManager = nil;
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    _echo = [[ArtsyEcho alloc] init];

    self.view.backgroundColor = [UIColor whiteColor];
    self.selectedTabIndex = -1;

    self.navigationDataSource = _navigationDataSource ?: [[ARTopMenuNavigationDataSource alloc] init];

    // TODO: Turn into custom view?

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
    _tabContentView = tabContentView;
    [self.view addSubview:tabContentView];

    // Layout
    self.tabContentViewTopConstraint = [tabContentView alignTopEdgeWithView:self.view predicate:@"0"];
    [tabContentView alignLeading:@"0" trailing:@"0" toView:self.view];
    [tabContentView constrainWidthToView:self.view predicate:@"0"];
    [tabContentView constrainBottomSpaceToView:self.tabContainer predicate:@"0"];

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

    UIView *separator = [[UIView alloc] init];
    [separator constrainHeight:@"1"];
    UIColor *color = [AROptions boolForOption:ARUseStagingDefault] ?
        [UIColor artsyPurpleRegular] :
        [UIColor artsyGrayRegular];
    separator.backgroundColor = color;
    [tabContainer addSubview:separator];
    [separator alignTopEdgeWithView:tabContainer predicate:@"0"];
    [separator constrainWidthToView:tabContainer predicate:@"0"];

    [self updateButtons];

    // Ensure it's created now and started listening for keyboard changes.
    // TODO Ideally this pod would start listening from launch of the app, so we don't need to rely on this one but can
    // be assured that any VCs guide can be trusted.
    (void)self.keyboardLayoutGuide;

    [self registerWithSwitchBoard:ARSwitchBoard.sharedInstance];

    if ([[NSUserDefaults standardUserDefaults] integerForKey:AROnboardingUserProgressionStage] == AROnboardingStageOnboarding) {
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

- (void)registerWithSwitchBoard:(ARSwitchBoard *)switchboard
{
    NSDictionary *menuToPaths = @{
        @(ARHomeTab) : @"/",
        @(ARMessagingTab) : @"/inbox",
        @(ARSearchTab) : @"/search",
        @(ARFavoritesTab) : @"/favorites",
        @(ARSalesTab) : @"/sales"
    };

    for (NSNumber *tabNum in menuToPaths.keyEnumerator) {
        [switchboard registerPathCallbackAtPath:menuToPaths[tabNum] callback:^id _Nullable(NSDictionary *_Nullable parameters) {

            NSString *messageCode = parameters[@"flash_message"];

            ARTopTabControllerTabType tabType = [tabNum integerValue];
            switch (tabType) {
                case ARHomeTab:
                    if (messageCode != nil) {
                        return [self homeWithMessageAlert:messageCode];
                    }
                    return [self rootNavigationControllerAtTab:tabType].rootViewController;
                default:
                    return [self rootNavigationControllerAtTab:tabType].rootViewController;
            }
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

- (ARNavigationController *)rootNavigationController;
{
    return (ARNavigationController *)[self.tabContentView currentNavigationController];
}

- (ARNavigationController *)rootNavigationControllerAtIndex:(NSInteger)index;
{
    ARTopTabControllerTabType tabType = [self.navigationDataSource tabTypeForIndex:index];
    return [self rootNavigationControllerAtTab:tabType];
}

- (ARNavigationController *)rootNavigationControllerAtTab:(ARTopTabControllerTabType)tab;
{
    return (ARNavigationController *)[self.navigationDataSource navigationControllerAtTab:tab];
}

- (NSInteger)indexOfRootViewController:(UIViewController *)viewController;
{
    NSInteger numberOfTabs = [self.navigationDataSource numberOfViewControllersForTabContentView:self.tabContentView];
    for (NSInteger index = 0; index < numberOfTabs; index++) {
        ARNavigationController *rootController = [self rootNavigationControllerAtIndex:index];

        if (rootController.rootViewController == viewController) {
            return index;
        } else if ([viewController isKindOfClass:ARFavoritesComponentViewController.class]) {
            return [self.navigationDataSource indexForTabType:ARFavoritesTab];
        } else if ([viewController isKindOfClass:ARInboxComponentViewController.class]) {
            return [self.navigationDataSource indexForTabType:ARMessagingTab];
        }
    }

    return NSNotFound;
}

#pragma mark - Buttons

- (ARNavigationTabButton *)tabButtonWithName:(NSString *)name accessibilityName:(NSString *)accessibilityName
{
    ARNavigationTabButtonWithBadge *button = [[ARNavigationTabButtonWithBadge alloc] init];
    button.accessibilityLabel = accessibilityName;
    button.icon = [[UIImage imageNamed:name] imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate];
    button.imageEdgeInsets = UIEdgeInsetsMake(13, 13, 13, 13);
    [button setTintColor:[UIColor blackColor]];
    [button ar_extendHitTestSizeByWidth:5 andHeight:5];
    return button;
}

- (NSArray *)buttons
{
    NSString *iconNameKey = @"iconName";
    NSString *accessibilityNameKey = @"accessiblityName";

    NSDictionary *tabButtonConfig = @{
        @(ARHomeTab) : @{ iconNameKey : @"nav_home", accessibilityNameKey : @"Home" },
        @(ARSearchTab) : @{ iconNameKey : @"nav_search", accessibilityNameKey : @"Search" },
        @(ARLocalDiscoveryTab) : @{ iconNameKey : @"nav_map", accessibilityNameKey : @"Local Discovery" },
        @(ARSalesTab) : @{ iconNameKey : @"nav_sales", accessibilityNameKey : @"Sales" },
        @(ARMessagingTab) : @{ iconNameKey : @"nav_messaging", accessibilityNameKey : @"Messages" },
        @(ARFavoritesTab) : @{ iconNameKey : @"nav_favs", accessibilityNameKey : @"Saved" },
    };

    NSArray *tabOrder = [self.navigationDataSource tabOrder];
    NSMutableArray *buttons = [NSMutableArray arrayWithCapacity:tabOrder.count];
    for (NSNumber *tab in tabOrder) {
        NSDictionary *tabConfig = tabButtonConfig[tab];
        ARNavigationTabButton *button = [self tabButtonWithName:tabConfig[iconNameKey] accessibilityName:tabConfig[accessibilityNameKey]];
        [buttons addObject:button];
    }

    return buttons;
}

- (void)updateButtons;
{
    NSArray *buttons = [self buttons];

    self.tabContentView.buttons = buttons;

    NSInteger homeIndex = [self.navigationDataSource indexForTabType:ARHomeTab];
    [self.tabContentView setCurrentViewIndex:homeIndex animated:NO];

    UIView *buttonContainer = self.buttonContainer;
    BOOL regularHorizontalSizeClass = self.traitCollection.horizontalSizeClass == UIUserInterfaceSizeClassRegular;

    for (ARNavigationTabButton *button in buttons) {
        [buttonContainer addSubview:button];
    }

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
}

- (void)setNotificationCount:(NSUInteger)number forControllerAtTab:(ARTopTabControllerTabType)tab;
{
    // TODO: See https://github.com/artsy/collector-experience/issues/661
    // [self.navigationDataSource setNotificationCount:number forControllerAtIndex:index];
    NSUInteger tabIndex = [self.navigationDataSource indexForTabType:tab];
    if (tabIndex != NSNotFound) {
        ARNavigationTabButtonWithBadge *button = self.tabContentView.buttons[tabIndex];
        button.badgeCount = number;
    }
}

- (CGFloat)bottomMargin
{
    return self.view.safeAreaInsets.bottom * -1;
}

#pragma mark - ARMenuAwareViewController

- (void)hideToolbar:(BOOL)hideToolbar animated:(BOOL)animated
{
    CGFloat bottomMargin = [self bottomMargin];
    CGFloat newConstant = hideToolbar ? CGRectGetHeight(self.tabContainer.frame) : bottomMargin;
    CGFloat oldConstant = self.tabBottomConstraint.constant;
    BOOL shouldChange = newConstant != oldConstant;
    if (!shouldChange) { return; }

    [UIView animateIf:animated duration:ARAnimationQuickDuration:^{
        self.tabBottomConstraint.constant = newConstant;

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
    if (!([[NSUserDefaults standardUserDefaults] integerForKey:AROnboardingUserProgressionStage] == AROnboardingStageOnboarding)) {
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
    return self.rootNavigationController;
}

- (UIViewController *)childViewControllerForStatusBarStyle
{
    return self.rootNavigationController;
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
        // iOS 13 introduced a new modal presentation style that are cards. They look cool!
        // But they break React Native's KeyboardAvoidingView, see this open PR: https://github.com/facebook/react-native/pull/27607
        // Once that PR is merged and we've upgraded, we can remove the following line
        // of code, which opts us out of the new modal presentation stylel.
        if ([UIDevice isPhone]) {
            viewController.modalPresentationStyle = UIModalPresentationFullScreen;
        } else {
            if ([viewController isKindOfClass:UINavigationController.class] && [[(UINavigationController *)viewController topViewController] isKindOfClass:ARBidFlowViewController.class]) {
                // Bid Flow gets form sheet
                viewController.modalPresentationStyle = UIModalPresentationFormSheet;
            } else if ([viewController isKindOfClass:UINavigationController.class] && [[(UINavigationController *)viewController topViewController] isKindOfClass:ARShowConsignmentsFlowViewController.class]) {
                // Consignments gets full screen
                viewController.modalPresentationStyle = UIModalPresentationFullScreen;
            }
        }
        [self presentViewController:viewController animated:animated completion:completion];
        return;
    }

    if ([viewController respondsToSelector:@selector(isRootNavViewController)] && [(id<ARRootViewController>)viewController isRootNavViewController]) {
        [self presentRootViewController:viewController animated:NO];
    } else {
        [self.rootNavigationController pushViewController:viewController animated:animated];
    }
}

- (void)presentRootViewControllerInTab:(ARTopTabControllerTabType)tabType animated:(BOOL)animated;
{
    NSInteger index = [self.navigationDataSource indexForTabType:tabType];
    if (index == NSNotFound) {
        return;
    }

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
    if (index == NSNotFound) {
        return;
    }

    NSInteger homeIndex = [self.navigationDataSource indexForTabType:ARHomeTab];
    ARTopTabControllerTabType tabType = [self.navigationDataSource tabTypeForIndex:index];

    // If there is an existing instance at that index, use it. Otherwise use the instance passed in as viewController.
    // If for some reason something went wrong, default to Home
    BOOL alreadySelectedTab = self.selectedTabIndex == index;
    switch (tabType) {
        case ARHomeTab:
        case ARMessagingTab:
        case ARLocalDiscoveryTab:
        case ARSearchTab:
        case ARSalesTab:
        case ARFavoritesTab:
            presentableController = [self rootNavigationControllerAtIndex:index];
            break;
        default:
            presentableController = [self rootNavigationControllerAtIndex:homeIndex];
    }

    if (presentableController.viewControllers.count > 1) {
        [presentableController popToRootViewControllerAnimated:(animated && alreadySelectedTab)];
    }

    /// If app is launching and hasn't yet set a tab, it's not ready to forceSet a view controller
    BOOL appIsLaunching = self.selectedTabIndex < 0;
    if (!alreadySelectedTab && !appIsLaunching) {
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

- (NSString *)descriptionForNavIndex:(NSInteger)index
{
    return [self.navigationDataSource analyticsDescriptionForTabAtIndex:index];
}

- (NSString *)selectedTabName
{
    return [self.navigationDataSource tabNameForIndex:self.selectedTabIndex];
}

- (BOOL)tabContentView:(ARTabContentView *)tabContentView shouldChangeToIndex:(NSInteger)index
{

    if (index == self.selectedTabIndex) {
        ARNavigationController *controller = (id)[tabContentView currentNavigationController];
        ARTopTabControllerTabType tabType = [self.navigationDataSource tabTypeForIndex:index];

        // If there's multiple VCs jump to the root
        if (controller.viewControllers.count > 1) {
            [controller popToRootViewControllerAnimated:YES];
        }

        // Otherwise find the first scrollview and pop to top
        else if (tabType == ARHomeTab ||
                 tabType == ARMessagingTab ||
                 tabType == ARFavoritesTab) {
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
    if ([rootView isKindOfClass:UIScrollView.class] && [(id)rootView scrollsToTop] && [(UIScrollView *)rootView contentOffset].y > 0) {
        return rootView;
    }

    for (UIView* childView in rootView.subviews) {
        NSObject* result = [self firstScrollToTopScrollViewFromRootView:childView];
        if (result) {
            return result;
        }
    }

    return nil;
}

- (void)showSearch
{
    [self presentRootViewControllerInTab:ARSearchTab animated:NO];
}

- (void)showFavs
{
    [self presentRootViewControllerInTab:ARFavoritesTab animated:NO];
}

#pragma mark - Email Confirmation

- (ARHomeComponentViewController *)homeWithMessageAlert:(NSString *)messageCode {
    ARNavigationController *rootNav = [self rootNavigationControllerAtTab:ARHomeTab];
    ARHomeComponentViewController *homeVC = (ARHomeComponentViewController *) rootNav.rootViewController;
    [homeVC showMessageAlertWithCode:messageCode];
    return homeVC;
}

@end
