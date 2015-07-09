#import <Foundation/Foundation.h>

/// A class to encapsulate all possible state needed for the Outbid notification

NS_ENUM(NSInteger, ARWatchBiddingStatus){
    ARWatchBiddingStatusFailed,
    ARWatchBiddingStatusOutbid,
    ARWatchBiddingStatusHighestBidder};


@interface WatchBiddingDetails : NSObject

- (instancetype)initWithDictionary:(NSDictionary *)dictionary;
- (NSDictionary *)dictionaryRepresentation;

@property (readonly, nonatomic, copy) NSString *saleArtworkID;
@property (readonly, nonatomic, copy) NSString *artworkID;
@property (readonly, nonatomic, copy) NSString *saleID;
@property (readonly, nonatomic, copy) NSString *artworkTitle;

@property (readonly, nonatomic, assign) NSInteger lastBidCents;
@property (readonly, nonatomic, assign) NSInteger minumumBidCents;
@property (readonly, nonatomic, assign) NSInteger currentBidCents;

/// Increments `currentBidCents` by the correct step for the price range
- (void)incrementBid;

/// Decrements `currentBidCents` by the correct step for the price range
- (void)decrementBid;

/// Is it possible to go any lower than the current bid?
- (BOOL)isAtMinimumBid;

@end
