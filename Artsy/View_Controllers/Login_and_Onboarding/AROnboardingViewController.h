#import "ARNavigationController.h"
#import "User.h"

@class ARSignUpSplashViewController;
@protocol ARFollowable;

@protocol AROnboardingStepsDelegate <NSObject>
- (void)personalizeEmailDone:(NSString *)email;
- (void)personalizePasswordDone:(NSString *)password;
- (void)personalizeLoginWithPasswordDone:(NSString *)password;
- (void)personalizeNameDone:(NSString *)name;
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
- (void)dismissOnboardingWithVoidAnimation:(BOOL)animated;
@end

typedef NS_ENUM(NSInteger, ARInitialOnboardingState) {
    ARInitialOnboardingStateSlideShow,
    ARInitialOnboardingStateInApp
};

typedef NS_ENUM(NSInteger, AROnboardingStage) {
    AROnboardingStageSlideshow,
    AROnboardingStageStart,
    AROnboardingStagePersonalizeEmail,
    AROnboardingStagePersonalizePassword,
    AROnboardingStagePersonalizeLogin,
    AROnboardingStagePersonalizeName,
    AROnboardingStagePersonalizeArtists,
    AROnboardingStagePersonalizeCategories,
    AROnboardingStagePersonalizeBudget,
    AROnboardingStageFollowNotification
};

/// A state-machine based VC that implements the app onboarding process


@interface AROnboardingViewController : UINavigationController <ARLoginSignupDelegate, AROnboardingStepsDelegate>

- (instancetype)initWithState:(enum ARInitialOnboardingState)state;

@property (nonatomic, assign, readonly) ARInitialOnboardingState initialState;

- (void)finishAccountCreation;
//- (void)signUp;
//- (void)logInWithEmail:(NSString *)email;
- (void)showTermsAndConditions;
- (void)showPrivacyPolicy;

- (void)dismissOnboardingWithVoidAnimation:(BOOL)createdAccount;

@end
