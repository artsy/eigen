#import "AROnboardingViewController.h"


@interface ARSignUpSplashViewController : UIViewController
@property (nonatomic, weak) id<AROnboardingStepsDelegate, ARLoginSignupDelegate> delegate;
@property (nonatomic, weak) AROnboardingViewController *onboardingViewController;
@property (nonatomic, strong) UIImage *backgroundImage;
@end
