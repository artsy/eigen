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


@interface AROnboardingViewController () <UINavigationControllerDelegate>
@property (nonatomic, assign, readwrite) AROnboardingStage state;
@property (nonatomic) UIImageView *backgroundView;
@property (nonatomic) UIScreenEdgePanGestureRecognizer *screenSwipeGesture;
@property (nonatomic) NSArray *genesForPersonalize;
@property (nonatomic, strong, readwrite) NSMutableSet *followedItemsDuringOnboarding;
@property (nonatomic, assign, readwrite) NSInteger budgetRange;
@property (nonatomic, strong, readwrite) UIView *progressBar;
@property (nonatomic, strong, readwrite) UIView *progressBackgroundBar;

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
            _state = AROnboardingStageSignUp;
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
    self.view.tintColor = [UIColor artsyPurpleRegular];

    [self setupProgressView];

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

    if (self.state == AROnboardingStageSlideshow) {
        [self startSlideshow];
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

- (BOOL)prefersStatusBarHidden
{
    return YES;
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

- (void)setupProgressView
{
    self.progressBar = [[UIView alloc] init];
    self.progressBackgroundBar = [[UIView alloc] init];

    self.progressBackgroundBar.backgroundColor = [UIColor colorWithPatternImage:[UIImage imageNamed:@"Hash"]];
    [self.view addSubview:self.progressBackgroundBar];

    [self.progressBackgroundBar constrainHeight:@"5"];
    [self.progressBackgroundBar constrainWidthToView:self.view predicate:@"0"];
    [self.progressBackgroundBar alignTopEdgeWithView:self.view predicate:@"0"];
    [self.progressBackgroundBar alignLeadingEdgeWithView:self.view predicate:@"0"];

    self.progressBar.backgroundColor = [UIColor blackColor];
    [self.view addSubview:self.progressBar];

    self.progressBar.alpha = 0;
    self.progressBackgroundBar.alpha = 0;
}

- (void)updateProgress:(CGFloat)progress
{
    CGFloat progressWidth = self.view.frame.size.width * progress;

    [UIView animateWithDuration:0.3 delay:0.1 options:UIViewAnimationOptionCurveEaseInOut animations:^{
        self.progressBar.frame = CGRectMake(0, 0, progressWidth, 5);
        if (self.progressBar.alpha == 0) {
            self.progressBar.alpha = 0.7;
            self.progressBackgroundBar.alpha = 0.7;
        }
    } completion:^(BOOL finished) {
        self.progressBar.alpha = 1.0;
        self.progressBackgroundBar.alpha = 1.0;
    }];
}

#pragma mark -
#pragma mark Personalize level

- (void)presentOnboarding
{
    [UIView animateWithDuration:ARAnimationQuickDuration animations:^{
        self.backgroundView.alpha = 0;
    }];
    [self presentPersonalizationQuestionnaires];
}

- (void)presentPersonalizationQuestionnaires
{
    self.state = AROnboardingStagePersonalizeArtists;
    ARPersonalizeViewController *personalize = [[ARPersonalizeViewController alloc] initWithGenes:self.genesForPersonalize forStage:self.state];
    personalize.delegate = self;
    [self pushViewController:personalize animated:YES];
    [self updateProgress:0.25];
}

- (void)presentPersonalizeCategories
{
    self.state = AROnboardingStagePersonalizeCategories;
    ARPersonalizeViewController *personalize = [[ARPersonalizeViewController alloc] initWithGenes:self.genesForPersonalize forStage:self.state];
    personalize.delegate = self;
    [self pushViewController:personalize animated:YES];
    [self updateProgress:0.5];
}

- (void)presentPersonalizeBudget
{
    self.state = AROnboardingStagePersonalizeBudget;
    ARPersonalizeViewController *personalize = [[ARPersonalizeViewController alloc] initWithGenes:self.genesForPersonalize forStage:self.state];
    personalize.delegate = self;
    [self pushViewController:personalize animated:YES];
    [self updateProgress:0.75];
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

    // slight hack, but easiest way
    if ([self.topViewController isKindOfClass:[ARSignUpSplashViewController class]]) {
        self.progressBar.alpha = 0;
        self.progressBackgroundBar.alpha = 0;
        self.progressBar.frame = CGRectMake(0, 0, 0, 5);
    }
}

- (void)followableItemFollowed:(id<ARFollowable>)item
{
    [self.followedItemsDuringOnboarding addObject:item];
}

- (void)setPriceRangeDone:(NSInteger)range
{
    self.budgetRange = range;
}


#pragma mark -
#pragma mark Signup

- (void)signUp
{
    ARCreateAccountViewController *createVC = [[ARCreateAccountViewController alloc] init];
    createVC.delegate = self;
    [self pushViewController:createVC animated:YES];
    self.state = AROnboardingStageSignUp;
    [self updateProgress:0.95];
}

- (void)applyPersonalizationToUser
{
    NSString *stringRange = [NSString stringWithFormat:@"%@", @(self.budgetRange)];
    [ARAnalytics setUserProperty:ARAnalyticsPriceRangeProperty toValue:stringRange];

    User *user = [User currentUser];
    user.priceRange = stringRange;

    [user setRemoteUpdatePriceRange:self.budgetRange success:nil failure:^(NSError *error) {
        ARErrorLog(@"Error updating price range");
    }];

    // for now, considering we don't have a batch follow API yet
    for (id<ARFollowable> followableItem in self.followedItemsDuringOnboarding) {
        [followableItem followWithSuccess:^(id response) {
          // confetti
        } failure:^(NSError *error){
            // tears
        }];
    }
}

- (void)dismissOnboardingWithVoidAnimation:(BOOL)createdAccount
{
    // send them off into the app

    if (createdAccount) {
        [self applyPersonalizationToUser];
    }
    [[ARAppDelegate sharedInstance] finishOnboarding:self animated:createdAccount];
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


- (void)finishAccountCreation
{
    [self dismissOnboardingWithVoidAnimation:YES];
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

#pragma mark -
#pragma mark Navigation Delegate


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

@end
