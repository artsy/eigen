#import <Expo/Expo.h>
#import <RCTAppDelegate.h>
#import <BrazeKit/BrazeKit-Swift.h>

@class ARWindow, ArtsyEcho;

@interface ARAppDelegate : EXAppDelegateWrapper

+ (ARAppDelegate *)sharedInstance;
+ (Braze *)braze;
- (NSURL *)bundleURL;

@property (strong, nonatomic) ARWindow *window;
@property (strong, nonatomic) UIViewController *viewController;

typedef NS_ENUM(NSInteger, ARAppNotificationsRequestContext) {
     ARAppNotificationsRequestContextLaunch,
     ARAppNotificationsRequestContextOnboarding,
     ARAppNotificationsRequestContextArtistFollow,
     ARAppNotificationsRequestContextNone
};

@property (strong, nonatomic, readonly) NSString *referralURLRepresentation;
@property (strong, nonatomic, readonly) NSString *landingURLRepresentation;

/// The Artsy echo instance for feature flags, and url routing etc
@property (nonatomic, readwrite, strong) ArtsyEcho *echo;

// Notifications Delegate
@property (nonatomic, readwrite, assign) ARAppNotificationsRequestContext requestContext;

@end


@interface ARWindow : UIWindow // look in HACKS.md. We use this for a patch to react-native-image-crop-picker for now.
@property (nonatomic, assign) CGPoint lastTouchPoint;
@end
