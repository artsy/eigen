#import "BidderPosition.h"

#import "Bid.h"


@implementation BidderPosition

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        @"bidderPositionID" : @"id",
        @"highestBid" : @"highest_bid",
        @"maxBidAmountCents" : @"max_bid_amount_cents"
    };
}

+ (NSValueTransformer *)highestBidJSONTransformer
{
    return [MTLValueTransformer mtl_JSONDictionaryTransformerWithModelClass:[Bid class]];
}

- (NSComparisonResult)compare:(BidderPosition *)position
{
    return [self.maxBidAmountCents compare:position.maxBidAmountCents];
}

- (BOOL)isEqual:(id)object
{
    if ([object isKindOfClass:[self class]]) {
        BidderPosition *bidderPosition = object;
        return [bidderPosition.bidderPositionID isEqualToString:self.bidderPositionID];
    }

    return [super isEqual:object];
}

- (NSUInteger)hash
{
    return self.bidderPositionID.hash;
}

@end
