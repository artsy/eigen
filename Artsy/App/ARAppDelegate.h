#import <JSDecoupledAppDelegate/JSDecoupledAppDelegate.h>
#import "AROnboardingViewController.h"
#import "ARTrialController.h"

@interface ARAppDelegate : UIResponder <JSApplicationStateDelegate>

+ (ARAppDelegate *)sharedInstance;

@property (strong, nonatomic) UIWindow *window;
@property (strong, nonatomic) UIViewController *viewController;

@property (strong, nonatomic, readonly) NSString *referralURLRepresentation;
@property (strong, nonatomic, readonly) NSString *landingURLRepresentation;

- (void)showTrialOnboardingWithState:(enum ARInitialOnboardingState)state andContext:(enum ARTrialContext)context;

- (void)finishOnboardingAnimated:(BOOL)animated;

@end
