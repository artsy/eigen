#import <Mantle/Mantle.h>
#import <ObjectiveSugar/ObjectiveSugar.h>

#import "LiveSale.h"
#import "BidIncrementStrategy.h"
#import "ARMacros.h"
#import "LiveAuctionLot.h"
#import "ARStandardDateFormatter.h"
#import "ARSystemTime.h"
#import "ARTwoWayDictionaryTransformer.h"
#import "MTLModel+JSON.h"


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
    // Mantle doesn't have a clean way to handle data in the shape of a connection.
    // We need to be defensive here in case the API returns unexpected data
    return [MTLValueTransformer transformerWithBlock:^id(id connection) {
        // Handle nil or unexpected types gracefully
        if (![connection isKindOfClass:[NSDictionary class]]) {
            return @[];
        }

        NSArray *edges = connection[@"edges"];
        // If edges is not an array, return empty array to prevent crashes
        if (![edges isKindOfClass:[NSArray class]]) {
            return @[];
        }

        return [edges map:^id(NSDictionary *edge) {
            return [LiveAuctionLot modelWithJSON:edge[@"node"]];
        }];
    }];
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
