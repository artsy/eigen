#import "ARArtistFavoritesNetworkModel.h"

#import "ArtsyAPI+ListCollection.h"
#import "ArtsyAPI+OrderedSets.h"
#import "OrderedSet.h"
#import "Artist.h"


@implementation ARArtistFavoritesNetworkModel

- (AFHTTPRequestOperation *)requestOperationAtPage:(NSInteger)page withSuccess:(void (^)(NSArray *artists))success failure:(void (^)(NSError *error))failure
{
    if (self.useSampleFavorites) {
        __weak typeof(self) wself = self;

        return [ArtsyAPI getOrderedSetWithKey:@"personalize:suggested-artists" success:^(OrderedSet *set) {
            if (!wself) { return; }

            [ArtsyAPI getOrderedSetItems:set.orderedSetID.copy atPage:page withType:Artist.class success:success failure:failure];

        } failure:failure];

    } else {
        return [ArtsyAPI getArtistsFromPersonalCollectionAtPage:page success:success failure:failure];
    }
}

@end
