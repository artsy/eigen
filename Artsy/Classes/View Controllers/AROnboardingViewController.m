#import "AROnboardingViewController.h"

#import "ARAppDelegate.h"
#import "ARUserManager.h"

#import "AROnboardingTransition.h"
#import "AROnboardingViewControllers.h"
#import "ARNetworkConstants.h"

#import <FXBlurView/FXBlurView.h>

#import "ARPersonalizeViewController.h"
#import "ARAuthProviders.h"
#import "UIViewController+FullScreenLoading.h"
#import "AROnboardingMoreInfoViewController.h"
#import "ARParallaxEffect.h"
#import "NSString+StringCase.h"
#import "ArtsyAPI+Private.h"
#import <ARAnalytics/ARAnalytics.h>
#import "ARAnalyticsConstants.h"

typedef NS_ENUM(NSInteger, AROnboardingStage) {
    AROnboardingStageSlideshow,
    AROnboardingStageStart,
    AROnboardingStageChooseMethod,
    AROnboardingStageEmailPassword,
    AROnboardingStageCollectorStatus,
    AROnboardingStageLocation,
    AROnboardingStagePersonalize,
    AROnboardingStageFollowNotification,
    AROnboardingStagePriceRange,
    AROnboardingStageNotes
};

@interface AROnboardingViewController () <UINavigationControllerDelegate>
@property (nonatomic, assign) AROnboardingStage state;
@property (nonatomic, assign) BOOL showBackgroundImage;
@property (nonatomic) UIImageView *backgroundView;
@property (nonatomic) UIScreenEdgePanGestureRecognizer *screenSwipeGesture;
@property (nonatomic) NSArray *genesForPersonalize;
@property (nonatomic, readonly, strong) UIImage *backgroundImage;
@property (nonatomic, strong, readwrite) NSLayoutConstraint *backgroundWidthConstraint;
@property (nonatomic, strong, readwrite) NSLayoutConstraint *backgroundHeightConstraint;
@end


@implementation AROnboardingViewController

- (instancetype)initWithState:(enum ARInitialOnboardingState)state
{
    self = [super init];
    if (!self) { return nil; }

    self.navigationBarHidden = YES;
    self.delegate = self;
    switch (state) {
        case ARInitialOnboardingStateSlideShow:
            _state = AROnboardingStageSlideshow;
            break;

        case ARInitialOnboardingStateInApp:
            _state = AROnboardingStageChooseMethod;
    }
    return self;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor blackColor];
    self.view.tintColor = [UIColor artsyPurple];


    self.screenSwipeGesture = [[UIScreenEdgePanGestureRecognizer alloc]  initWithTarget:self action:@selector(edgeSwiped:)];
    self.screenSwipeGesture.edges = UIRectEdgeLeft;
    [self.view addGestureRecognizer:self.screenSwipeGesture];

    @weakify(self);

    [ArtsyAPI getXappTokenWithCompletion:^(NSString *xappToken, NSDate *expirationDate) {
        @strongify(self);

        @weakify(self);
        [ArtsyAPI getPersonalizeGenesWithSuccess:^(NSArray *genes) {
            @strongify(self);
            self.genesForPersonalize = genes;
        } failure:^(NSError *error) {
            ARErrorLog(@"Couldn't get personalize genes. Error: %@", error.localizedDescription);
        }];
    }];

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(didBecomeActive)
                                                 name:UIApplicationDidBecomeActiveNotification
                                               object:nil];


}

- (NSUInteger)supportedInterfaceOrientations
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
        [self getCurrentAppStateBlurredImage];
        [self presentSignInForAlreadyActiveUsers];
    }

    [super viewWillAppear:animated];
}

#pragma mark -
#pragma mark Slideshow

- (void)startSlideshow
{
    NSMutableArray *slides = [NSMutableArray array];
    NSInteger numberOfImages = [UIDevice isPad] ? 5 : 4;
    for (int i = 1; i <= numberOfImages ; i++) {
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
    self.viewControllers = @[splash];
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
    [self setBackgroundImage:sender.backgroundImage animated:YES];
    sender.backgroundImage = nil;

    [self logInWithEmail:nil];
}

- (void)splashDone:(ARSignUpSplashViewController *)sender
{
    [self setBackgroundImage:sender.backgroundImage animated:YES];
    sender.backgroundImage = nil;

    ARSignupViewController *signup = [[ARSignupViewController alloc] init];
    signup.delegate = self;
    [self pushViewController:signup animated:YES];
    self.state = AROnboardingStageChooseMethod;
}

#pragma mark -
#pragma mark Signup

- (void)signUpWithEmail
{
    ARCreateAccountViewController *createVC = [[ARCreateAccountViewController alloc] init];
    createVC.delegate = self;
    [self pushViewController:createVC animated:YES];
    self.state = AROnboardingStageEmailPassword;
}

- (void)signupDone
{
    if ([UIDevice isPad]) {
        [self presentWebOnboarding];
    } else {
        [UIView animateWithDuration:ARAnimationQuickDuration animations:^{
            self.backgroundView.alpha = 0;
        }];
        [self presentCollectorLevel];
    }
}


#pragma mark -
#pragma mark Web onboarding

- (void)presentWebOnboarding
{
    NSURL *url = [ARSwitchBoard.sharedInstance resolveRelativeUrl:ARPersonalizePath];
    ARPersonalizeWebViewController *viewController = [[ARPersonalizeWebViewController alloc] initWithURL:url];
    viewController.delegate = self;
    [self pushViewController:viewController animated:YES];
}

- (void)webOnboardingDone
{
    [self dismissOnboardingWithVoidAnimation:YES];
}

#pragma mark -
#pragma mark Collector level

- (void)presentCollectorLevel
{
    if ([[NSUserDefaults standardUserDefaults] boolForKey:AROnboardingSkipCollectorLevelDefault]) {
        [self presentPersonalize];
        return;
    }
    ARCollectorStatusViewController *status = [[ARCollectorStatusViewController alloc] init];
    status.delegate = self;
    [self pushViewController:status animated:YES];
    self.state = AROnboardingStageCollectorStatus;
}

- (BOOL)prefersStatusBarHidden
{
    return YES;
}

- (void)collectorLevelDone:(ARCollectorLevel)level
{
    User *user = [User currentUser];
    user.collectorLevel = level;

    NSString *collectorLevel = [ARCollectorStatusViewController stringFromCollectorLevel:level];
    [ARAnalytics setUserProperty:ARAnalyticsCollectorLevelProperty toValue:collectorLevel];

    [user setRemoteUpdateCollectorLevel:level success:nil failure:^(NSError *error) {
        ARErrorLog(@"Error updating collector level");
    }];

    [[ARUserManager sharedManager] storeUserData];
    [self presentPersonalize];
}

- (void)presentPersonalize
{
    if ([[NSUserDefaults standardUserDefaults] boolForKey:AROnboardingSkipPersonalizeDefault]) {
        [self personalizeDone];
        return;
    }

    ARPersonalizeViewController *personalize = [[ARPersonalizeViewController alloc] initWithGenes:self.genesForPersonalize];
    personalize.delegate = self;
    [self pushViewController:personalize animated:YES];
    self.state = AROnboardingStagePersonalize;
}

- (void)personalizeDone
{
    if ([User currentUser].collectorLevel == ARCollectorLevelNo) {
        // They're done
        [self dismissOnboardingWithVoidAnimation:YES];
    } else {
        [self presentPriceRange];
    }
}

- (void)presentPriceRange
{
    if ([[NSUserDefaults standardUserDefaults] boolForKey:AROnboardingSkipPriceRangeDefault]) {
        [self dismissOnboardingWithVoidAnimation:YES];
        return;
    }
    ARPriceRangeViewController *priceRange = [[ARPriceRangeViewController alloc] init];
    priceRange.delegate = self;
    [self pushViewController:priceRange animated:YES];
    self.state = AROnboardingStagePriceRange;
}

- (void)setPriceRangeDone:(NSInteger)range
{
    NSString *stringRange = [NSString stringWithFormat:@"%@", @(range)];
    [ARAnalytics setUserProperty:ARAnalyticsPriceRangeProperty toValue:stringRange];

    User *user = [User currentUser];
    user.priceRange = range;

    [user setRemoteUpdatePriceRange:range success:nil failure:^(NSError *error) {
        ARErrorLog(@"Error updating price range");
    }];

    [self dismissOnboardingWithVoidAnimation:YES];
}

-(void) resetBackgroundImageView:(BOOL)animated completion:(void (^)(void))completion
{
    self.backgroundWidthConstraint.constant = 0;
    self.backgroundHeightConstraint.constant = 0;
    @weakify(self);
    [UIView animateIf:animated duration:ARAnimationQuickDuration :^{
        @strongify(self);
        [self.backgroundView layoutIfNeeded];
        self.backgroundView.alpha = 1;
        self.backgroundView.backgroundColor = [UIColor clearColor];
    } completion:^(BOOL finished) {
        self.backgroundView.image = self.backgroundImage;
        if (completion != nil) { completion(); };
    }];
}

- (void)dismissOnboardingWithVoidAnimation:(BOOL)createdAccount
{
    // send them off into the app

    if (createdAccount) {
        [[ARAppDelegate sharedInstance] finishOnboardingAnimated:createdAccount];
    } else {
        [self resetBackgroundImageView:YES completion:^{
            self.modalTransitionStyle = UIModalTransitionStyleCrossDissolve;
            [[ARAppDelegate sharedInstance] finishOnboardingAnimated:createdAccount];
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
    @weakify(self);
    [self ar_presentIndeterminateLoadingIndicatorAnimated:YES];
    [ARAuthProviders getTokenForFacebook:^(NSString *token, NSString *email, NSString *name) {
        @strongify(self);

        AROnboardingMoreInfoViewController *more = [[AROnboardingMoreInfoViewController alloc] initForFacebookWithToken:token email:email name:name];
        more.delegate = self;
        [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];
        [self pushViewController:more animated:YES];

    } failure:^(NSError *error) {
        @strongify(self);

        [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];

        NSString * reason = error.userInfo[@"com.facebook.sdk:ErrorLoginFailedReason"];
        if (![reason isEqualToString:@"com.facebook.sdk:UserLoginCancelled"]) {
            [self fbError];
        }
    }];

}

- (void)signUpWithTwitter
{
    [self ar_presentIndeterminateLoadingIndicatorAnimated:YES];

    @weakify(self);
    [ARAuthProviders getReverseAuthTokenForTwitter:^(NSString *token, NSString *secret) {
        @strongify(self);

        AROnboardingMoreInfoViewController *more = [[AROnboardingMoreInfoViewController alloc]
                                                    initForTwitterWithToken:token andSecret:secret];
        more.delegate = self;
        [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];
        [self pushViewController:more animated:YES];

    } failure:^(NSError *error) {
        @strongify(self);

        [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];
        [self twitterError];
    }];
}

- (void)fbError
{
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Couldn’t get Facebook credentials"
                                                                    message:@"Couldn’t get Facebook credentials. Please link a Facebook account in the settings app. If you continue having trouble, please email Artsy support at support@artsy.net"
                                                                   delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil];
    [alert show];
}

- (void)twitterError
{
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Couldn’t get Twitter credentials"
                                                    message:@"Couldn’t get Twitter credentials. Please link a Twitter account in the settings app. If you continue having trouble, please email Artsy support at support@artsy.net"
                                                   delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil];
    [alert show];
}

//    [store requestAccessToAccountsWithType:fbType options:@{ACFacebookAppIdKey:@"414450748567864", ACFacebookPermissionsKey:@[@"email"]} completion:^(BOOL granted, NSError *error) {
//        if (granted) {
//            NSArray *accounts = [store accountsWithAccountType:fbType];
//            ACAccount *acc = accounts.first;
//            NSString *token = [[acc credential] oauthToken];
//
//            dispatch_async(dispatch_get_main_queue(), ^{
//                [self createFacebookUserWithToken:token email:nil];
//            });
//
//        } else {
//            // TODO: definitely copy, hopefully UI?
//
//            dispatch_async(dispatch_get_main_queue(), ^{
//                [self ar_removeIndeterminateLoadingIndicatorAnimated:];
//                UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Couldn’t get Facebook credentials"
//                                                                message:@"Couldn’t get Facebook credentials. Please link a Facebook account in the settings app. If you continue having trouble, please email Artsy support at support@artsy.net"
//                                                               delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil];
//                [alert show];
//            });
//            ARErrorLog(@"Failed to get Facebook credentials in onboarding. Error: %@", error.localizedDescription);
//        }
//    }];

- (void)logInWithEmail:(NSString *)email
{
    ARLoginViewController *loginViewController = [[ARLoginViewController alloc] initWithEmail:email];
    loginViewController.delegate = self;

    [self pushViewController:loginViewController animated:YES];
    self.state = AROnboardingStageEmailPassword;
}

- (UIViewController *)popViewControllerAnimated:(BOOL)animated
{
    UIViewController *poppedVC = [super popViewControllerAnimated:animated];
    UIViewController *topVC = self.topViewController;
    if (topVC == [self.viewControllers objectAtIndex:0] && [topVC isKindOfClass:ARSignUpSplashViewController.class]){
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
    self.backgroundWidthConstraint = [[self.backgroundView constrainWidthToView:self.view predicate:nil] lastObject];
    self.backgroundHeightConstraint = [[self.backgroundView constrainHeightToView:self.view predicate:nil] lastObject];
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

- (id <UIViewControllerAnimatedTransitioning>)navigationController:(UINavigationController *)navigationController
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

#pragma mark -
#pragma mark Background Image

- (void)getCurrentAppStateBlurredImage
{
    ARAppDelegate *appDelegate = [ARAppDelegate sharedInstance];
    UIView *view = appDelegate.viewController.view;

    UIGraphicsBeginImageContext(view.bounds.size);
    [view drawViewHierarchyInRect:view.bounds afterScreenUpdates:YES];

    UIImage *viewImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();

    [self setBackgroundImage:viewImage animated:YES];
}

- (void)setBackgroundImage:(UIImage *)backgroundImage animated:(BOOL)animated
{
    _backgroundImage = backgroundImage;
    UIImage *blurImage = [backgroundImage blurredImageWithRadius:12 iterations:2 tintColor:[UIColor colorWithWhite:0 alpha:.5]];

    CGFloat offset = 30;
    if (self.backgroundView.motionEffects.count == 0) {
        ARParallaxEffect *parallax = [[ARParallaxEffect alloc] initWithOffset:offset];
        [self.backgroundView addMotionEffect:parallax];
    }

    if (animated) {
        self.backgroundView.alpha = 1;
    }

    self.backgroundWidthConstraint.constant = offset * 2;
    self.backgroundHeightConstraint.constant = offset * 2;
    @weakify(self);
    [UIView animateIf:animated duration:ARAnimationQuickDuration :^{
        @strongify(self);
        [self.backgroundView layoutIfNeeded];
        self.backgroundView.image = blurImage;
        self.backgroundView.alpha = 0.3;
        self.backgroundView.backgroundColor = [UIColor blackColor];
    }];
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
