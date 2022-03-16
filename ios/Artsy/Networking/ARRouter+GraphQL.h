#import "ARRouter.h"

@interface ARRouter (GraphQL)

+ (NSString *)graphQLQueryForLiveSaleStaticData:(NSString *)saleID role:(NSString *)causalityRole;

@end
