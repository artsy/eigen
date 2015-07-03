#import "ARGeneFavoritesNetworkModel.h"


@implementation ARGeneFavoritesNetworkModel

- (void)performNetworkRequestAtPage:(NSInteger)page withSuccess:(void (^)(NSArray *artists))success failure:(void (^)(NSError *error))failure
{
    if (self.useSampleFavorites) {
        @weakify(self);

        [ArtsyAPI getOrderedSetWithKey:@"favorites:suggested-genes" success:^(OrderedSet *set) {
            @strongify(self);
            if (!self) { return; }

            [ArtsyAPI getOrderedSetItems:set.orderedSetID.copy atPage:page withType:Gene.class success:success failure:failure];

        } failure:failure];
    } else {
        [ArtsyAPI getGenesFromPersonalCollectionAtPage:page success:success failure:failure];
    }
}

@end
