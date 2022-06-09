#import <JSDecoupledAppDelegate/JSDecoupledAppDelegate.h>
#import <UserNotifications/UNUserNotificationCenter.h>

@class ArtsyEcho;

// This class, and infact the complete JSDecoupledAppDelegate class, is not used during testing.
// The test app delegate class is ARTestHelper and is responsible for seting up the test env.
//
// When testing the various decoupled app delegate classes, simply use the shared app delegate
// (`[JSDecoupledAppDelegate sharedAppDelegate]`) to perform your tests on.


@interface ARAppDelegate : UIResponder <JSApplicationStateDelegate>

+ (ARAppDelegate *)sharedInstance;

@property (strong, nonatomic) UIWindow *window;
@property (strong, nonatomic) UIViewController *viewController;

@property (strong, nonatomic, readonly) NSString *referralURLRepresentation;
@property (strong, nonatomic, readonly) NSString *landingURLRepresentation;

/// The Artsy echo instance for feature flags, and url routing etc
@property (nonatomic, readwrite, strong) ArtsyEcho *echo;

@end
