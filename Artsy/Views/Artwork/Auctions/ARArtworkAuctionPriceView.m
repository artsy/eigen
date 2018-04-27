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
    ARArtworkPriceRowView *row = [[ARArtworkPriceRowView alloc] initWithFrame:CGRectZero];
    BOOL hasBids = saleArtwork.auctionState & ARAuctionStateArtworkHasBids;
    row.messageLabel.text = hasBids ? @"Current bid" : @"Starting Bid";
    row.messageLabel.font = [UIFont serifSemiBoldFontWithSize:18];

    NSNumber *cents = hasBids ? saleArtwork.saleHighestBid.cents : saleArtwork.openingBidCents;
    row.priceLabel.text = [SaleArtwork dollarsFromCents:cents currencySymbol:saleArtwork.currencySymbol];
    row.priceLabel.font = [UIFont serifSemiBoldFontWithSize:18];

    row.margin = 16;
    [self addSubview:row withTopMargin:@"26" sideMargin:@"0"];
    [row alignLeadingEdgeWithView:self predicate:@"0"];
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    [self drawTopSolidBorderWithColor:[UIColor artsyGrayRegular]];
}

@end
