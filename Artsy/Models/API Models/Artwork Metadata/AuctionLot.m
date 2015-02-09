#import "ARStandardDateFormatter.h"

@implementation AuctionLot

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        @"auctionLotID" : @"id",
        @"dimensionsCM" : @"dimensions.cm",
        @"dimensionsInches" : @"dimensions.in",
        @"estimate" : @"estimate_text",
        @"price" : @"price_realized_text",
        @"dates" : @"dates_text",
        @"auctionDate" : @"auction_date",
        @"auctionDateText" : @"auction_dates_text",
        @"imageURL" : @"image_url",
        @"externalURL" : @"external_url",
    };
}

+ (NSValueTransformer *)imageURLJSONTransformer {
    return [NSValueTransformer valueTransformerForName:MTLURLValueTransformerName];
}

+ (NSValueTransformer *)externalURLJSONTransformer {
    return [NSValueTransformer valueTransformerForName:MTLURLValueTransformerName];
}

+ (NSValueTransformer *)auctionDateJSONTransformer
{
    return [ARStandardDateFormatter sharedFormatter].stringTransformer;
}

- (BOOL)isEqual:(id)object
{
    if([object isKindOfClass:[self class]]) {
        AuctionLot *auctionLot = object;
        return [auctionLot.auctionLotID isEqualToString:self.auctionLotID];
    }

    return [super isEqual:object];
}

- (NSUInteger)hash
{
    return self.auctionLotID.hash;
}

@end
