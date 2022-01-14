#import "ARTProximityNotificationsModule.h"
#import "Artsy-Swift.h"

@implementation ARTProximityNotificationsModule

RCT_EXPORT_MODULE(ProximityNotificationsModule);

RCT_EXPORT_METHOD(startTrackingProximityNotifications)
{
    BOOL hasPermission = [[ProximityNotificationsManager sharedInstance] hasPermissionToTrackRegions];

    if (hasPermission) {
        [[ProximityNotificationsManager sharedInstance] startTrackingProximity];
    }
    // TODO: Show user some message / request more fine grained permissions if cannot track
}

RCT_EXPORT_METHOD(requestNewRegionTracking:(NSArray *)locations)
{
    [[ProximityNotificationsManager sharedInstance] updateRegionsWithRawRegions:locations];
}


@end
