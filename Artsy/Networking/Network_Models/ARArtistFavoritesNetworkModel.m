#import "ARArtistFavoritesNetworkModel.h"


@implementation ARArtistFavoritesNetworkModel

- (void)performNetworkRequestAtPage:(NSInteger)page withSuccess:(void (^)(NSArray *artists))success failure:(void (^)(NSError *error))failure
{
    if (self.useSampleFavorites) {
        @weakify(self);

        [ArtsyAPI getOrderedSetWithKey:@"personalize:suggested-artists" success:^(OrderedSet *set) {
            @strongify(self);
            if (!self) { return; }

            [ArtsyAPI getOrderedSetItems:set.orderedSetID.copy atPage:page withType:Artist.class success:success failure:failure];

        } failure:failure];

    } else {
        [ArtsyAPI getArtistsFromPersonalCollectionAtPage:page success:success failure:failure];
    }
}

@end
