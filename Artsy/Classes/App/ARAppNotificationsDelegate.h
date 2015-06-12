#import <JSDecoupledAppDelegate/JSDecoupledAppDelegate.h>

@interface ARAppNotificationsDelegate : NSObject <JSApplicationRemoteNotificationsDelegate>

// This must be done once a user has signed-in, otherwise the API won’t have a record to associate this device with.
// Therefore it is currently done from -[ARUserManager setCurrentUser:].
//
- (void)registerForDeviceNotifications;

@end
