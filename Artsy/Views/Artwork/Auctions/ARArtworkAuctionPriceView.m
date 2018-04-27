#import "ARArtworkAuctionPriceView.h"

#import "ARArtworkPriceRowView.h"
#import "ARFonts.h"
#import "SaleArtwork.h"

#import <Artsy+UILabels/UIView+ARDrawing.h>
#import <Artsy+UILabels/NSNumberFormatter+ARCurrency.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


@implementation ARArtworkAuctionPriceView

- (void)updateWithSaleArtwork:(SaleArtwork *)saleArtwork
{
    ARArtworkPriceRowView *currentOrStartingBidRow = [[ARArtworkPriceRowView alloc] initWithFrame:CGRectZero];
    BOOL hasBids = saleArtwork.auctionState & ARAuctionStateArtworkHasBids;
    currentOrStartingBidRow.messageLabel.text = hasBids ? @"Current bid" : @"Starting Bid";
    currentOrStartingBidRow.messageLabel.font = [UIFont serifSemiBoldFontWithSize:18];

    NSNumber *currentOrtStartingBidCents = hasBids ? saleArtwork.saleHighestBid.cents : saleArtwork.openingBidCents;
    currentOrStartingBidRow.priceLabel.text = [SaleArtwork dollarsFromCents:currentOrtStartingBidCents currencySymbol:saleArtwork.currencySymbol];
    currentOrStartingBidRow.priceLabel.font = [UIFont serifSemiBoldFontWithSize:18];

    currentOrStartingBidRow.margin = 16;
    [self addSubview:currentOrStartingBidRow withTopMargin:@"19" sideMargin:@"0"];
    [currentOrStartingBidRow alignLeadingEdgeWithView:self predicate:@"0"];

    if (saleArtwork.auctionState & ARAuctionStateUserIsBidder) {
        ARArtworkPriceRowView *userMaxBidRow = [[ARArtworkPriceRowView alloc] initWithFrame:CGRectZero];
        userMaxBidRow.messageLabel.text = @"Your max bid";
        userMaxBidRow.messageLabel.font = [UIFont serifSemiBoldFontWithSize:18];

        userMaxBidRow.priceLabel.text = [SaleArtwork dollarsFromCents:saleArtwork.userMaxBidderPosition.maxBidAmountCents currencySymbol:saleArtwork.currencySymbol];
        userMaxBidRow.priceLabel.font = [UIFont serifSemiBoldFontWithSize:18];

        if (saleArtwork.auctionState & ARAuctionStateUserIsHighBidder) {
            userMaxBidRow.priceLabel.textColor = [UIColor artsyGreenRegular];
            userMaxBidRow.priceAccessoryImage = [UIImage imageNamed:@"CircleCheckGreen"];
        } else {
            userMaxBidRow.priceLabel.textColor = [UIColor artsyRedRegular];
            userMaxBidRow.priceAccessoryImage = [UIImage imageNamed:@"CircleXRed"];
        }

        [self addSubview:userMaxBidRow withTopMargin:@"19" sideMargin:@"0"];
    }
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    [self drawTopSolidBorderWithColor:[UIColor artsyGrayRegular]];
}

@end
