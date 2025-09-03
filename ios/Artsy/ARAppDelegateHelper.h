#import <UIKit/UIKit.h>
#import <Expo/Expo.h>
#import <BrazeKit/BrazeKit-Swift.h>

@class ARWindow, ArtsyEcho;

@interface ARAppDelegateHelper : NSObject

+ (instancetype)sharedInstance;

// Properties from original AppDelegate
@property (strong, nonatomic) ARWindow *window;
@property (strong, nonatomic) ArtsyEcho *echo;
@property (strong, nonatomic, readonly) NSString *referralURLRepresentation;
@property (strong, nonatomic, readonly) NSString *landingURLRepresentation;

typedef NS_ENUM(NSInteger, ARAppNotificationsRequestContext) {
    ARAppNotificationsRequestContextLaunch,
    ARAppNotificationsRequestContextOnboarding,
    ARAppNotificationsRequestContextArtistFollow,
    ARAppNotificationsRequestContextNone
};

@property (nonatomic, readwrite, assign) ARAppNotificationsRequestContext requestContext;

// Braze
+ (Braze *)braze;
+ (void)setBraze:(Braze *)braze;

// Core setup methods
- (void)setupWithLaunchOptions:(NSDictionary *)launchOptions;
- (void)applicationDidBecomeActive;

@end