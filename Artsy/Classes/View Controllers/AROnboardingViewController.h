#import "ARSignUpSplashViewController.h"
#import "ARNavigationController.h"
#import "ARTrialController.h"
#import "ARPersonalizeWebViewController.h"

typedef NS_ENUM(NSInteger, ARInitialOnboardingState){
    ARInitialOnboardingStateSlideShow,
    ARInitialOnboardingStateInApp
};

/// A state-machine based VC that implements the app onboarding process

@interface AROnboardingViewController : UINavigationController <ARPersonalizeWebViewControllerDelegate>

- (instancetype)initWithState:(enum ARInitialOnboardingState)state;

@property (nonatomic, assign, readonly) ARInitialOnboardingState initialState;

- (void)signUpWithFacebook;
- (void)signUpWithTwitter;
- (void)signUpWithEmail;

- (void)logInWithEmail:(NSString *)email;

- (void)slideshowDone;

- (void)splashDone:(ARSignUpSplashViewController *)sender;
- (void)splashDoneWithLogin:(ARSignUpSplashViewController *)sender;

- (void)signupDone;
- (void)collectorLevelDone:(ARCollectorLevel)level;
- (void)setPriceRangeDone:(NSInteger)range;
- (void)personalizeDone;
- (void)webOnboardingDone;

- (void)showTermsAndConditions;
- (void)showPrivacyPolicy;

// A sign-in is considered cancelled when the user taps the close button on a ARSignUpActiveUserViewController,
// not when the user initially chooses to use the app as a trial user.
- (void)dismissOnboardingWithVoidAnimation:(BOOL)createdAccount didCancel:(BOOL)cancelledSignIn;
- (void)dismissOnboardingWithVoidAnimation:(BOOL)createdAccount;

- (NSString *)onboardingConfigurationString;

@property (nonatomic, assign) enum ARTrialContext trialContext;

@end
