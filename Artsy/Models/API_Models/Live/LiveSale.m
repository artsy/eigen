#import <Mantle/Mantle.h>

#import "LiveSale.h"
#import "BidIncrementStrategy.h"
#import "ARMacros.h"
#import "LiveAuctionLot.h"
#import "ARStandardDateFormatter.h"
#import "ARSystemTime.h"
#import "ARTwoWayDictionaryTransformer.h"


@implementation LiveSale

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        ar_keypath(LiveSale.new, liveSaleID) : @"id",
        ar_keypath(LiveSale.new, causalitySaleID) : @"_id",
        ar_keypath(LiveSale.new, startDate) : @"start_at",
        ar_keypath(LiveSale.new, saleState) : @"auction_state",
        ar_keypath(LiveSale.new, liveAuctionStartDate) : @"live_start_at",
        ar_keypath(LiveSale.new, registrationEndsAtDate) : @"registration_ends_at",
        ar_keypath(LiveSale.new, saleDescription) : @"description",
        ar_keypath(LiveSale.new, saleArtworks) : @"sale_artworks",
        ar_keypath(LiveSale.new, bidIncrementStrategy) : @"bid_increments",
    };
}

+ (NSValueTransformer *)startDateJSONTransformer
{
    return [ARStandardDateFormatter sharedFormatter].stringTransformer;
}

+ (NSValueTransformer *)registrationEndsAtDateJSONTransformer
{
    return [ARStandardDateFormatter sharedFormatter].stringTransformer;
}

+ (NSValueTransformer *)saleArtworksJSONTransformer
{
    return [NSValueTransformer mtl_JSONArrayTransformerWithModelClass:[LiveAuctionLot class]];
}

+ (NSValueTransformer *)bidIncrementStrategyJSONTransformer
{
    return [NSValueTransformer mtl_JSONArrayTransformerWithModelClass:[BidIncrementStrategy class]];
}

+ (NSValueTransformer *)saleStateJSONTransformer
{
    return [ARTwoWayDictionaryTransformer reversibleTransformerWithDictionary:@{
        @"preview" : @(SaleStatePreview),
        @"open" : @(SaleStateOpen),
        @"closed" : @(SaleStateClosed),
    }];
}

- (BOOL)isCurrentlyActive
{
    return self.saleState == SaleStateOpen;
}

@end
