#import "ArtsyAPI+OrderedSets.h"
#import "ArtsyAPI+Private.h"
#import "ARRouter.h"
#import "Gene.h"


@implementation ArtsyAPI (Genes)

+ (void)getFeaturedLinksForGenesWithSuccess:(void (^)(NSArray *))success failure:(void (^)(NSError *))failure
{
    [self getOrderedSetItemsWithKey:@"browse:featured-genes" andName:@"Featured Categories" success:success failure:failure];
}

+ (void)getFeaturedLinkCategoriesForGenesWithSuccess:(void (^)(NSArray *))success failure:(void (^)(NSError *))failure
{
    [self getOrderedSetItemsWithKey:@"browse:gene-categories" andName:@"Gene Categories" success:success failure:failure];
}

+ (void)getPersonalizeGenesWithSuccess:(void (^)(NSArray *))success failure:(void (^)(NSError *))failure
{
    [self getOrderedSetItemsWithKey:@"eigen-personalize:suggested-genes" success:success failure:failure];
}

@end
