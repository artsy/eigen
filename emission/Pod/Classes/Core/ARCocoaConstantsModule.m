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
    BOOL isAREnabled = NO;

    if (@available(iOS 11.3, *)) {
        isAREnabled = [ARWorldTrackingConfiguration isSupported];
    }

    return @{
        @"UIApplicationOpenSettingsURLString": UIApplicationOpenSettingsURLString,
        @"LocalTimeZone": [[NSTimeZone localTimeZone] name],
        @"CurrentLocale": [[NSLocale currentLocale] localeIdentifier],
        @"AREnabled": @(isAREnabled),
    };
}

@end
