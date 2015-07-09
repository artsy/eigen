#import "ArtsyAPI.h"


@interface ArtsyAPI (Sales)

+ (void)getSalesWithArtwork:(NSString *)artworkID
                    success:(void (^)(NSArray *sales))success
                    failure:(void (^)(NSError *error))failure;

+ (AFJSONRequestOperation *)getArtworksForSale:(NSString *)saleID
                                       success:(void (^)(NSArray *artworks))success
                                       failure:(void (^)(NSError *error))failure;

@end
