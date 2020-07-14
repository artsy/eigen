#import <JSDecoupledAppDelegate/JSDecoupledAppDelegate.h>


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

/// Private API, used only in admin tools
- (void)registerForDeviceNotificationsWithApple;
@end
