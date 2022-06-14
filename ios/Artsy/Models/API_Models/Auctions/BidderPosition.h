#import <Mantle/Mantle.h>

@class Bid;


@interface BidderPosition : MTLModel <MTLJSONSerializing>
@property (nonatomic, copy, readonly) NSString *bidderPositionID;
@property (nonatomic, strong) Bid *highestBid;
@property (nonatomic, strong) NSNumber *maxBidAmountCents;
@end
