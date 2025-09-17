#import <UIKit/UIKit.h>
#import <Expo/Expo.h>
#import <BrazeKit/BrazeKit-Swift.h>
#import "ARWindow.h"

@class ArtsyEcho;

@interface ARAppDelegateHelper : NSObject

+ (instancetype)sharedInstance;

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

+ (Braze *)braze;
+ (void)setBraze:(Braze *)braze;

- (void)setupWithLaunchOptions:(NSDictionary *)launchOptions;
- (void)applicationDidBecomeActive;
- (void)setupAnalytics:(NSDictionary *)launchOptions;
- (void)forceCacheCustomFonts;
- (void)countNumberOfRuns;
- (void)registerNewSessionOpened;

@end
