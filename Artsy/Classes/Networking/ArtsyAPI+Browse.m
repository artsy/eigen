@implementation ArtsyAPI (Browse)

+ (void)getBrowseMenuFeedLinksWithSuccess:(void (^)(NSArray *))success failure:(void (^)(NSError *))failure
{
    [self getOrderedSetItemsWithKey:@"eigen-browse:menu-items" success:success failure:failure];
}

@end
