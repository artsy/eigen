#import "ARContentViewControllers.h"
#import "ARAppStatus.h"

#import "UIViewController+FullScreenLoading.h"
#import "ARUserManager.h"
#import "ArtsyAPI+Private.h"
#import "ARAppConstants.h"
#import "ARAnalyticsConstants.h"
#import "ARFonts.h"
#import "User.h"
#import "ARAppNotificationsDelegate.h"

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


#import <Emission/ARMapContainerViewController.h>
#import <Emission/ARBidFlowViewController.h>
#import <Emission/AREmission.h>
#import <Emission/ARNotificationsManager.h>
#import <React/RCTScrollView.h>

//remove

static ARTopMenuViewController *_sharedManager = nil;

@implementation ARTopMenuViewController

+ (ARTopMenuViewController *)sharedController
{
    if (_sharedManager == nil) {
        _sharedManager = [[self alloc] init];
    }
    return _sharedManager;
}


- (instancetype)init {
    self = [super init];
    if (!self) {
        return self;
    }

    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    self.view.backgroundColor = [UIColor whiteColor];

//    self.navigationDataSource = _navigationDataSource ?: [[ARTopMenuNavigationDataSource alloc] init];
//
//    ARTabContentView *tabContentView = [[ARTabContentView alloc] initWithFrame:CGRectZero
//                                                            hostViewController:self
//                                                                      delegate:self
//                                                                    dataSource:self.navigationDataSource];

//    _tabContentView = tabContentView;
//    [self.view addSubview:tabContentView];
//    [tabContentView alignToView:self.view];


    // Ensure it's created now and started listening for keyboard changes.
    // TODO Ideally this pod would start listening from launch of the app, so we don't need to rely on this one but can
    // be assured that any VCs guide can be trusted.
    (void)self.keyboardLayoutGuide;

}


- (void)viewWillTransitionToSize:(CGSize)size withTransitionCoordinator:(id<UIViewControllerTransitionCoordinator>)coordinator
{
    [super viewWillTransitionToSize:size withTransitionCoordinator:coordinator];
    [self.view layoutSubviews];
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
}


#pragma mark - ARTabViewDelegate

- (void)tabContentView:(ARTabContentView *)tabContentView didChangeToTab:(NSString *)tabType
{
//    [[AREmission sharedInstance] updateState:@{[ARStateKey selectedTab]: tabType}];
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

@end
