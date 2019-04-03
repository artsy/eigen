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
    return @{
        @"UIApplicationOpenSettingsURLString": UIApplicationOpenSettingsURLString,
        @"LocalTimeZone": [[NSTimeZone localTimeZone] name],
    };
}

@end
