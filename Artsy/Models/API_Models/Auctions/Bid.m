#import "Bid.h"
#import "ARMacros.h"


@implementation Bid

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        ar_keypath(Bid.new, cents) : @"amount_cents",
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
    return [self.cents isEqual:otherBid.cents];
}

- (NSUInteger)hash
{
    return self.cents.hash;
}

@end
