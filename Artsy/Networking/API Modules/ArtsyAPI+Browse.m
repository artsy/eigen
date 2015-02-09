@implementation ArtsyAPI (Browse)

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

+ (void)getFeedLinksWithSuccess:(void (^)(NSArray *links))success failure:(void (^)(NSError *error))failure
{
    [self getOrderedSetItemsWithKey:@"eigen:feed-links" success:success failure:failure];
}

@end
