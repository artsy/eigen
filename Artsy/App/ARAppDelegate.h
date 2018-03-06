#import <JSDecoupledAppDelegate/JSDecoupledAppDelegate.h>
#import "AROnboardingViewController.h"

@class ARWindow;

// This class, and infact the complete JSDecoupledAppDelegate class, is not used during testing.
// The test app delegate class is ARTestHelper and is responsible for seting up the test env.
//
// When testing the various decoupled app delegate classes, simply use the shared app delegate
// (`[JSDecoupledAppDelegate sharedAppDelegate]`) to perform your tests on.


@interface ARAppDelegate : UIResponder <JSApplicationStateDelegate, JSApplicationURLResourceOpeningDelegate>

+ (ARAppDelegate *)sharedInstance;

@property (strong, nonatomic) ARWindow *window;
@property (strong, nonatomic) UIViewController *viewController;

@property (strong, nonatomic, readonly) NSString *referralURLRepresentation;
@property (strong, nonatomic, readonly) NSString *landingURLRepresentation;

- (void)showOnboarding;
- (void)showOnboardingWithState:(enum ARInitialOnboardingState)state;

- (void)finishOnboarding:(AROnboardingViewController *)viewController animated:(BOOL)animated;

@end

/// Here because it's intrinsically related to using the ARAppDelegate shared instance.
@interface ARWindow : UIWindow

/// Used to refer to the last touch coordinates for iPad popovers from martsy views.
@property (nonatomic, assign) CGPoint lastTouchPoint;

@end
