#import "ARArtistFavoritesNetworkModel.h"

@implementation ARArtistFavoritesNetworkModel

- (void)performNetworkRequestAtPage:(NSInteger)page withSuccess:(void (^)(NSArray *artists))success failure:(void (^)(NSError *error))failure
{
    if (self.useSampleFavorites) {
        [ArtsyAPI getArtistsFromSampleAtPage:page success:success failure:failure];
    } else {
        [ArtsyAPI getArtistsFromPersonalCollectionAtPage:page success:success failure:failure];
    }
}

@end
