


@implementation Bid

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        @"cents" : @"amount_cents",
        @"bidID" : @"id"
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
