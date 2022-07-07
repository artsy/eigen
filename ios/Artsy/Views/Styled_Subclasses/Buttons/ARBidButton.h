#import "ARButtonSubclasses.h"

#import "SaleArtwork.h"

typedef enum : NSUInteger {
    ARBidButtonIntentRegister,
    ARBidButtonIntentBid,
} ARBidButtonIntent;

@interface ARBidButton : ARFlatButton

/// Sets auction state, with animation.
- (void)setAuctionState:(ARAuctionState)state;
/// Sets auction state, with default intent of ARBidButtonIntentRegister.
- (void)setAuctionState:(ARAuctionState)state animated:(BOOL)animated;
/// Sets auction stae.
- (void)setAuctionState:(ARAuctionState)state animated:(BOOL)animated intent:(ARBidButtonIntent)intent;

@end
