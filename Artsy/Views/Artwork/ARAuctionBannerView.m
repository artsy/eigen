#import "ARAuctionBannerView.h"

#import "ARFonts.h"

#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

@interface ARAuctionBannerView ()
@property (nonatomic) UILabel *label;
@property (nonatomic, strong) NSLayoutConstraint *heightConstraint;
@end


@implementation ARAuctionBannerView

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        UILabel *label = [[UILabel alloc] init];
        label.numberOfLines = 2;
        label.font = [UIFont serifFontWithSize:14];
        label.textAlignment = NSTextAlignmentCenter;
        [self addSubview:label];
        self.heightConstraint = [self constrainHeight:@"0@750"];
        [label setContentCompressionResistancePriority:300 forAxis:UILayoutConstraintAxisVertical];
        [label constrainWidthToView:self predicate:@"-40"];
        [label constrainHeightToView:self predicate:@"-40@500"];
        [label alignCenterWithView:self];
        label.text = nil;
        _label = label;
    }
    return self;
}

- (void)setAuctionState:(ARAuctionState)auctionState
{
    if (auctionState == _auctionState) {
        return;
    }
    _auctionState = auctionState;

    if (auctionState & ARAuctionStateEnded) {
        return;
    }

    if (auctionState & ARAuctionStateUserIsHighBidder) {
        self.backgroundColor = [UIColor artsyPurpleRegular];
        self.label.text = @"You are currently the high\nbidder for this lot.";
        self.label.textColor = [UIColor whiteColor];
    } else if (auctionState & ARAuctionStateUserIsBidder) {
        self.backgroundColor = [UIColor artsyYellowRegular];
        self.label.textColor = [UIColor blackColor];
        self.label.text = @"You’ve been outbid.\nPlease place another bid.";
    }
}

- (void)updateHeightConstraint
{
    self.heightConstraint.constant = self.label.text.length > 0 ? 69 : 0;
}
@end
