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
- (void)fetchNotificationCounts;
- (void)applicationDidReceiveRemoteNotification:(NSDictionary *)userInfo inApplicationState:(UIApplicationState)applicationState;
@end
