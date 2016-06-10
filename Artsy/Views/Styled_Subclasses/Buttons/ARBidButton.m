#import "ARBidButton.h"

#import "ARFonts.h"

#import <EDColor/EDColor.h>

NSString *const ARBidButtonRegisterStateTitle = @"REGISTER TO BID";
NSString *const ARBidButtonRegisteredStateTitle = @"YOU ARE REGISTERED TO BID";
NSString *const ARBidButtonBiddingOpenStateTitle = @"BID";
NSString *const ARBidButtonBiddingClosedStateTitle = @"BIDDING CLOSED";
NSString *const ARBidButtonRegistionPendingStateTitle = @"REGISTRATION PENDING";
NSString *const ARBidButtonRegistionClosedStateTitle = @"REGISTRATION CLOSED";


@implementation ARBidButton

- (void)setup
{
    [super setup];

    self.titleLabel.font = [UIFont sansSerifFontWithSize:15];
    [self setTitleColor:[UIColor whiteColor] forState:UIControlStateHighlighted];
    [self setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
}

- (CGSize)intrinsicContentSize
{
    return (CGSize){UIViewNoIntrinsicMetric, 46};
}

- (void)setAuctionState:(ARAuctionState)state animated:(BOOL)animated
{
    NSString *title = nil;
    UIColor *backgroundColor = [UIColor blackColor];
    BOOL enabled = YES;
    BOOL interactionEnabled = YES;

    if (state & ARAuctionStateEnded) {
        title = ARBidButtonBiddingClosedStateTitle;
        enabled = NO;
    } else if (state & ARAuctionStateUserPendingRegistration) {
        title = ARBidButtonRegistionPendingStateTitle;
        enabled = NO;
    } else if (state & ARAuctionStateUserRegistrationClosed) {
        title = ARBidButtonRegistionClosedStateTitle;
        enabled = NO;
    } else if (state & ARAuctionStateStarted) {
        title = ARBidButtonBiddingOpenStateTitle;
    } else if (state & ARAuctionStateUserIsRegistered) {
        title = ARBidButtonRegisteredStateTitle;
        // TODO: replace with a standard artsy color
        backgroundColor = [UIColor colorWithHex:0x529900];
        // don't want the 'disabled' flavor of the green color
        enabled = YES;
        interactionEnabled = NO;

    } else {
        title = ARBidButtonRegisterStateTitle;
    }

    [self setTitle:title forState:UIControlStateNormal];
    [self setBackgroundColor:backgroundColor forState:UIControlStateNormal];
    [self setBorderColor:backgroundColor forState:UIControlStateNormal];
    [self setEnabled:enabled animated:YES];
    [self setUserInteractionEnabled:interactionEnabled];
}

- (void)setAuctionState:(ARAuctionState)state
{
    [self setAuctionState:state animated:true];
}

@end
