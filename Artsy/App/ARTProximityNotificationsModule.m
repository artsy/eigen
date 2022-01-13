#import "ARTProximityNotificationsModule.h"
#import "Artsy-Swift.h"

@implementation ARTProximityNotificationsModule

RCT_EXPORT_MODULE(ProximityNotificationsModule);

RCT_EXPORT_METHOD(startTrackingProximityNotifications)
{
    BOOL hasPermission = [[ProximityNotificationsManager sharedInstance] hasPermissionToTrackRegions];
    NSString *hasPermissionStr = hasPermission ? @"YES" : @"NO";
    NSLog(@"NTFY hasPermission to track regions %@", hasPermissionStr);
}

@end
