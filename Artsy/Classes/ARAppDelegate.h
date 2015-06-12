#import <JSDecoupledAppDelegate/JSDecoupledAppDelegate.h>
#import "AROnboardingViewController.h"
#import "ARTrialController.h"

@class ARWindow;

@interface ARAppDelegate : UIResponder <JSApplicationStateDelegate>

+ (ARAppDelegate *)sharedInstance;

@property (strong, nonatomic) ARWindow *window;
@property (strong, nonatomic) UIViewController *viewController;

@property (strong, nonatomic, readonly) NSString *referralURLRepresentation;
@property (strong, nonatomic, readonly) NSString *landingURLRepresentation;

- (void)showTrialOnboardingWithState:(enum ARInitialOnboardingState)state andContext:(enum ARTrialContext)context;

// A sign-in is considered cancelled when the user taps the close button on a ARSignUpActiveUserViewController,
// not when the user initially chooses to use the app as a trial user.
- (void)finishOnboardingAnimated:(BOOL)animated didCancel:(BOOL)cancelledSignIn;

@end

/// Here because it's intrinsically related to using the ARAppDelegate shared instance. 
@interface ARWindow: UIWindow

/// Used to refer to the last touch coordinates for iPad popovers from martsy views.
@property (nonatomic, assign) CGPoint lastTouchPoint;

@end
