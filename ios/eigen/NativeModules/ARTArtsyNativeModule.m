#import "ARTArtsyNativeModule.h"

@implementation ARTArtsyNativeModule

RCT_EXPORT_MODULE(ArtsyNativeModule);


// TODO: Return proper AppStatus/isBetaOrDev
// TODO: Return proper GITCommitShortHash
// See ARTArtsyNativeModule in old project for how

- (NSDictionary *)constantsToExport
{
    return @{
        @"gitCommitShortHash": @"FAKEHASH",
        @"isBetaOrDev": @(YES),
    };
}

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}


@end
