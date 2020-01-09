#import "ARTopMenuViewController+DeveloperExtras.h"
#import "ARContentViewControllers.h"
#import "ARAppStatus.h"
#import "ArtsyEcho+LocalDisco.h"

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

#import <NPKeyboardLayoutGuide/NPKeyboardLayoutGuide.h>
#import <Artsy-UIButtons/ARButtonSubclasses.h>
#import <UIView+BooleanAnimations/UIView+BooleanAnimations.h>
#import <objc/runtime.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <FLKAutoLayout/UIViewController+FLKAutoLayout.h>
#import <ObjectiveSugar/ObjectiveSugar.h>

#import <Emission/ARHomeComponentViewController.h>
#import <Emission/ARInboxComponentViewController.h>
#import <Emission/ARWorksForYouComponentViewController.h>
#import <Emission/ARFavoritesComponentViewController.h>
#import <Emission/ARMapContainerViewController.h>
#import <React/RCTScrollView.h>

static const CGFloat ARMenuButtonDimension = 50;

@interface ARNavigationTabButtonWithBadge : ARNavigationTabButton
@property (nonatomic, strong) UIImage *icon;
@end

@implementation ARNavigationTabButtonWithBadge

- (void)setup;
{
    [super setup];
    [self setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    [self setTitleColor:[UIColor whiteColor] forState:UIControlStateSelected];

    // TODO: Clears all on tap. This needs to get more sophisticated, as per
    // https://github.com/artsy/collector-experience/issues/661
    [self addTarget:self action:@selector(clearBadge) forControlEvents:UIControlEventTouchUpInside];
}

- (void)clearBadge;
{
    self.badgeCount = 0;
}

- (void)setBadgeCount:(NSUInteger)badgeCount;
{
    if (badgeCount) {
        [self setImage:nil forState:UIControlStateNormal];
        [self setImage:nil forState:UIControlStateSelected];
        [self setBackgroundImage:[self badgeBackgroundImageWithColor:[UIColor blackColor]] forState:UIControlStateNormal];
        [self setBackgroundImage:[self badgeBackgroundImageWithColor:[UIColor artsyPurpleRegular]] forState:UIControlStateSelected];
        [self setTitle:[NSString stringWithFormat:@"%lu", badgeCount] forState:UIControlStateNormal];
        [self setTitle:[NSString stringWithFormat:@"%lu", badgeCount] forState:UIControlStateSelected];
    } else {
        [self setImage:self.icon forState:UIControlStateNormal];
        [self setImage:self.icon forState:UIControlStateSelected];
        [self setBackgroundImage:nil forState:UIControlStateNormal];
        [self setBackgroundImage:nil forState:UIControlStateSelected];
        [self setTitle:nil forState:UIControlStateNormal];
        [self setTitle:nil forState:UIControlStateSelected];
    }
}

- (void)setIcon:(UIImage *)icon;
{
    _icon = icon;
    [self setImage:_icon forState:UIControlStateNormal];
    [self setImage:_icon forState:UIControlStateSelected];
}

- (UIImage *)badgeBackgroundImageWithColor:(UIColor *)color;
{
    CGSize size = self.bounds.size;
    CGSize circleSize = self.bounds.size;
    circleSize.width /= 2;
    circleSize.height /= 2;
    // We dont want to alter the size of the button so we need to only halve the ellipse size, the button will otherwise resize to the image we return
    UIGraphicsBeginImageContextWithOptions(size, NO, 0);
    [color setFill];
    CGContextFillEllipseInRect(UIGraphicsGetCurrentContext(), CGRectMake(circleSize.width / 2, circleSize.height / 2, circleSize.width, circleSize.height));
    UIImage *backgroundImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return backgroundImage;
}

@end


@interface ARTopMenuViewController () <ARTabViewDelegate>
@property (readwrite, nonatomic, strong) NSArray *constraintsForButtons;

@property (readwrite, nonatomic, assign) BOOL hidesToolbarMenu;

@property (nonatomic, strong) UIView *statusBarView;
@property (nonatomic, strong) NSLayoutConstraint *statusBarVerticalConstraint;

@property (readwrite, nonatomic, assign) enum ARTopTabControllerIndex selectedTabIndex;
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

    _statusBarView = [[UIView alloc] init];
    _statusBarView.backgroundColor = UIColor.blackColor;

    [self.view addSubview:_statusBarView];

    NSString *statusBarHeight = [NSString stringWithFormat:@"%@", @([self statusBarHeight])];
    _statusBarVerticalConstraint = [_statusBarView constrainHeight:statusBarHeight];
    [_statusBarView constrainWidthToView:self.view predicate:@"0"];
    [_statusBarView alignTopEdgeWithView:self.view predicate:@"0"];
    [_statusBarView alignLeadingEdgeWithView:self.view predicate:@"0"];

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

- (BOOL)isShowingStatusBar
{
    CGFloat fullHeight = [self statusBarHeight];
    CGFloat currentHeight = self.statusBarVerticalConstraint.constant;
    return fullHeight == currentHeight;
}

- (CGFloat)statusBarHeight
{
    return self.view.safeAreaInsets.top;
}

- (void)showStatusBarBackground:(BOOL)visible animated:(BOOL)animated white:(BOOL)isWhite
{
    CGFloat visibleAlpha = isWhite ? 0.98 : 1;

    [UIView animateIf:animated duration:ARAnimationDuration:^{
        self.statusBarView.backgroundColor = isWhite ? UIColor.whiteColor : UIColor.blackColor;
        self.statusBarView.alpha = visible ? visibleAlpha : 0;

        self.statusBarVerticalConstraint.constant = visible ? [self statusBarHeight] : 0;
        self.tabContentViewTopConstraint.constant = visible ? [self statusBarHeight] : 0;

        if (animated) { [self.view setNeedsLayout]; }
    }];
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
        @(ARTopTabControllerIndexHome) : @"/",
        @(ARTopTabControllerIndexMessaging) : @"/inbox",
        @(ARTopTabControllerIndexLocalDiscovery) : @"/local-discovery",
        @(ARTopTabControllerIndexFavorites) : @"/favorites",
        @(ARTopTabControllerIndexProfile) : @"/ios-settings", // A good argument is "user/edit", _but_ the app barely supports any of it's features
    };

    for (NSNumber *tabIndex in menuToPaths.keyEnumerator) {
        [switchboard registerPathCallbackAtPath:menuToPaths[tabIndex] callback:^id _Nullable(NSDictionary *_Nullable parameters) {
            return [self rootNavigationControllerAtIndex:tabIndex.integerValue parameters:parameters].rootViewController;
        }];
    }
    
    [switchboard registerPathCallbackAtPath:@"/works-for-you" callback:^id _Nullable(NSDictionary * _Nullable parameters) {
        return [self rootNavigationControllerHomeWithTab:ARHomeTabArtists].rootViewController;
    }];
    
    [switchboard registerPathCallbackAtPath:@"/auctions" callback:^id _Nullable(NSDictionary * _Nullable parameters) {
        return [self rootNavigationControllerHomeWithTab:ARHomeTabAuctions].rootViewController;
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
    return (ARNavigationController *)[self rootNavigationControllerAtIndex:index parameters:nil];
}

- (ARNavigationController *)rootNavigationControllerAtIndex:(NSInteger)index parameters:(NSDictionary *)params;
{
    return (ARNavigationController *)[self.navigationDataSource navigationControllerAtIndex:index parameters:params];
}

- (ARNavigationController *)rootNavigationControllerHomeWithTab:(ARHomeTabType)tab
{
    ARNavigationController *homeRootNavigationViewController = [self rootNavigationControllerAtIndex:ARTopTabControllerIndexHome];
    [(ARHomeComponentViewController *)homeRootNavigationViewController.rootViewController changeHomeTabTo:tab];
    return homeRootNavigationViewController;
}

- (NSInteger)indexOfRootViewController:(UIViewController *)viewController;
{
    NSInteger numberOfTabs = [self.navigationDataSource numberOfViewControllersForTabContentView:self.tabContentView];
    for (NSInteger index = 0; index < numberOfTabs; index++) {
        ARNavigationController *rootController = [self rootNavigationControllerAtIndex:index];

        if (rootController.rootViewController == viewController) {
            return index;
        } else if ([viewController isKindOfClass:ARFavoritesComponentViewController.class]) {
            return ARTopTabControllerIndexFavorites;
        } else if ([viewController isKindOfClass:ARInboxComponentViewController.class]) {
            return ARTopTabControllerIndexMessaging;
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
    if ([self.echo shouldShowLocalDiscovery]) {
        return @[
             [self tabButtonWithName:@"nav_home" accessibilityName:@"Home"],
             [self tabButtonWithName:@"nav_search" accessibilityName:@"Search"],
             [self tabButtonWithName:@"nav_map" accessibilityName:@"Local Discovery"],
             [self tabButtonWithName:@"nav_messaging" accessibilityName:@"Messages"],
             [self tabButtonWithName:@"nav_favs" accessibilityName:@"Saved"],
            ];
    }
    
    return @[
             [self tabButtonWithName:@"nav_home" accessibilityName:@"Home"],
             [self tabButtonWithName:@"nav_search" accessibilityName:@"Search"],
             [self tabButtonWithName:@"nav_messaging" accessibilityName:@"Messages"],
             [self tabButtonWithName:@"nav_favs" accessibilityName:@"Saved"],
             ];
}

- (void)updateButtons;
{
    NSArray *buttons = [self buttons];
    
    self.tabContentView.buttons = buttons;
    [self.tabContentView setCurrentViewIndex:ARTopTabControllerIndexHome animated:NO];
    
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

- (void)setNotificationCount:(NSUInteger)number forControllerAtIndex:(ARTopTabControllerIndex)index;
{
    // TODO: See https://github.com/artsy/collector-experience/issues/661
    // [self.navigationDataSource setNotificationCount:number forControllerAtIndex:index];
    ARNavigationTabButtonWithBadge *button = self.tabContentView.buttons[index];
    button.badgeCount = number;
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
        [self presentViewController:viewController animated:animated completion:completion];
        return;
    }
    
    if ([viewController respondsToSelector:@selector(isRootNavViewController)] && [(id<ARRootViewController>)viewController isRootNavViewController]) {
        [self presentRootViewController:viewController animated:NO];
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
    BOOL showWorksForYouWithSelectedArtistFromUniversalLink = [viewController isKindOfClass:ARHomeComponentViewController.class] && [(ARHomeComponentViewController *)viewController selectedArtist];
    switch (index) {
        case ARTopTabControllerIndexHome:
            if (showWorksForYouWithSelectedArtistFromUniversalLink) {
                NSString *selectedArtistID = [(ARHomeComponentViewController *)viewController selectedArtist];
                presentableController = [self.navigationDataSource navigationControllerAtIndex:ARTopTabControllerIndexHome parameters:@{@"artist_id": selectedArtistID}];
            } else if ([viewController isKindOfClass:ARHomeComponentViewController.class]) {
                // just show the home controller as passed in / intended, as it may have tab selections
                presentableController = (ARNavigationController *)viewController.navigationController;
            } else {
                presentableController = [self rootNavigationControllerAtIndex:index];
            }
            break;
        case ARTopTabControllerIndexMessaging:
            presentableController = [self rootNavigationControllerAtIndex:index];
            break;
        case ARTopTabControllerIndexLocalDiscovery:
            presentableController = [self rootNavigationControllerAtIndex:index];
            break;
        case ARTopTabControllerIndexFavorites:
            presentableController = [self rootNavigationControllerAtIndex:index];
            break;
        case ARTopTabControllerIndexProfile:
            presentableController = [[ARNavigationController alloc] initWithRootViewController:viewController];

            // Setting alreadySelectedTab to NO so the notification (Works for you) view controller gets presented even though
            // the tab index hasn't changed. animated is to NO since we're transitioning to the same VC
            alreadySelectedTab = NO;
            animated = NO;
            break;
        default:
            presentableController = [self rootNavigationControllerAtIndex:ARTopTabControllerIndexHome];
    }

    if (presentableController.viewControllers.count > 1) {
        [presentableController popToRootViewControllerAnimated:(animated && alreadySelectedTab)];
    }
    
    /// If app is launching and hasn't yet set a tab, it's not ready to forceSet a view controller
    BOOL appIsLaunching = self.selectedTabIndex < 0;
    if (!alreadySelectedTab && !appIsLaunching) {
        [self.tabContentView forceSetViewController:presentableController atIndex:index animated:animated];
    } else if (showWorksForYouWithSelectedArtistFromUniversalLink) {
        // We are already on Home, and need to force the tab view to show the new Home with its selected artist & without animation
        [self.tabContentView forceSetViewController:presentableController atIndex:ARTopTabControllerIndexHome animated:NO];
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
    if ([self.echo shouldShowLocalDiscovery]) {
        switch (index) {
            case 0:
                return @"home";
            case 1:
                return @"search";
            case 2:
                return @"cityGuide";
            case 3:
                return @"messages";
            case 4:
                return @"favorites";
            default:
                return @"unknown";
        }
    } else {
        switch (index) {
            case 0:
                return @"home";
            case 1:
                return @"search";
            case 2:
                return @"messages";
            case 3:
                return @"favorites";
            default:
                return @"unknown";
        }
    }
}

- (BOOL)tabContentView:(ARTabContentView *)tabContentView shouldChangeToIndex:(NSInteger)index
{

    if (index == self.selectedTabIndex) {
        ARNavigationController *controller = (id)[tabContentView currentNavigationController];

        // If there's multiple VCs jump to the root
        if (controller.viewControllers.count > 1) {
            [controller popToRootViewControllerAnimated:YES];
        }

        // Otherwise find the first scrollview and pop to top
        else if (index == ARTopTabControllerIndexHome ||
                 index == ARTopTabControllerIndexMessaging ||
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
