#import "ArtsyAPI.h"

@interface ArtsyAPI (DeviceTokens)

+ (AFJSONRequestOperation *)setAPNTokenForCurrentDevice:(NSData *)token success:(void (^)(id response))success failure:(void (^)(NSError *error))failure;

@end
