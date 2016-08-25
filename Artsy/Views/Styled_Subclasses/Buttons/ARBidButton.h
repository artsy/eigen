#import <Artsy_UIButtons/ARButtonSubclasses.h>

#import "SaleArtwork.h"

extern NSString *const ARBidButtonRegisterStateTitle;
extern NSString *const ARBidButtonRegisteredStateTitle;
extern NSString *const ARBidButtonBiddingOpenStateTitle;
extern NSString *const ARBidButtonBiddingClosedStateTitle;
extern NSString *const ARBidButtonRegistionPendingStateTitle;
extern NSString *const ARBidButtonRegistionClosedStateTitle;


@interface ARBidButton : ARFlatButton
- (void)setAuctionState:(ARAuctionState)state;
- (void)setAuctionState:(ARAuctionState)state animated:(BOOL)animated;
@end
