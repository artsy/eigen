#import "ARCocoaConstantsModule.h"

#import <UIKit/UIKit.h>

@implementation ARCocoaConstantsModule

RCT_EXPORT_MODULE();

- (NSDictionary *)constantsToExport;
{
    return @{
        @"UIApplicationOpenSettingsURLString": UIApplicationOpenSettingsURLString,
    };
}

@end
