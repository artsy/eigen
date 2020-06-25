#import "ARRouter.h"

@interface ARRouter (GraphQL)

+ (NSString *)graphQueryForFavorites;
+ (NSString *)graphQueryForFavoritesAfter:(NSString *)cursor;
+ (NSString *)graphQueryToRecordViewingOfArtwork:(NSString *)artworkID;
+ (NSString *)graphQueryToCreateBuyNowOrder;
+ (NSString *)graphQueryToCreateOffer;
+ (NSString *)graphQLQueryForLiveSaleStaticData:(NSString *)saleID role:(NSString *)causalityRole;
+ (NSString *)graphQueryForConversations;

@end
