#import "ArtsyAPI.h"
#import "AFHTTPRequestOperation.h"

@interface ArtsyAPI (DeviceTokens)

+ (AFHTTPRequestOperation *)setAPNTokenForCurrentDevice:(NSString *)token success:(void (^)(id response))success failure:(void (^)(NSError *error))failure;

+ (AFHTTPRequestOperation *)deleteAPNTokenForCurrentDeviceWithCompletion:(void (^)(void))completion;

@end
