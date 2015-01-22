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

- (void)dismissOnboardingWithVoidAnimation:(BOOL)createdAccount;

- (NSString *)onboardingConfigurationString;

@property (nonatomic, assign) enum ARTrialContext trialContext;

@end
