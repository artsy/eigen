#import "ArtsyAPI.h"

@class Artwork, Artist, Gene, Fair, PartnerShow;
@class AFHTTPRequestOperation;


@interface ArtsyAPI (Artworks)

+ (AFHTTPRequestOperation *)getArtworkFromUserFavorites:(NSString *)cursor success:(void (^)(NSString *nextPageCursor, BOOL hasNextPage, NSArray *artworks))success failure:(void (^)(NSError *error))failure;

+ (AFHTTPRequestOperation *)getFairsForArtwork:(Artwork *)artwork success:(void (^)(NSArray *fairs))success failure:(void (^)(NSError *error))failure;
+ (AFHTTPRequestOperation *)getShowsForArtworkID:(NSString *)artworkID inFairID:(NSString *)fairID success:(void (^)(NSArray *shows))success failure:(void (^)(NSError *error))failure;

+ (void)getAuctionArtworkWithSale:(NSString *)saleID artwork:(NSString *)artworkID success:(void (^)(id auctionArtwork))success failure:(void (^)(NSError *error))failure;

+ (AFHTTPRequestOperation *)createBuyNowOrderWithArtworkID:(NSString *)artworkID success:(void (^)(id))success failure:(void (^)(NSError *))failure;
+ (AFHTTPRequestOperation *)createOfferOrderWithArtworkID:(NSString *)artworkID success:(void (^)(id))success failure:(void (^)(NSError *))failure;

@end
