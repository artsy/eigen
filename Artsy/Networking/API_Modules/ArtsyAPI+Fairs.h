#import "ArtsyAPI.h"

@class Fair;
@class AFHTTPRequestOperation;

@interface ArtsyAPI (Fairs)

+ (void)getFairInfo:(NSString *)fairID success:(void (^)(Fair *fair))success failure:(void (^)(NSError *error))failure;

+ (void)getProfileFollowsForFair:(Fair *)fair success:(void (^)(NSArray *profiles))success failure:(void (^)(NSError *error))failure;

@end
