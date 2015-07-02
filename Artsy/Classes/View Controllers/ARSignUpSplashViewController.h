#import "AROnboardingViewController.h"


@interface ARSignUpSplashViewController : UIViewController
@property (nonatomic, weak) id<AROnboardingStepsDelegate, ARLoginSignupDelegate> delegate;

@property (nonatomic, strong) UIImage *backgroundImage;

@property (nonatomic, assign, readonly) NSInteger pageCount;

@end
