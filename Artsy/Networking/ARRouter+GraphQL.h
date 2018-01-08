#import "ARRouter.h"

@interface ARRouter (GraphQL)

+ (NSString *)graphQueryForFavorites;
+ (NSString *)graphQueryForFavoritesAfter:(NSString *)cursor;

+ (NSString *)graphQueryForArtworksInSale:(NSString *)saleID;

+ (NSString *)graphQLQueryForLiveSaleStaticData:(NSString *)saleID role:(NSString *)causalityRole;
+ (NSString *)graphQueryForConversations;

@end
