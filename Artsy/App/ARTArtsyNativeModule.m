#import "ARTArtsyNativeModule.h"
#import "ARAppStatus.h"


@implementation ARTArtsyNativeModule

RCT_EXPORT_MODULE(ArtsyNativeModule);

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (NSDictionary *)constantsToExport
{
    return @{
        @"gitCommitShortHash": [[[NSBundle mainBundle] infoDictionary] objectForKey:@"GITCommitShortHash"],
        @"isBetaOrDev": @([ARAppStatus isBetaOrDev]),
    };
}

@end
