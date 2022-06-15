#import <JSDecoupledAppDelegate/JSDecoupledAppDelegate.h>

#import <React/RCTUtils.h>
#import <React/RCTDevSettings.h>
#import <UserNotifications/UNUserNotificationCenter.h>

@interface ARAppNotificationsDelegate : NSObject <JSApplicationRemoteNotificationsDelegate>

typedef NS_ENUM(NSInteger, ARAppNotificationsRequestContext) {
    ARAppNotificationsRequestContextLaunch,
    ARAppNotificationsRequestContextOnboarding,
    ARAppNotificationsRequestContextArtistFollow,
    ARAppNotificationsRequestContextNone
};

@property (nonatomic, readwrite, assign) ARAppNotificationsRequestContext requestContext;

- (void)registerForDeviceNotificationsWithContext:(ARAppNotificationsRequestContext)requestContext;
- (void)applicationDidReceiveRemoteNotification:(NSDictionary *)userInfo inApplicationState:(UIApplicationState)applicationState;

/// Used in admin tools and for react native to request permissions
- (void)registerForDeviceNotificationsWithApple;

@end
