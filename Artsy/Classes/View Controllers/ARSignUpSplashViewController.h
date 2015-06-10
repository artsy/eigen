@protocol AROnboardingStepsDelegate;

@interface ARSignUpSplashViewController : UIViewController
@property (nonatomic, weak) id<AROnboardingStepsDelegate> delegate;

@property (nonatomic, strong) UIImage *backgroundImage;

@property (nonatomic, assign, readonly) NSInteger pageCount;

@end
