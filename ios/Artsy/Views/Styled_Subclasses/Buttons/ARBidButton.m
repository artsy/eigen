#import "ARBidButton.h"

#import "ARFonts.h"

#import <EDColor/EDColor.h>

NSString *const ARBidButtonRegisterStateTitle = @"REGISTER TO BID";
NSString *const ARBidButtonRegisteredStateTitle = @"YOU ARE REGISTERED TO BID";
NSString *const ARBidBUttonBidStateTitle = @"BID";
NSString *const ARBidButtonBiddingOpenStateTitle = ARBidBUttonBidStateTitle;
NSString *const ARBidButtonBiddingClosedStateTitle = @"BIDDING CLOSED";
NSString *const ARBidButtonRegistionPendingStateTitle = @"REGISTRATION PENDING";
NSString *const ARBidButtonRegistionClosedStateTitle = @"REGISTRATION CLOSED";


@implementation ARBidButton

- (void)setup
{
    [super setup];

    self.titleLabel.font = [UIFont displayMediumSansSerifFontWithSize:14];
    [self setTitleColor:[UIColor whiteColor] forState:UIControlStateHighlighted];
    [self setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];

    [self setBackgroundColor:[UIColor blackColor] forState:UIControlStateNormal animated:NO];

    self.shouldDimWhenDisabled = NO;
}

- (CGSize)intrinsicContentSize
{
    return (CGSize){280, 46};
}

- (void)setAuctionState:(ARAuctionState)state animated:(BOOL)animated
{
    [self setAuctionState:state animated:animated intent:ARBidButtonIntentRegister];
}

- (void)setAuctionState:(ARAuctionState)state animated:(BOOL)animated intent:(ARBidButtonIntent)intent
{
    NSString *title = nil;
    UIColor *backgroundColor = [UIColor blackColor];
    BOOL enabled = YES;
    BOOL interactionEnabled = YES;

    if (state & ARAuctionStateEnded) {
        title = ARBidButtonBiddingClosedStateTitle;
        backgroundColor = [UIColor colorWithHex:0xE5E5E5];
        self.shouldAnimateStateChange = NO;
        enabled = NO;
    } else if (state & ARAuctionStateUserPendingRegistration) {
        title = ARBidButtonRegistionPendingStateTitle;
        backgroundColor = [UIColor colorWithHex:0xE5E5E5];
        self.shouldAnimateStateChange = NO;
        enabled = NO;
    } else if (state & ARAuctionStateUserRegistrationClosed) {
        title = ARBidButtonRegistionClosedStateTitle;
        backgroundColor = [UIColor colorWithHex:0xE5E5E5];
        self.shouldAnimateStateChange = NO;
        enabled = NO;
    } else if (state & ARAuctionStateStarted && state & ARAuctionStateUserIsRegistered) {
        title = ARBidButtonBiddingOpenStateTitle;
    } else if (state & ARAuctionStateUserIsRegistered) {
        title = ARBidButtonRegisteredStateTitle;
        // TODO: replace with a standard artsy color
        backgroundColor = [UIColor colorWithHex:0x529900];
        // don't want the 'disabled' flavor of the green color
        enabled = YES;
        interactionEnabled = NO;

    } else {
        // We've gotten to the end, this is the default button configuration. It depends on our intent.
        if (intent == ARBidButtonIntentRegister) {
            title = ARBidButtonRegisterStateTitle;
        } else if (intent == ARBidButtonIntentBid) {
            title = ARBidBUttonBidStateTitle;
        }
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
