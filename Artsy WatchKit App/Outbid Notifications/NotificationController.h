#import <WatchKit/WatchKit.h>
#import <Foundation/Foundation.h>

#import "WatchBiddingDetails.h"

/// Gets the notification for outbids
/// TODO: Figure how to make this just for that notification

@interface NotificationController : WKUserNotificationInterfaceController

/// Provides a way to communicate between a notification controller and
/// the main interface for the watch.

+ (WatchBiddingDetails *)biddingDetailsFromNotification;

@end
