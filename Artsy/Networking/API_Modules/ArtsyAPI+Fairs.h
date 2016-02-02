#import "ArtsyAPI.h"

@class Fair;
@class AFHTTPRequestOperation;

@interface ArtsyAPI (Fairs)

+ (void)getFairInfo:(NSString *)fairID success:(void (^)(Fair *fair))success failure:(void (^)(NSError *error))failure;

+ (void)getPartnerShowsForFair:(Fair *)fair success:(void (^)(NSArray *partnerShows))success failure:(void (^)(NSError *error))failure;

+ (void)getMapInfoForFair:(Fair *)fair success:(void (^)(NSArray *maps))success failure:(void (^)(NSError *error))failure;

+ (AFHTTPRequestOperation *)getArtworkFavoritesForFair:(Fair *)fair success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure;
+ (void)getArtistFollowsForFair:(Fair *)fair success:(void (^)(NSArray *artists))success failure:(void (^)(NSError *error))failure;
+ (void)getProfileFollowsForFair:(Fair *)fair success:(void (^)(NSArray *profiles))success failure:(void (^)(NSError *error))failure;

@end
