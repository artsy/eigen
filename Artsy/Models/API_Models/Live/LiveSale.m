#import <Mantle/Mantle.h>

#import "LiveSale.h"
#import "ARMacros.h"
#import "LiveAuctionLot.h"
#import "ARStandardDateFormatter.h"
#import "ARSystemTime.h"


@implementation LiveSale

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        ar_keypath(LiveSale.new, liveSaleID) : @"id",
        ar_keypath(LiveSale.new, causalitySaleID) : @"_id",
        ar_keypath(LiveSale.new, startDate) : @"startAt",
        ar_keypath(LiveSale.new, endDate) : @"endAt",
        ar_keypath(LiveSale.new, liveAuctionStartDate) : @"live_start_at",
        ar_keypath(LiveSale.new, registrationEndsAtDate) : @"registration_ends_at",
        ar_keypath(LiveSale.new, saleDescription) : @"description",
        ar_keypath(LiveSale.new, saleArtworks) : @"sale_artworks",
    };
}

+ (NSValueTransformer *)startDateJSONTransformer
{
    return [ARStandardDateFormatter sharedFormatter].stringTransformer;
}

+ (NSValueTransformer *)endDateJSONTransformer
{
    return [ARStandardDateFormatter sharedFormatter].stringTransformer;
}

+ (NSValueTransformer *)saleArtworksJSONTransformer
{
    return [NSValueTransformer mtl_JSONArrayTransformerWithModelClass:[LiveAuctionLot class]];
}

- (BOOL)isCurrentlyActive
{
    NSDate *now = [ARSystemTime date];
    return (([now compare:self.startDate] != NSOrderedAscending) &&
            ([now compare:self.endDate] != NSOrderedDescending));
}

@end
