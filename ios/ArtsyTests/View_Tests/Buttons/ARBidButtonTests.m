#import "ARBidButton.h"

SpecBegin(ARBidButton);

__block ARBidButton *_button = nil;

beforeEach(^{
    _button = [[ARBidButton alloc] initWithFrame:CGRectMake(0, 0, 300, 46)];
});

it(@"register", ^{
    [_button setAuctionState:ARAuctionStateDefault animated:NO];

    expect(_button).to.haveValidSnapshotNamed(@"testRegisterState");
});

it(@"intent to bid", ^{
    [_button setAuctionState:ARAuctionStateDefault animated:NO intent:ARBidButtonIntentBid];

    expect(_button).to.haveValidSnapshotNamed(@"testRegisterForceBidState");
});

it(@"registered", ^{
    [_button setAuctionState:ARAuctionStateUserIsRegistered animated:NO];
    expect(_button).to.haveValidSnapshotNamed(@"testRegisteredState");
});

it(@"an open aution takes priority over registered bidding", ^{
    ARAuctionState state = ARAuctionStateDefault;
    state |= ARAuctionStateUserIsRegistered;
    state |= ARAuctionStateStarted;
    [_button setAuctionState:state animated:NO];
    expect(_button).to.haveValidSnapshot();
});

it(@"bidding open", ^{
    [_button setAuctionState:(ARAuctionStateStarted | ARAuctionStateUserIsRegistered) animated:NO];
    expect(_button).to.haveValidSnapshotNamed(@"testBiddingOpenState");
});

it(@"bidding closed", ^{
    [_button setAuctionState:ARAuctionStateEnded animated:NO];
    expect(_button).to.haveValidSnapshotNamed(@"testBiddingClosedState");
});

it(@"bidding registration pending", ^{
    [_button setAuctionState:ARAuctionStateUserPendingRegistration animated:NO];
    expect(_button).to.haveValidSnapshotNamed(@"testBiddingRegistrationPending");
});

it(@"bidding registration closed", ^{
    [_button setAuctionState:ARAuctionStateUserRegistrationClosed animated:NO];
    expect(_button).to.haveValidSnapshotNamed(@"testBiddingRegistrationClosed");
});


SpecEnd;
