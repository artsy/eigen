#import "Bid.h"
#import "ARMacros.h"


@implementation Bid

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        ar_keypath(Bid.new, cents) : @"amount_cents",
        ar_keypath(Bid.new, bidID) : @"id"
    };
}

- (BOOL)isEqual:(id)object
{
    if (object == self) {
        return YES;
    } else if ([object class] == [self class]) {
        return [self isEqualToBid:object];
    }
    return NO;
}

- (BOOL)isEqualToBid:(Bid *)otherBid
{
    return [self.bidID isEqual:otherBid.bidID];
}

- (NSUInteger)hash
{
    return self.bidID.hash;
}

@end
