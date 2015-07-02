#import "ARStubbedArtistNetworkModel.h"


@implementation ARStubbedArtistNetworkModel

- (void)getArtistInfoWithSuccess:(void (^)(Artist *artist))success failure:(void (^)(NSError *error))failure
{
    success(self.artistForArtistInfo);
}

- (void)getArtistArtworksAtPage:(NSInteger)page params:(NSDictionary *)params success:(void (^)(NSArray *artworks))success failure:(void (^)(NSError *error))failure

{
    if ([params[@"filter[]"] isEqualToString:@"for_sale"]) {
        success(self.forSaleArtworksForArtworksAtPage);
    } else {
        success(self.artworksForArtworksAtPage);
    }
}

@end
