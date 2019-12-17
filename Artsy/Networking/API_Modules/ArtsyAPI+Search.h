#import "ArtsyAPI.h"

NS_ASSUME_NONNULL_BEGIN

@class AFHTTPRequestOperation;


@interface ArtsyAPI (Search)

+ (nullable AFHTTPRequestOperation *)searchWithQuery:(NSString *)query success:(void (^)(NSArray *results))success failure:(void (^)(NSError *error))failure;
+ (nullable AFHTTPRequestOperation *)artistSearchWithQuery:(NSString *)query excluding:(NSArray *)artistsToExclude success:(void (^)(NSArray *results))success failure:(void (^)(NSError *error))failure;
+ (nullable AFHTTPRequestOperation *)geneSearchWithQuery:(NSString *)query excluding:(NSArray *)genesToExclude success:(void (^)(NSArray *results))success failure:(void (^)(NSError *error))failure;

@end

NS_ASSUME_NONNULL_END
