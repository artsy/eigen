#import "UIApplicationStateEnum.h"


@implementation UIApplicationStateEnum
+ (NSString *)toString:(UIApplicationState)state
{
    NSString *result = nil;
    switch (state) {
        case UIApplicationStateActive:
            result = @"active";
            break;
        case UIApplicationStateInactive:
            result = @"inactive";
            break;
        case UIApplicationStateBackground:
            result = @"background";
            break;
        default:
            [NSException raise:NSGenericException format:@"Unexpected UIApplicationState %@", @(state)];
    }
    return result;
}
@end
