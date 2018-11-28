#import "ARRouter.h"

@interface ARRouter (GraphQL)

+ (NSString *)graphQueryForFavorites;
+ (NSString *)graphQueryForFavoritesAfter:(NSString *)cursor;
+ (NSString *)graphQueryToRecordViewingOfArtwork:(NSString *)artworkID;
+ (NSString *)graphQueryToCreateBuyNowOrder;
+ (NSString *)graphQueryToCreateOffer;
+ (NSString *)graphQueryForArtworksInSale:(NSString *)saleID;
+ (NSString *)graphQLQueryForLiveSaleStaticData:(NSString *)saleID role:(NSString *)causalityRole;
+ (NSString *)graphQueryForConversations;
+ (NSString *)graphQueryForArtwork;

@end
