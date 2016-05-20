#import "ARNavigationController.h"
#import "ARTrialController.h"
#import "User.h"

@class ARSignUpSplashViewController;
@protocol ARFollowable;

@protocol AROnboardingStepsDelegate <NSObject>
- (void)personalizeArtistsDone;
- (void)personalizeCategoriesDone;
- (void)personalizeBudgetDone;
- (void)backTapped;
- (void)followableItemFollowed:(id<ARFollowable>)item;
- (void)splashDone:(ARSignUpSplashViewController *)sender;
- (void)splashDoneWithLogin:(ARSignUpSplashViewController *)sender;
- (void)slideshowDone;
- (void)setPriceRangeDone:(NSInteger)range;
@end

@protocol ARLoginSignupDelegate <NSObject>
- (void)didSignUpAndLogin;
- (void)dismissOnboardingWithVoidAnimation:(BOOL)animated;
@end

typedef NS_ENUM(NSInteger, ARInitialOnboardingState) {
    ARInitialOnboardingStateSlideShow,
    ARInitialOnboardingStateInApp
};

typedef NS_ENUM(NSInteger, AROnboardingStage) {
    AROnboardingStageSlideshow,
    AROnboardingStageStart,
    AROnboardingStagePersonalizeArtists,
    AROnboardingStagePersonalizeCategories,
    AROnboardingStagePersonalizeBudget,
    AROnboardingStageSignUp,
    AROnboardingStageLogin,
    AROnboardingStageFollowNotification
};

/// A state-machine based VC that implements the app onboarding process


@interface AROnboardingViewController : UINavigationController <ARLoginSignupDelegate, AROnboardingStepsDelegate>

- (instancetype)initWithState:(enum ARInitialOnboardingState)state;

@property (nonatomic, assign, readonly) ARInitialOnboardingState initialState;

- (void)signUpWithFacebook;
- (void)signUp;
- (void)logInWithEmail:(NSString *)email;
- (void)showTermsAndConditions;
- (void)showPrivacyPolicy;

// A sign-in is considered cancelled when the user taps the close button on a ARSignUpActiveUserViewController,
// not when the user initially chooses to use the app as a trial user.
- (void)dismissOnboardingWithVoidAnimation:(BOOL)createdAccount didCancel:(BOOL)cancelledSignIn;
- (void)dismissOnboardingWithVoidAnimation:(BOOL)createdAccount;

@property (nonatomic, assign) enum ARTrialContext trialContext;

@end
