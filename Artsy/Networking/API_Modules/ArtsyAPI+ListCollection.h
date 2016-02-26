#import "ArtsyAPI.h"
#import <AFNetworking/AFNetworking.h>


@interface ArtsyAPI (ListCollection)

+ (AFHTTPRequestOperation *)getGenesFromPersonalCollectionAtPage:(NSInteger)page success:(void (^)(NSArray *genes))success failure:(void (^)(NSError *error))failure;

+ (void)getGenesFromPersonalCollectionCount:(void (^)(NSNumber *count))success failure:(void (^)(NSError *error))failure;

+ (AFHTTPRequestOperation *)getArtistsFromPersonalCollectionAtPage:(NSInteger)page success:(void (^)(NSArray *artists))success failure:(void (^)(NSError *error))failure;

+ (void)getArtistsFromPersonalCollectionCount:(void (^)(NSNumber *count))success failure:(void (^)(NSError *error))failure;

+ (void)getArtistsFromSampleAtPage:(NSInteger)page success:(void (^)(NSArray *artists))success failure:(void (^)(NSError *error))failure;

@end
