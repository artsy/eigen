#import <JSDecoupledAppDelegate/JSDecoupledAppDelegate.h>
#import "AROnboardingViewController.h"
#import "ARTrialController.h"

@class ARWindow;

// This class, and infact the complete JSDecoupledAppDelegate class, is not used during testing.
// The test app delegate class is ARTestHelper and is responsible for seting up the test env.
//
// When testing the various decoupled app delegate classes, simply use the shared app delegate
// (`[JSDecoupledAppDelegate sharedAppDelegate]`) to perform your tests on.


@interface ARAppDelegate : UIResponder <JSApplicationStateDelegate>

+ (ARAppDelegate *)sharedInstance;

@property (strong, nonatomic) ARWindow *window;
@property (strong, nonatomic) UIViewController *viewController;

@property (strong, nonatomic, readonly) NSString *referralURLRepresentation;
@property (strong, nonatomic, readonly) NSString *landingURLRepresentation;

- (void)showOnboarding;
- (void)showOnboardingWithState:(enum ARInitialOnboardingState)state;

// A sign-in is considered cancelled when the user taps the close button on a ARSignUpActiveUserViewController,
// not when the user initially chooses to use the app as a trial user.
- (void)finishOnboardingAnimated:(BOOL)animated didCancel:(BOOL)cancelledSignIn;

@end

/// Here because it's intrinsically related to using the ARAppDelegate shared instance.
@interface ARWindow : UIWindow

/// Used to refer to the last touch coordinates for iPad popovers from martsy views.
@property (nonatomic, assign) CGPoint lastTouchPoint;

@end
