#import "ARNavigationController.h"
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

// Technically one can't cancel the onboarding currently
- (void)dismissOnboardingWithVoidAnimation:(BOOL)createdAccount didCancel:(BOOL)cancelledSignIn;
- (void)dismissOnboardingWithVoidAnimation:(BOOL)createdAccount;

@end
