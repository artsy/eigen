#import "ArtsyAPI.h"

@class SystemTime;


@interface ArtsyAPI (SystemTime)

+ (void)getSystemTime:(void (^)(SystemTime *systemTime))success failure:(void (^)(NSError *error))failure;

@end
