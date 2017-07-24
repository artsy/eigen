#import "ArtsyAPI.h"

@class Artwork, Artist, Gene, Fair, PartnerShow;
@class AFHTTPRequestOperation;


@interface ArtsyAPI (Artworks)

+ (void)getArtworkInfo:(NSString *)artworkID success:(void (^)(Artwork *artwork))success failure:(void (^)(NSError *error))failure;

+ (AFHTTPRequestOperation *)getArtistArtworks:(Artist *)artist andPage:(NSInteger)page withParams:(NSDictionary *)params success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure;

+ (AFHTTPRequestOperation *)getArtworkFromUserFavorites:(NSString *)cursor success:(void (^)(NSString *nextPageCursor, NSArray *artworks))success failure:(void (^)(NSError *error))failure;

+ (AFHTTPRequestOperation *)getFairsForArtwork:(Artwork *)artwork success:(void (^)(NSArray *fairs))success failure:(void (^)(NSError *error))failure;
+ (AFHTTPRequestOperation *)getShowsForArtworkID:(NSString *)artworkID inFairID:(NSString *)fairID success:(void (^)(NSArray *shows))success failure:(void (^)(NSError *error))failure;

+ (AFHTTPRequestOperation *)getArtworksForGene:(Gene *)gene atPage:(NSInteger)page success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure;

+ (AFHTTPRequestOperation *)getAuctionComparablesForArtwork:(Artwork *)artwork success:(void (^)(NSArray *comparables))success failure:(void (^)(NSError *error))failure;
+ (void)getAuctionArtworkWithSale:(NSString *)saleID artwork:(NSString *)artworkID success:(void (^)(id auctionArtwork))success failure:(void (^)(NSError *error))failure;

+ (AFHTTPRequestOperation *)createPendingOrderWithArtworkID:(NSString *)artworkID editionSetID:(NSString *)editionSetID success:(void (^)(NSArray *))success failure:(void (^)(NSError *))failure;

@end
