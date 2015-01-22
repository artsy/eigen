#import <JSDecoupledAppDelegate/JSDecoupledAppDelegate.h>

@interface ARAppNotificationsDelegate : NSObject <JSApplicationRemoteNotificationsDelegate>
- (void)registerForDeviceNotificationsOnce;
@end
