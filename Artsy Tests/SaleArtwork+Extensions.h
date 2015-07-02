#import "SaleArtwork.h"


@interface SaleArtwork (Extensions)
+ (SaleArtwork *)saleArtworkWithHighBid:(Bid *)bid AndReserveStatus:(ARReserveStatus)status;
@end
