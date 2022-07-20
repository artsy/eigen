#import "ARTThemeColors.h"
#import "AREmission.h"


@implementation ARTThemeColors

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup
{
    return NO;
}

RCT_EXPORT_METHOD(setColors:(NSDictionary *)colors)
{
    [[AREmission sharedInstance] setColors:colors];
}

@end
