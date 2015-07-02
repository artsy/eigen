#import "ArtsyAPI.h"


@interface ArtsyAPI (ListCollection)

+ (void)getGenesFromPersonalCollectionAtPage:(NSInteger)page success:(void (^)(NSArray *genes))success failure:(void (^)(NSError *error))failure;

+ (void)getGenesFromPersonalCollectionCount:(void (^)(NSNumber *count))success failure:(void (^)(NSError *error))failure;

+ (void)getArtistsFromPersonalCollectionAtPage:(NSInteger)page success:(void (^)(NSArray *artists))success failure:(void (^)(NSError *error))failure;

+ (void)getArtistsFromPersonalCollectionCount:(void (^)(NSNumber *count))success failure:(void (^)(NSError *error))failure;

+ (void)getArtistsFromSampleAtPage:(NSInteger)page success:(void (^)(NSArray *artists))success failure:(void (^)(NSError *error))failure;

@end
