#import <JSDecoupledAppDelegate/JSDecoupledAppDelegate.h>
#import <RCTAppDelegate.h>
#import <BrazeKit/BrazeKit-Swift.h>
#import <UserNotifications/UNUserNotificationCenter.h>

@class ARWindow, ArtsyEcho;

// This class, and in fact the complete JSDecoupledAppDelegate class, is not used during testing.
// The test app delegate class is ARTestHelper and is responsible for seting up the test env.
//
// When testing the various decoupled app delegate classes, simply use the shared app delegate
// (`[JSDecoupledAppDelegate sharedAppDelegate]`) to perform your tests on.

@interface ARAppDelegate : RCTAppDelegate <JSApplicationStateDelegate>

+ (ARAppDelegate *)sharedInstance;
+ (Braze *)braze;

@property (strong, nonatomic) ARWindow *window;
@property (strong, nonatomic) UIViewController *viewController;

@property (strong, nonatomic, readonly) NSString *referralURLRepresentation;
@property (strong, nonatomic, readonly) NSString *landingURLRepresentation;

/// The Artsy echo instance for feature flags, and url routing etc
@property (nonatomic, readwrite, strong) ArtsyEcho *echo;

@end


@interface ARWindow : UIWindow // look in HACKS.md. We use this for a patch to react-native-image-crop-picker for now.
@property (nonatomic, assign) CGPoint lastTouchPoint;
@end
