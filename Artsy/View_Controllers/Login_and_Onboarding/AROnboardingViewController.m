#import "ARLogger.h"
#import "AROnboardingViewController.h"

#import "ARAppConstants.h"
#import "ARAppDelegate.h"
#import "ARDefaults.h"
#import "ARFonts.h"
#import "ARUserManager.h"
#import "AROnboardingTransition.h"
#import "AROnboardingViewControllers.h"
#import "ARNetworkConstants.h"

#import <FXBlurView/FXBlurView.h>

#import "ARPersonalizeViewController.h"
#import "ARAuthProviders.h"
#import "UIViewController+FullScreenLoading.h"
#import "AROnboardingMoreInfoViewController.h"
#import "ARPersonalizeWebViewController.h"
#import "ARParallaxEffect.h"
#import "NSString+StringCase.h"
#import "ArtsyAPI+Genes.h"
#import "ArtsyAPI+Private.h"
#import <ARAnalytics/ARAnalytics.h>
#import "ARAnalyticsConstants.h"
#import "ARSwitchBoard+Eigen.h"
#import "ARDispatchManager.h"
#import "ARFollowable.h"

#import "UIDevice-Hardware.h"

#import <UIView_BooleanAnimations/UIView+BooleanAnimations.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

//typedef NS_ENUM(NSInteger, AROnboardingStage) {
//    AROnboardingStageSlideshow,
//    AROnboardingStageStart,
//    AROnboardingStageChooseMethod,
//    AROnboardingStageEmailPassword,
//    AROnboardingStageCollectorStatus,
//    AROnboardingStageLocation,
//    AROnboardingStagePersonalize,
//    AROnboardingStageFollowNotification,
//    AROnboardingStagePriceRange,
//    AROnboardingStageNotes
//};


@interface AROnboardingViewController () <UINavigationControllerDelegate>
@property (nonatomic, assign, readwrite) AROnboardingStage state;
@property (nonatomic, assign) BOOL showBackgroundImage;
@property (nonatomic) UIImageView *backgroundView;
@property (nonatomic) UIScreenEdgePanGestureRecognizer *screenSwipeGesture;
@property (nonatomic) NSArray *genesForPersonalize;
@property (nonatomic, readonly, strong) UIImage *backgroundImage;
@property (nonatomic, strong, readwrite) NSLayoutConstraint *backgroundWidthConstraint;
@property (nonatomic, strong, readwrite) NSLayoutConstraint *backgroundHeightConstraint;
@property (nonatomic, strong, readwrite) NSMutableSet *followedItemsDuringOnboarding;
@end


@implementation AROnboardingViewController

- (instancetype)initWithState:(enum ARInitialOnboardingState)state
{
    self = [super init];
    if (!self) {
        return nil;
    }

    self.navigationBarHidden = YES;
    self.delegate = self;
    _followedItemsDuringOnboarding = [[NSMutableSet alloc] init];
    _initialState = state;
    switch (state) {
        case ARInitialOnboardingStateSlideShow:
            _state = AROnboardingStageSlideshow;
            break;

        case ARInitialOnboardingStateInApp:
            _state = AROnboardingStageChooseMethod;
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
    self.view.tintColor = [UIColor artsyPurpleRegular];


    self.screenSwipeGesture = [[UIScreenEdgePanGestureRecognizer alloc] initWithTarget:self action:@selector(edgeSwiped:)];
    self.screenSwipeGesture.edges = UIRectEdgeLeft;
    [self.view addGestureRecognizer:self.screenSwipeGesture];

    __weak typeof(self) wself = self;

    [ArtsyAPI getXappTokenWithCompletion:^(NSString *xappToken, NSDate *expirationDate) {
        [ArtsyAPI getPersonalizeGenesWithSuccess:^(NSArray *genes) {
            __strong typeof (wself) sself = wself;
            sself.genesForPersonalize = genes;
        } failure:^(NSError *error) {
            ARErrorLog(@"Couldn't get personalize genes. Error: %@", error.localizedDescription);
        }];
    }];

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(didBecomeActive)
                                                 name:UIApplicationDidBecomeActiveNotification
                                               object:nil];
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations
{
    return [UIDevice isPad] ? UIInterfaceOrientationMaskAll : UIInterfaceOrientationMaskPortrait;
}

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIApplicationDidBecomeActiveNotification object:nil];
}

- (void)didBecomeActive
{
    // If you've cancelled a twitter request we're currently showing the loader
    // add a delay so the user gets that they were doing something as they were leaving.
    ar_dispatch_after(0.3, ^{
        [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];
    });
}

- (void)viewWillAppear:(BOOL)animated
{
    [[UIApplication sharedApplication] setStatusBarHidden:YES];

    [self createBackgroundImageView];

    if (self.state == AROnboardingStageSlideshow) {
        [self startSlideshow];
    }

    if (self.state == AROnboardingStageChooseMethod) {
        [self presentSignInForAlreadyActiveUsers];
    }

    [super viewWillAppear:animated];
}

// TODO On iOS 9 the status bar is shown *after* viewWillAppear: is called and I have not yet found a better place to
//      make sure it never shows. This way it is shown for a very short period, but that’s better than nothing.
- (void)viewDidAppear:(BOOL)animated;
{
    [[UIApplication sharedApplication] setStatusBarHidden:YES];
    [super viewDidAppear:animated];
}

#pragma mark -
#pragma mark Slideshow

- (void)startSlideshow
{
    NSMutableArray *slides = [NSMutableArray array];
    NSInteger numberOfImages = [UIDevice isPad] ? 5 : 4;
    for (int i = 1; i <= numberOfImages; i++) {
        NSString *file = [NSString stringWithFormat:@"splash_%d.jpg", i];
        UIImage *image = [UIImage imageNamed:file];
        [slides addObject:image];
    }

    ARSlideshowViewController *slideshow = [[ARSlideshowViewController alloc] initWithSlides:slides];
    slideshow.delegate = self;
    [self pushViewController:slideshow animated:NO];
}

- (void)slideshowDone
{
    ARSignUpSplashViewController *splash = [[ARSignUpSplashViewController alloc] init];
    splash.delegate = self;
    splash.onboardingViewController = self;
    self.viewControllers = @[ splash ];
    self.state = AROnboardingStageStart;
}

- (void)presentSignInForAlreadyActiveUsers
{
    ARSignUpActiveUserViewController *splash = [[ARSignUpActiveUserViewController alloc] init];
    [splash setTrialContext:self.trialContext];
    splash.delegate = self;
    [self pushViewController:splash animated:YES];

    self.state = AROnboardingStageChooseMethod;
}

#pragma mark -
#pragma mark Signup splash

- (void)splashDoneWithLogin:(ARSignUpSplashViewController *)sender
{
    [self logInWithEmail:nil];
}

- (void)splashDone:(ARSignUpSplashViewController *)sender
{
    [self presentOnboarding];
}

#pragma mark -
#pragma mark Signup

- (void)signUp
{
    ARCreateAccountViewController *createVC = [[ARCreateAccountViewController alloc] init];
    createVC.delegate = self;
    [self pushViewController:createVC animated:YES];
    self.state = AROnboardingStageSignUp;
}

- (void)presentOnboarding
{
    [UIView animateWithDuration:ARAnimationQuickDuration animations:^{
        self.backgroundView.alpha = 0;
    }];
    [self presentPersonalizationQuestionnaires];
}

- (void)didSignUpAndLogin
{
    [self dismissOnboardingWithVoidAnimation:YES];
}

#pragma mark -
#pragma mark Personalize level

- (BOOL)prefersStatusBarHidden
{
    return YES;
}

- (void)presentPersonalizationQuestionnaires
{
    //    if ([[NSUserDefaults standardUserDefaults] boolForKey:AROnboardingSkipPersonalizeDefault]) {
    //        [self personalizeDone];
    //        return;
    //    }

    self.state = AROnboardingStagePersonalizeArtists;
    ARPersonalizeViewController *personalize = [[ARPersonalizeViewController alloc] initWithGenes:self.genesForPersonalize forStage:self.state];
    personalize.delegate = self;
    [self pushViewController:personalize animated:YES];
}

- (void)presentPersonalizeCategories
{
    self.state = AROnboardingStagePersonalizeCategories;
    ARPersonalizeViewController *personalize = [[ARPersonalizeViewController alloc] initWithGenes:self.genesForPersonalize forStage:self.state];
    personalize.delegate = self;
    [self pushViewController:personalize animated:YES];
}

- (void)presentPersonalizeBudget
{
    self.state = AROnboardingStagePersonalizeBudget;
    ARPersonalizeViewController *personalize = [[ARPersonalizeViewController alloc] initWithGenes:self.genesForPersonalize forStage:self.state];
    personalize.delegate = self;
    [self pushViewController:personalize animated:YES];
}

- (void)personalizeArtistsDone
{
    BOOL chooseEnoughArtists = self.followedItemsDuringOnboarding.count > 3;

    if (chooseEnoughArtists) {
        [self presentPersonalizeBudget];
    } else {
        [self presentPersonalizeCategories];
    }
}

- (void)personalizeCategoriesDone
{
    [self presentPersonalizeBudget];
}

- (void)personalizeBudgetDone
{
    [self signUp];
}

- (void)backTapped
{
    [self popViewControllerAnimated:YES];
}

- (void)followableItemFollowed:(id<ARFollowable>)item
{
    [self.followedItemsDuringOnboarding addObject:item];
}

- (void)setPriceRangeDone:(NSInteger)range
{
    NSString *stringRange = [NSString stringWithFormat:@"%@", @(range)];
    [ARAnalytics setUserProperty:ARAnalyticsPriceRangeProperty toValue:stringRange];

    User *user = [User currentUser];
    user.priceRange = stringRange;

    [user setRemoteUpdatePriceRange:range success:nil failure:^(NSError *error) {
        ARErrorLog(@"Error updating price range");
    }];

    [self dismissOnboardingWithVoidAnimation:YES];
}

- (void)resetBackgroundImageView:(BOOL)animated completion:(void (^)(void))completion
{
    self.backgroundWidthConstraint.constant = 0;
    self.backgroundHeightConstraint.constant = 0;
    __weak typeof(self) wself = self;
    [UIView animateIf:animated duration:ARAnimationQuickDuration:^{
        __strong typeof (wself) sself = wself;
        [sself.backgroundView layoutIfNeeded];
        sself.backgroundView.alpha = 1;
        sself.backgroundView.backgroundColor = [UIColor clearColor];
    } completion:^(BOOL finished) {
        self.backgroundView.image = self.backgroundImage;
        if (completion != nil) { completion(); };
    }];
}

- (void)dismissOnboardingWithVoidAnimation:(BOOL)createdAccount;
{
    [self dismissOnboardingWithVoidAnimation:createdAccount didCancel:NO];
}

- (void)dismissOnboardingWithVoidAnimation:(BOOL)createdAccount didCancel:(BOOL)cancelledSignIn;
{
    // send them off into the app

    if (createdAccount) {
        [[ARAppDelegate sharedInstance] finishOnboardingAnimated:createdAccount didCancel:cancelledSignIn];
    } else {
        [self resetBackgroundImageView:YES completion:^{
            self.modalTransitionStyle = UIModalTransitionStyleCrossDissolve;
            [[ARAppDelegate sharedInstance] finishOnboardingAnimated:createdAccount didCancel:cancelledSignIn];
        }];
    }
}

- (void)showTermsAndConditions
{
    AROnboardingWebViewController *webViewController = [[AROnboardingWebViewController alloc] initWithMobileArtsyPath:@"terms"];
    [self pushViewController:webViewController animated:YES];
}

- (void)showPrivacyPolicy
{
    AROnboardingWebViewController *webViewController = [[AROnboardingWebViewController alloc] initWithMobileArtsyPath:@"privacy"];
    [self pushViewController:webViewController animated:YES];
}


- (void)signUpWithFacebook
{
    __weak typeof(self) wself = self;
    [self ar_presentIndeterminateLoadingIndicatorAnimated:YES];
    [ARAuthProviders getTokenForFacebook:^(NSString *token, NSString *email, NSString *name) {
        __strong typeof (wself) sself = wself;

        AROnboardingMoreInfoViewController *more = [[AROnboardingMoreInfoViewController alloc] initForFacebookWithToken:token email:email name:name];
        more.delegate = self;
        [sself ar_removeIndeterminateLoadingIndicatorAnimated:YES];
        [sself pushViewController:more animated:YES];

    } failure:^(NSError *error) {
        __strong typeof (wself) sself = wself;

        [sself ar_removeIndeterminateLoadingIndicatorAnimated:YES];

        NSString * reason = error.userInfo[@"com.facebook.sdk:ErrorLoginFailedReason"];
        if (![reason isEqualToString:@"com.facebook.sdk:UserLoginCancelled"]) {
            [sself fbError];
        }
    }];
}

- (void)fbError
{
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Couldn’t get Facebook credentials"
                                                    message:@"Couldn’t get Facebook credentials. Please link a Facebook account in the settings app. If you continue having trouble, please email Artsy support at support@artsy.net"
                                                   delegate:self
                                          cancelButtonTitle:@"OK"
                                          otherButtonTitles:nil];
    [alert show];
}

- (void)twitterError
{
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Couldn’t get Twitter credentials"
                                                    message:@"Couldn’t get Twitter credentials. Please link a Twitter account in the settings app. If you continue having trouble, please email Artsy support at support@artsy.net"
                                                   delegate:self
                                          cancelButtonTitle:@"OK"
                                          otherButtonTitles:nil];
    [alert show];
}


- (void)logInWithEmail:(NSString *)email
{
    ARLoginViewController *loginViewController = [[ARLoginViewController alloc] initWithEmail:email];
    //        ARCreateAccountViewController *loginViewController = [[ARCreateAccountViewController alloc] init];
    loginViewController.delegate = self;

    [self pushViewController:loginViewController animated:YES];
    self.state = AROnboardingStageLogin;
}

- (UIViewController *)popViewControllerAnimated:(BOOL)animated
{
    UIViewController *poppedVC = [super popViewControllerAnimated:animated];
    UIViewController *topVC = self.topViewController;
    if (topVC == [self.viewControllers objectAtIndex:0] && [topVC isKindOfClass:ARSignUpSplashViewController.class]) {
        [self resetBackgroundImageView:animated completion:nil];
    }
    return poppedVC;
}

- (void)createBackgroundImageView
{
    [self.backgroundView removeFromSuperview];
    self.backgroundView = [[UIImageView alloc] initWithFrame:CGRectZero];
    self.backgroundView.contentMode = UIViewContentModeScaleAspectFill;
    [self.view insertSubview:self.backgroundView atIndex:0];
    self.backgroundWidthConstraint = [self.backgroundView constrainWidthToView:self.view predicate:@"0"];
    self.backgroundHeightConstraint = [self.backgroundView constrainHeightToView:self.view predicate:@"0"];
    [self.backgroundView alignCenterWithView:self.view];
    [self.backgroundView layoutIfNeeded];
}

#pragma mark -
#pragma mark Navigation Delegate

- (void)navigationController:(UINavigationController *)navigationController didShowViewController:(UIViewController *)viewController animated:(BOOL)animated
{
    NSString *viewIdentifier = [NSString humanReadableStringFromClass:[viewController class]];
    if (viewIdentifier) [ARAnalytics pageView:viewIdentifier];
}

- (id<UIViewControllerAnimatedTransitioning>)navigationController:(UINavigationController *)navigationController
                                  animationControllerForOperation:(UINavigationControllerOperation)operation
                                               fromViewController:(UIViewController *)fromVC
                                                 toViewController:(UIViewController *)toVC
{
    AROnboardingTransition *transition = [[AROnboardingTransition alloc] init];
    transition.operationType = operation;
    return transition;
}

- (BOOL)shouldAutorotate
{
    return [UIDevice isPad];
}

- (void)edgeSwiped:(UIScreenEdgePanGestureRecognizer *)gesture
{
    if (gesture.state == UIGestureRecognizerStateCancelled) {
        gesture.enabled = YES;
    }

    if (gesture.state == UIGestureRecognizerStateBegan) {
        // Don't let people get to the slideshow
        if (self.viewControllers.count > 1) {
            [self popViewControllerAnimated:YES];
        }
        gesture.enabled = NO;
    }
}

- (NSString *)onboardingConfigurationString
{
    NSMutableString *configuration = [[NSMutableString alloc] init];
    NSArray *keys = @[ AROnboardingSkipCollectorLevelDefault,
                       AROnboardingSkipPersonalizeDefault,
                       AROnboardingSkipPriceRangeDefault ];
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    for (NSString *key in keys) {
        [configuration appendString:[defaults boolForKey:key] ? @"n" : @"y"];
    }
    return configuration;
}

@end
