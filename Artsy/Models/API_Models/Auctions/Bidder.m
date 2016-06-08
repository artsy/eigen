#import "Bidder.h"


@implementation Bidder

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        @"bidderID" : @"id",
        @"saleID" : @"sale.id",
        @"saleRequiresBidderApproval" : @"sale.require_bidder_approval"
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
