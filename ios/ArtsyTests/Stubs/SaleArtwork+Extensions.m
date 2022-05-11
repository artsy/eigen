#import "SaleArtwork+Extensions.h"


@implementation SaleArtwork (Extensions)
+ (SaleArtwork *)saleArtworkWithHighBid:(Bid *)bid AndReserveStatus:(ARReserveStatus)status
{
    return [SaleArtwork modelFromDictionary:@{
        @"artworkNumPositions" : @(5),
        @"saleHighestBid" : bid,
        @"minimumNextBidCents" : @(11000000),
        @"reserveStatus" : @(status),
        @"currencySymbol" : @"$"
    }];
}
@end
