#import <UIKit/UIKit.h>
#import "AppDelegate.h"
#import <UserNotifications/UNUserNotificationCenter.h>

@interface ARAppDelegate (Notifications) <UNUserNotificationCenterDelegate>

typedef NS_ENUM(NSInteger, ARAppNotificationsRequestContext) {
    ARAppNotificationsRequestContextLaunch,
    ARAppNotificationsRequestContextOnboarding,
    ARAppNotificationsRequestContextArtistFollow,
    ARAppNotificationsRequestContextNone
};

@property (nonatomic, readwrite, assign) ARAppNotificationsRequestContext requestContext;

- (void)applicationDidReceiveRemoteNotification:(NSDictionary *)userInfo inApplicationState:(UIApplicationState)applicationState;

@end

