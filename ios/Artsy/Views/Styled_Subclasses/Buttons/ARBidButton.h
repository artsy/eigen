#import <Artsy-UIButtons/ARButtonSubclasses.h>

#import "SaleArtwork.h"

extern NSString *const ARBidButtonRegisterStateTitle;
extern NSString *const ARBidButtonRegisteredStateTitle;
extern NSString *const ARBidBUttonBidStateTitle;
extern NSString *const ARBidButtonBiddingOpenStateTitle;
extern NSString *const ARBidButtonBiddingClosedStateTitle;
extern NSString *const ARBidButtonRegistionPendingStateTitle;
extern NSString *const ARBidButtonRegistionClosedStateTitle;


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
