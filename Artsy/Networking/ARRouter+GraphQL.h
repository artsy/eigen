#import "ARRouter.h"

@interface ARRouter (GraphQL)

+ (NSString *)graphQueryForFavorites;
+ (NSString *)graphQueryForFavoritesAfter:(NSString *)cursor;

+ (NSString *)graphQLQueryForLiveSaleStaticData:(NSString *)saleID role:(NSString *)causalityRole;

@end
