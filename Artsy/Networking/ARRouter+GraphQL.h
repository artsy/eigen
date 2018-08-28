#import "ARRouter.h"

@interface ARRouter (GraphQL)

+ (NSString *)graphQueryForFavorites;
+ (NSString *)graphQueryForFavoritesAfter:(NSString *)cursor;
+ (NSString *)graphQueryToRecordViewingOfArtwork:(NSString *)artworkID;
+ (NSString *)graphQueryToCreateBuyNowOrderForArtwork:(NSString *)artworkID;
+ (NSString *)graphQueryForArtworksInSale:(NSString *)saleID;
+ (NSString *)graphQLQueryForLiveSaleStaticData:(NSString *)saleID role:(NSString *)causalityRole;
+ (NSString *)graphQueryForConversations;

@end
