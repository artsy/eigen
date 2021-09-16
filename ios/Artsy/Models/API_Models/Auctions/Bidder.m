#import "Bidder.h"


@implementation Bidder

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        @"bidderID" : @"id",
        @"saleID" : @"sale.id",
        @"qualifiedForBidding" : @"qualified_for_bidding"
    };
}

- (BOOL)isEqual:(id)object
{
    if ([object isKindOfClass:[self class]]) {
        Bidder *bidder = object;
        return [bidder.bidderID isEqualToString:self.bidderID];
    }

    return [super isEqual:object];
}

- (NSUInteger)hash
{
    return self.bidderID.hash;
}

@end
