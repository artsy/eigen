#import "ArtsyAPI.h"

@interface ArtsyAPI (Search)

+ (AFJSONRequestOperation *)searchWithQuery:(NSString *)query success:(void(^)(NSArray *results))success failure:(void (^)(NSError *error))failure;
+ (AFJSONRequestOperation *)searchWithFairID:(NSString *)fairID andQuery:(NSString *)query success:(void (^)(NSArray *))success failure:(void (^)(NSError *))failure;
+ (AFJSONRequestOperation *)artistSearchWithQuery:(NSString *)query success:(void(^)(NSArray *results))success failure:(void (^)(NSError *error))failure;

@end
