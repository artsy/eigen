static NSNumberFormatter *dollarFormatter;

@implementation SaleArtwork

+ (void)initialize
{
    if (self == [SaleArtwork class]) {
        dollarFormatter = [[NSNumberFormatter alloc] init];
        dollarFormatter.numberStyle = NSNumberFormatterCurrencyStyle;

        // This is always dollars, so let's make sure that's how it shows up
        // regardless of locale.

        dollarFormatter.currencyGroupingSeparator = @",";
        dollarFormatter.currencySymbol = @"$";
        dollarFormatter.maximumFractionDigits = 0;
    }
}

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        @"saleArtworkID" : @"id",
        @"openingBidCents" : @"opening_bid_cents",
        @"minimumNextBidCents" : @"minimum_next_bid_cents",
        @"saleHighestBid" : @"highest_bid",
        @"artworkNumPositions" : @"bidder_positions_count",
        @"lowEstimateCents" : @"low_estimate_cents",
        @"highEstimateCents" : @"high_estimate_cents",
        @"reserveStatus" : @"reserve_status"
    };
}

- (ARAuctionState)auctionState
{
    ARAuctionState state = ARAuctionStateDefault;
    NSDate *now = [ARSystemTime date];

    if ([self.auction.startDate compare:now] == NSOrderedAscending) {
        state |= ARAuctionStateStarted;
    }

    if ([self.auction.endDate compare:now] == NSOrderedAscending) {
        state |= ARAuctionStateEnded;
    }

    if (self.bidder) {
        state |= ARAuctionStateUserIsRegistered;
    }

    if (self.saleHighestBid) {
        state |= ARAuctionStateArtworkHasBids;
    }

    if (self.positions.count) {
        state |= ARAuctionStateUserIsBidder;
    }

    for (BidderPosition *position in self.positions) {
        if ([self.saleHighestBid isEqual:position.highestBid]) {
            state |= ARAuctionStateUserIsHighBidder;
            break;
        }
    }

    return state;
}

+ (NSValueTransformer *)saleHighestBidJSONTransformer
{
    return [MTLValueTransformer mtl_JSONDictionaryTransformerWithModelClass:[Bid class]];
}

+ (NSValueTransformer *)reserveStatusJSONTransformer
{
    NSDictionary *types = @{
        @"no_reserve" : @(ARReserveStatusNoReserve),
        @"reserve_not_met" : @(ARReserveStatusReserveNotMet),
        @"reserve_met" : @(ARReserveStatusReserveMet)
    };

    return [MTLValueTransformer reversibleTransformerWithForwardBlock:^id(NSString *str) {
        if(!str) str = @"not for sale";
        return types[str];
    } reverseBlock:^id(NSNumber *type) {
        if (!type) { type = @0; }
        return [types allKeysForObject:type].lastObject;
    }];
}

- (void)setPositions:(NSArray *)positions
{
    _positions = positions;
}

- (BidderPosition *)userMaxBidderPosition
{
    return [self.positions valueForKeyPath:@"@max.self"];
}

- (NSString *)dollarsFromCents:(NSNumber *)cents
{
    NSNumber *dollars = @(roundf(cents.floatValue / 100)) ;

    if ([dollars integerValue] == 0) {
        return @"$0";
    }

    NSString *centString = [dollarFormatter stringFromNumber:dollars];
    if (centString.length < 3) {
        // just covering this very degenerate case
        // that hopefully this never happens
        return @"$1";
    }
    return centString;
}

- (BOOL)hasEstimate
{
    return self.lowEstimateCents || self.highEstimateCents;
}

- (NSString *)estimateString
{
    NSString *ret;
    if (self.lowEstimateCents && self.highEstimateCents) {
        ret = [NSString stringWithFormat:@"%@ – %@", [self dollarsFromCents:self.lowEstimateCents], [self dollarsFromCents:self.highEstimateCents]];
    } else if (self.lowEstimateCents) {
        ret = [self dollarsFromCents:self.lowEstimateCents];
    } else if (self.highEstimateCents) {
        ret = [self dollarsFromCents:self.highEstimateCents];
    } else {
        ARErrorLog(@"Asked for estimate from an artwork with no estimate data %@", self);
        ret = @"$0";
    }
    return [NSString stringWithFormat:@"Estimate: %@", ret];
}

- (BOOL)isEqual:(id)object
{
    if([object isKindOfClass:[self class]]) {
        SaleArtwork *saleArtwork = object;
        return [saleArtwork.saleArtworkID isEqualToString:self.saleArtworkID];
    }

    return [super isEqual:object];
}

- (NSUInteger)hash
{
    return self.saleArtworkID.hash;
}

@end
