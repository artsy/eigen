#import "AROnboardingViewController.h"
#import "ARTrialController.h"
#import "ARTermsAndConditionsView.h"

@interface ARSignUpActiveUserViewController : UIViewController

@property (nonatomic, weak) AROnboardingViewController *delegate;
@property (nonatomic, assign) ARTrialContext trialContext;

@property (strong, nonatomic) IBOutlet UIView *topView;
@property (strong, nonatomic) IBOutlet UIView *bottomView;
@property (nonatomic, strong) IBOutlet ARSerifLineHeightLabel *bodyCopyLabel;

@property (nonatomic, strong) IBOutlet NSLayoutConstraint *logoConstraint;
@property (nonatomic, strong) IBOutlet NSLayoutConstraint *textConstraint;
@property (nonatomic, strong) IBOutlet NSLayoutConstraint *buttonsConstraint;

@property (nonatomic) BOOL shouldAnimate;
@end
