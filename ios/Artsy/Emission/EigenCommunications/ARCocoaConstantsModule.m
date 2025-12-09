@import ARKit;

#import "ARCocoaConstantsModule.h"

#import <UIKit/UIKit.h>

@implementation ARCocoaConstantsModule

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup;
{
    return NO;
}

- (NSDictionary *)constantsToExport;
{
    BOOL isAREnabled = [ARWorldTrackingConfiguration isSupported];

    return @{
        @"UIApplicationOpenSettingsURLString": UIApplicationOpenSettingsURLString,
        @"LocalTimeZone": [[NSTimeZone localTimeZone] name],
        @"CurrentLocale": [[NSLocale currentLocale] localeIdentifier],
        @"AREnabled": @(isAREnabled),
    };
}

@end
