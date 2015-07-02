@class Artwork, Artist, Gene, Fair, PartnerShow;


@interface ArtsyAPI (Artworks)

+ (void)getArtworkInfo:(NSString *)artworkID success:(void (^)(Artwork *artwork))success failure:(void (^)(NSError *error))failure;
+ (AFJSONRequestOperation *)getArtistArtworks:(Artist *)artist andPage:(NSInteger)page withParams:(NSDictionary *)params success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure;

+ (void)getArtworkFromUserFavorites:(NSString *)userID page:(NSInteger)page success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure;

+ (AFJSONRequestOperation *)getFairsForArtwork:(Artwork *)artwork success:(void (^)(NSArray *fairs))success failure:(void (^)(NSError *error))failure;
+ (AFJSONRequestOperation *)getShowsForArtworkID:(NSString *)artworkID inFairID:(NSString *)fairID success:(void (^)(NSArray *shows))success failure:(void (^)(NSError *error))failure;

+ (AFJSONRequestOperation *)getArtworksForGene:(Gene *)gene atPage:(NSInteger)page success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure;

+ (AFJSONRequestOperation *)getAuctionComparablesForArtwork:(Artwork *)artwork success:(void (^)(NSArray *comparables))success failure:(void (^)(NSError *error))failure;
+ (void)getAuctionArtworkWithSale:(NSString *)saleID artwork:(NSString *)artworkID success:(void (^)(id auctionArtwork))success failure:(void (^)(NSError *error))failure;

@end
