#import "ArtsyAPI+SystemTime.h"

#import "ArtsyAPI+Private.h"
#import "ARRouter+RestAPI.h"
#import "SystemTime.h"


@implementation ArtsyAPI (SystemTime)

+ (void)getSystemTime:(void (^)(SystemTime *systemTime))success failure:(void (^)(NSError *error))failure
{
    [self getRequest:[ARRouter newSystemTimeRequest] parseIntoAClass:[SystemTime class] success:success failure:failure];
}


@end
