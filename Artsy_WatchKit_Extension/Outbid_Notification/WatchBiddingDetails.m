#import "WatchBiddingDetails.h"


@implementation WatchBiddingDetails

- (instancetype)initWithDictionary:(NSDictionary *)dictionary
{
    self = [super init];
    if (!self) return nil;

    _artworkID = @"";
    _artworkTitle = dictionary[@"artwork_title"];

    _lastBidCents = [dictionary[@"your_last_bid_cents"] integerValue];
    _minumumBidCents = [dictionary[@"minimum_bid_cents"] integerValue];
    _currentBidCents = [(dictionary[@"current_bid_cents"] ?: @(_minumumBidCents))integerValue];

    return self;
}

- (NSDictionary *)dictionaryRepresentation
{
    return @{ @"action" : @"bid",
              @"details" : @{
                  @"artwork_id" : self.artworkID,
                  @"current_bid_cents" : @(self.currentBidCents),
                  @"artwork_title" : self.artworkTitle
              } };
}

- (void)incrementBid
{
    _currentBidCents += [self incrementForCents:self.currentBidCents];
}

- (void)decrementBid
{
    NSInteger minimum = self.currentBidCents - [self incrementForCents:self.currentBidCents];
    _currentBidCents = MAX(minimum, self.minumumBidCents);
}

- (BOOL)isAtMinimumBid
{
    return self.currentBidCents == self.minumumBidCents;
}

// https://github.com/artsy/gravity/blob/master/app/models/bidding/increment_strategy/default.rb

- (NSInteger)incrementForCents:(NSInteger)cents
{
    if (0 < cents && cents < 99999) return 5000;
    if (100000 < cents && cents < 199999) return 10000;
    if (200000 < cents && cents < 499999) return 25000;
    if (500000 < cents && cents < 999999) return 50000;
    if (1000000 < cents && cents < 1999999) return 100000;
    if (2000000 < cents && cents < 4999999) return 500000;
    return 1000000;
}

@end
