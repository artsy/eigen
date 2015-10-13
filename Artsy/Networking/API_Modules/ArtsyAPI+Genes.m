#import "ArtsyAPI+OrderedSets.h"
#import "ArtsyAPI+Private.h"
#import "ARRouter.h"


@implementation ArtsyAPI (Genes)

+ (void)getGeneForGeneID:(NSString *)geneID success:(void (^)(Gene *gene))success failure:(void (^)(NSError *error))failure
{
    NSParameterAssert(success);
    [self getRequest:[ARRouter newGeneInfoRequestWithID:geneID] parseIntoAClass:[Gene class] success:success failure:failure];
}
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
