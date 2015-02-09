@class AROnboardingViewController;

@interface ARSignUpSplashViewController : UIViewController

@property (nonatomic, weak) AROnboardingViewController *delegate;

@property (nonatomic, strong) UIImage *backgroundImage;

@property (nonatomic, assign, readonly) NSInteger pageCount;

@end
