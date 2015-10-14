#import "ArtsyAPI.h"

@class PartnerShow;
@class AFHTTPRequestOperation;

@interface ArtsyAPI (Shows)

+ (AFHTTPRequestOperation *)getShowInfo:(PartnerShow *)show success:(void (^)(PartnerShow *show))success failure:(void (^)(NSError *error))failure;

+ (AFHTTPRequestOperation *)getArtworksForShow:(PartnerShow *)show atPage:(NSInteger)page success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure;

+ (AFHTTPRequestOperation *)getImagesForShow:(PartnerShow *)show atPage:(NSInteger)page success:(void (^)(NSArray *images))success failure:(void (^)(NSError *error))failure;

@end
