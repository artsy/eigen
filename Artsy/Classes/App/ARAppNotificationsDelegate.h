#import <JSDecoupledAppDelegate/JSDecoupledAppDelegate.h>


@interface ARAppNotificationsDelegate : NSObject <JSApplicationRemoteNotificationsDelegate>
- (void)registerForDeviceNotifications;
@end
