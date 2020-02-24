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
#import "ARParallaxEffect.h"
#import "NSString+StringCase.h"
#import "ArtsyAPI+Genes.h"
#import "ArtsyAPI+Private.h"
#import <ARAnalytics/ARAnalytics.h>
#import "ARAnalyticsConstants.h"
#import "ARSwitchBoard+Eigen.h"
#import "ARDispatchManager.h"
#import "ARFollowable.h"
#import "ARRouter.h"
#import "AFHTTPRequestOperation+JSON.h"

#import "UIDevice-Hardware.h"

#import <UIView+BooleanAnimations/UIView+BooleanAnimations.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <Extraction/UIView+ARSpinner.h>


@interface AROnboardingViewController () <UINavigationControllerDelegate>
@property (nonatomic, assign, readwrite) AROnboardingStage state;
@property (nonatomic) UIImageView *backgroundView;
@property (nonatomic) UIScreenEdgePanGestureRecognizer *screenSwipeGesture;
@property (nonatomic, strong, readwrite) NSMutableSet *followedItemsDuringOnboarding;
@property (nonatomic, assign, readwrite) NSInteger budgetRange;
@property (nonatomic, strong, readwrite) NSLayoutConstraint *iPhoneXStatusBarHeightConstraint;
@property (nonatomic, strong, readwrite) UIView *progressBar;
@property (nonatomic, strong, readwrite) UIView *progressBackgroundBar;
@property (nonatomic, strong, readwrite) NSString *name;
@property (nonatomic, strong, readwrite) NSString *email;
@property (nonatomic, strong, readwrite) NSString *password;
@property (nonatomic, nonnull, strong, readwrite) UITextField *tempTextField;
@property (nonatomic, assign, readwrite) BOOL shouldPresentFacebook;

@end


@implementation AROnboardingViewController

- (instancetype)initWithState:(enum ARInitialOnboardingState)state
{
    self = [super init];
    if (!self) {
        return nil;
    }

    self.navigationBarHidden = YES;
    self.shouldPresentFacebook = NO;
    self.delegate = self;
    _followedItemsDuringOnboarding = [[NSMutableSet alloc] init];
    _initialState = state;
    switch (state) {
        case ARInitialOnboardingStateSlideShow:
            _state = AROnboardingStageSlideshow;
            break;

        case ARInitialOnboardingStateInApp:
            _state = AROnboardingStagePersonalizeEmail;
            
        case ARInitialOnboardingStatePersonalization:
            _state = AROnboardingStagePersonalizeArtists;
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

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(didBecomeActive)
                                                 name:UIApplicationDidBecomeActiveNotification
                                               object:nil];
    
    
    self.tempTextField = [[UITextField alloc] initWithFrame:CGRectMake(-500, 0, 0, 0)];
    self.tempTextField.returnKeyType = UIReturnKeyNext;
    self.tempTextField.autocorrectionType = UITextAutocorrectionTypeNo;
    [self.view addSubview:self.tempTextField];
}

- (void)viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    [self setupProgressView];
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
    if (self.state == AROnboardingStageSlideshow) {
        [self startSlideshow];
    } else if (self.state == AROnboardingStagePersonalizeArtists) {
        [self presentPersonalizationQuestionnaires];
    }
    
    [super viewWillAppear:animated];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(keyboardWillShow:)
                                                 name:UIKeyboardWillShowNotification
                                               object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(keyboardWillHide:)
                                                 name:UIKeyboardWillHideNotification
                                               object:nil];
}

- (BOOL)prefersStatusBarHidden
{
    return YES;
}

- (void)keyboardWillShow:(NSNotification *)notification
{
    _keyboardFrame = [[[notification userInfo] objectForKey:UIKeyboardFrameEndUserInfoKey] CGRectValue];
    if ([self.topViewController respondsToSelector:@selector(updateKeyboardFrame:)]) {
        [(ARPersonalizeViewController *)self.topViewController updateKeyboardFrame:_keyboardFrame];
    }
}

- (void)keyboardWillHide:(NSNotification *)notification
{
    _keyboardFrame = CGRectZero;
}

#pragma mark -
#pragma mark Slideshow

- (void)startSlideshow
{
    NSMutableArray *slides = [NSMutableArray array];
    NSInteger numberOfImages = [UIDevice isPad] ? 5 : 4;
    for (int i = 1; i <= numberOfImages; i++) {
        NSString *filePath = [[NSBundle mainBundle] pathForResource:[NSString stringWithFormat:@"splash_%d@2x", i] ofType:@"jpg"];
        UIImage *image = [UIImage imageWithContentsOfFile:filePath];
        if (image) {
            [slides addObject:image];
        }
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

- (void)splashDone:(ARSignUpSplashViewController *)sender
{
    [self presentOnboarding];
}

- (void)setupProgressView
{
    UIView *iPhoneXStatusBar = [[UIView alloc] init];
    iPhoneXStatusBar.backgroundColor = [UIColor blackColor];
    [self.view addSubview:iPhoneXStatusBar];
    [iPhoneXStatusBar alignTopEdgeWithView:self.view predicate:@"0"];
    [iPhoneXStatusBar constrainWidthToView:self.view predicate:@"0"];
    self.iPhoneXStatusBarHeightConstraint = [iPhoneXStatusBar constrainHeight:@"0"];

    self.progressBar = [[UIView alloc] init];
    self.progressBackgroundBar = [[UIView alloc] init];

    self.progressBackgroundBar.backgroundColor = [UIColor colorWithPatternImage:[UIImage imageNamed:@"Hash"]];
    [self.view addSubview:self.progressBackgroundBar];

    [self.progressBackgroundBar constrainTopSpaceToView:iPhoneXStatusBar predicate:@"0"];
    [self.progressBackgroundBar constrainHeight:@"5"];
    [self.progressBackgroundBar constrainWidthToView:self.view predicate:@"0"];

    [self.progressBackgroundBar alignLeadingEdgeWithView:self.view predicate:@"0"];

    self.progressBar.backgroundColor = [UIColor blackColor];
    [self.progressBackgroundBar addSubview:self.progressBar];

    self.progressBar.alpha = 0;
    self.progressBackgroundBar.alpha = 0;
}

- (void)updateProgress:(CGFloat)progress
{
    CGFloat progressWidth = self.view.frame.size.width * progress;

    [UIView animateWithDuration:0.3 delay:0.1 options:UIViewAnimationOptionCurveEaseInOut animations:^{
        self.progressBar.frame = CGRectMake(0, CGRectGetHeight(self.progressBackgroundBar.bounds) - 5, progressWidth, 5);
        if (self.progressBar.alpha == 0) {
            self.progressBar.alpha = 0.7;
            self.progressBackgroundBar.alpha = 0.7;
        }
    } completion:^(BOOL finished) {
        self.progressBar.alpha = 1.0;
        self.progressBackgroundBar.alpha = 1.0;
    }];
}

- (void)showTermsAndConditions
{
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:@"https://www.artsy.net/terms"] options:@{} completionHandler:nil];
}

- (void)showPrivacyPolicy
{
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:@"https://www.artsy.net/privacy"] options:@{} completionHandler:nil];
}


#pragma mark -
#pragma mark Personalize level

- (void)presentOnboarding
{
    [UIView animateWithDuration:ARAnimationQuickDuration animations:^{
        self.backgroundView.alpha = 0;
    }];

    [UIView animateWithDuration:ARAnimationDuration animations:^{
        self.iPhoneXStatusBarHeightConstraint.constant = self.view.safeAreaInsets.top;
        [self.view layoutIfNeeded];
    }];

    [self presentPersonalizationEmail];
}

- (void)presentPersonalizationEmail
{
    self.state = AROnboardingStagePersonalizeEmail;
    ARPersonalizeViewController *personalize = [[ARPersonalizeViewController alloc] initForStage:self.state];
    personalize.delegate = self;
    [self pushViewController:personalize animated:YES];
    [self updateProgress:0.20];
}

- (void)presentPersonalizationAcceptConditions
{
    self.state = AROnboardingStateAcceptConditions;
    ARPersonalizeViewController *personalize = [[ARPersonalizeViewController alloc] initForStage:self.state];
    personalize.delegate = self;
    [self pushViewController:personalize animated:YES];
    [self updateProgress:0.65];
}


- (void)presentPersonalizationLogin
{
    [self.tempTextField becomeFirstResponder];

    self.state = AROnboardingStagePersonalizeLogin;
    ARPersonalizeViewController *personalize = [[ARPersonalizeViewController alloc] initForStage:self.state];
    personalize.delegate = self;
    [self pushViewController:personalize animated:YES];
    [self updateProgress:0.90];
}

- (void)presentPersonalizationPassword
{
    [self.tempTextField becomeFirstResponder];

    self.state = AROnboardingStagePersonalizePassword;
    ARPersonalizeViewController *personalize = [[ARPersonalizeViewController alloc] initForStage:self.state];
    personalize.delegate = self;
    [self pushViewController:personalize animated:YES];
    [self updateProgress:0.40];
}

- (void)presentPersonalizationName
{
    [self.tempTextField becomeFirstResponder];

    self.state = AROnboardingStagePersonalizeName;
    ARPersonalizeViewController *personalize = [[ARPersonalizeViewController alloc] initForStage:self.state];
    personalize.delegate = self;
    [self pushViewController:personalize animated:YES];
    [self updateProgress:0.60];
}

- (void)presentPersonalizationQuestionnaires
{
    [self.tempTextField resignFirstResponder];
    
    self.state = AROnboardingStagePersonalizeArtists;
    ARPersonalizeViewController *personalize = [[ARPersonalizeViewController alloc] initForStage:self.state];
    personalize.delegate = self;
    [self pushViewController:personalize animated:YES];
    [self updateProgress:0.75];
}

- (void)presentPersonalizeCategories
{
    self.state = AROnboardingStagePersonalizeCategories;
    ARPersonalizeViewController *personalize = [[ARPersonalizeViewController alloc] initForStage:self.state];
    personalize.delegate = self;
    [self pushViewController:personalize animated:YES];
    [self updateProgress:0.85];
}

- (void)presentPersonalizeBudget
{
    self.state = AROnboardingStagePersonalizeBudget;
    ARPersonalizeViewController *personalize = [[ARPersonalizeViewController alloc] initForStage:self.state];
    personalize.delegate = self;
    [self pushViewController:personalize animated:YES];
    [self updateProgress:0.95];
}

- (void)personalizeEmailDone:(NSString *)email
{
    self.email = email;
    [self accountExistsForEmail:email];
}

- (void)personaliseFacebookTapped
{
    self.shouldPresentFacebook = YES;
    [self presentPersonalizationAcceptConditions];
}

- (void)personalizePasswordDone:(NSString *)password
{
    self.password = password;
    [self presentPersonalizationName];
}

- (void)personalizeLoginWithPasswordDone:(NSString *)password
{
    [self loginUserWithEmail:self.email password:password withSuccess:^{
        [ARAnalytics event:ARAnalyticsLoggedIn withProperties:@{@"context_type" : @"email"}];
        [[NSUserDefaults standardUserDefaults] setInteger:AROnboardingStageOnboarded forKey:AROnboardingUserProgressionStage];
        [self finishAccountCreation];
    }];
}

- (void)personalizeNameDone:(NSString *)name
{
    self.name = name;
    [self presentPersonalizationAcceptConditions];
}

- (void)personalizeAcceptConditionsDone
{
    if (self.shouldPresentFacebook) {
         [self fb];
    } else {
        [self createUserWithName:self.name email:self.email password:self.password];
    }
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
    [self finishAccountCreation];
}

- (void)backTapped
{
    if (self.state == AROnboardingStagePersonalizePassword) {
        [self.tempTextField becomeFirstResponder];
    }
    
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

- (void)privacyPolicyLinkTapped
{
    [self showPrivacyPolicy];
}

- (void)termsAndConditionsLinkTapped
{
    [self showTermsAndConditions];
}

- (void)setPriceRangeDone:(NSInteger)range
{
    self.budgetRange = range;
}


#pragma mark -
#pragma mark Signup

- (NSString *)userEmail
{
    return self.email;
}

- (void)accountExistsForEmail:(NSString *)email
{
    __weak typeof(self) wself = self;
    NSURLRequest *request = [ARRouter checkExistingUserWithEmail:email];
    AFHTTPRequestOperation *op = [AFHTTPRequestOperation JSONRequestOperationWithRequest:request success:^(NSURLRequest *request, NSHTTPURLResponse *response, id JSON) {
        __strong typeof (wself) sself = wself;
        if (JSON[@"id"]) {
            [sself presentPersonalizationLogin];
        }
    } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON) {
        __strong typeof (wself) sself = wself;
        [sself presentPersonalizationPassword];
    }];
        
  [op start];
}

- (void)createUserWithName:(NSString *)name email:(NSString *)email password:(NSString *)password
{
    __weak typeof(self) wself = self;
    [[ARUserManager sharedManager] createUserWithName:name email:email password:password success:^(User *user) {
        __strong typeof (wself) sself = wself;
        [sself loginUserWithEmail:email password:password withSuccess:^{
            [sself presentPersonalizationQuestionnaires];
        }];
    } failure:^(NSError *error, id JSON) {
        __strong typeof (wself) sself = wself;
        if ([JSON[@"type"] isEqualToString:@"param_error"]) {
            [sself displayError:JSON[@"message"]];
        } else {
            [sself displayNetworkFailureError];
        }

    }];

}

- (void)loginUserWithEmail:(NSString *)email password:(NSString *)password withSuccess:(void (^)(void))success
{
    __weak typeof(self) wself = self;
    [[ARUserManager sharedManager] loginWithUsername:email
                                            password:password
                              successWithCredentials:nil
                                             gotUser:^(User *currentUser) {
                                                 success();
                                             }
                               authenticationFailure:^(NSError *error) {
                                   __strong typeof (wself) sself = wself;
                                   if (sself.state == AROnboardingStagePersonalizeLogin) {
                                       [sself displayError:@"Please check your email and password"];
                                   }
                               }
                                      networkFailure:^(NSError *error) {
                                          __strong typeof (wself) sself = wself;
                                          [sself displayNetworkFailureError];
                                      }];
}


- (void)sendPasswordResetEmail:(NSString *)email sender:(id)sender
{
    [[ARUserManager sharedManager] sendPasswordResetForEmail:email success:^{
        [(ARPersonalizeViewController *)sender passwordResetSent];
        ARActionLog(@"Sent password reset request for %@", email);
    } failure:^(NSError *error) {
        ARErrorLog(@"Password reset failed for %@. Error: %@", email, error.localizedDescription);
        [(ARPersonalizeViewController *)sender passwordResetError:@"Couldn’t send reset password link. Please try again, or contact support@artsy.net"];
        [ARAnalytics event:ARAnalyticsAuthError withProperties:@{@"error_message" : @"Couldn’t send reset password link."}];

    }];
}

- (void)applyPersonalizationToUser
{
    if (self.budgetRange && self.followedItemsDuringOnboarding) {
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
}

- (void)finishAccountCreation
{
    if ([[ARUserManager sharedManager] currentUser]) {
        [self applyPersonalizationToUser];
    }
    [[ARAppDelegate sharedInstance] finishOnboarding:self animated:YES];
}

- (void)dismissOnboardingWithVoidAnimation:(BOOL)animated
{
    [[NSUserDefaults standardUserDefaults] setInteger:AROnboardingStageOnboarded forKey:AROnboardingUserProgressionStage];
    [self finishAccountCreation];
}

#pragma mark -
#pragma mark Facebook Dance

- (void)fb
{
    __weak typeof(self) wself = self;
    [self ar_presentIndeterminateLoadingIndicatorAnimated:YES];
    [ARAuthProviders getTokenForFacebook:^(NSString *token, NSString *email, NSString *name) {
        __strong typeof (wself) sself = wself;
        [sself fbSuccessWithToken:token email:email name:name];
        
    } failure:^(NSError *error) {
        __strong typeof (wself) sself = wself;
        [sself displayError:@"There was a problem authenticating with Facebook"];
        [sself ar_removeIndeterminateLoadingIndicatorAnimated:YES];
    }];
}

- (void)fbSuccessWithToken:(NSString *)token email:(NSString *)email name:(NSString *)name
{
    __weak typeof(self) wself = self;
    if (email && ![email isEqualToString:@""]) {
        [[ARUserManager sharedManager] createUserViaFacebookWithToken:token
                                                                email:email
                                                                 name:name
                                                              success:^(User *user) {
                                                                  __strong typeof (wself) sself = wself;
                                                                  // we've created a user, now let's log them in
                                                                  sself.state = AROnboardingStagePersonalizeName; // at stage of having all their details
                                                                  [sself loginWithFacebookCredentialToken:token];
                                                              }
                                                              failure:^(NSError *error, id JSON) {
                                                                  __strong typeof (wself) sself = wself;
                                                                  if (JSON && [JSON isKindOfClass:[NSDictionary class]]) {
                                                                      if ([JSON[@"error"] containsString:@"Another Account Already Linked"]) {
                                                                          // this facebook account is already an artsy account
                                                                          // let's log them in
                                                                          [sself loginWithFacebookCredentialToken:token];
                                                                          return;
                                                                      } else if ([JSON[@"error"] isEqualToString:@"User Already Exists"]
                                                                                 || [JSON[@"error"] isEqualToString:@"User Already Invited"]) {
                                                                          // there's already a user with this email
                                                                          __strong typeof (wself) sself = wself;
                                                                          [sself displayError:@"User already exists with this email. Please log in with your email and password."];
                                                                          [sself ar_removeIndeterminateLoadingIndicatorAnimated:YES];

                                                                          return;
                                                                      }
                                                                  }
                                                                  
                                                                  // something else went wrong
                                                                  ARErrorLog(@"Couldn't link Facebook account. Error: %@. The server said: %@", error.localizedDescription, JSON);
                                                                  [sself displayError:@"Couldn't link Facebook account"];
                                                                  [sself ar_removeIndeterminateLoadingIndicatorAnimated:YES];
                                                              }];
        
    } else {
        // provide popup warning asking the user to use a Facebook account with email
        [self ar_removeIndeterminateLoadingIndicatorAnimated:YES];
        
    }
}

- (void)loginWithFacebookCredentialToken:(NSString *)token
{
    __weak typeof(self) wself = self;
    [[ARUserManager sharedManager] loginWithFacebookToken:token
                                   successWithCredentials:nil
                                                  gotUser:^(User *currentUser) {
                                                      __strong typeof (wself) sself = wself;
                                                      // we've logged them in, let's wrap up
                                                      [sself ar_removeIndeterminateLoadingIndicatorAnimated:YES];
                                                      if (sself.state == AROnboardingStagePersonalizeEmail || sself.state == AROnboardingStateAcceptConditions) {
                                                          [[NSUserDefaults standardUserDefaults] setInteger:AROnboardingStageOnboarded forKey:AROnboardingUserProgressionStage];
                                                          [ARAnalytics event:ARAnalyticsLoggedIn withProperties:@{@"context_type" : @"facebook"}];
                                                          [sself finishAccountCreation];
                                                      } else if (sself.state == AROnboardingStagePersonalizeName) {
                                                          [sself presentPersonalizationQuestionnaires];
                                                      }
                                                  }
                                    authenticationFailure:^(NSError *error) {
                                        __strong typeof (wself) sself = wself;
                                        [sself displayError:@"There was a problem authenticating with Facebook"];
                                        [sself ar_removeIndeterminateLoadingIndicatorAnimated:YES];
                                    }
                                           networkFailure:^(NSError *error) {
                                               // TODO: handle this
                                               __strong typeof (wself) sself = wself;
                                               [sself displayNetworkFailureError];
                                               [sself ar_removeIndeterminateLoadingIndicatorAnimated:YES];
                                           }];
}

#pragma mark -
#pragma mark Errors

- (void)displayError:(NSString *)errorMessage
{
    if (self.state == AROnboardingStateAcceptConditions) {
        self.shouldPresentFacebook = NO;
        // This is hacky. But the top bar isn't visible so the user doesn't know they can pop back with swipe.
        // We pop back to the email view controller because the user can tap next from here to the
        // actual problem.
        // Can't wait for this to be moved to React Native.
        if (self.viewControllers.count > 1) {
            [self popToViewController:self.viewControllers[1] animated:YES];
        } else {
            [self popToRootViewControllerAnimated:YES];
        }
    }
    [(ARPersonalizeViewController *)self.topViewController showErrorWithMessage:errorMessage];
    [ARAnalytics event:ARAnalyticsAuthError withProperties:@{@"error_message" : errorMessage}];
}

- (void)displayNetworkFailureError
{
    [self displayError:@"Connection failed"];
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
