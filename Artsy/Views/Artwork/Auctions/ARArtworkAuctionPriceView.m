#import "ARArtworkAuctionPriceView.h"

#import "ARArtworkPriceRowView.h"
#import "ARFonts.h"
#import "SaleArtwork.h"

#import <Artsy_UILabels/UIView+ARDrawing.h>
#import <Artsy_UILabels/NSNumberFormatter+ARCurrency.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


@implementation ARArtworkAuctionPriceView

- (void)updateWithSaleArtwork:(SaleArtwork *)saleArtwork
{
    ARArtworkPriceRowView *row = [[ARArtworkPriceRowView alloc] initWithFrame:CGRectZero];
    BOOL hasBids = saleArtwork.auctionState & ARAuctionStateArtworkHasBids;
    row.messageLabel.text = hasBids ? @"Current Bid:" : @"Starting Bid:";
    row.messageLabel.font = [UIFont serifSemiBoldFontWithSize:16];

    NSNumber *cents = hasBids ? saleArtwork.saleHighestBid.cents : saleArtwork.openingBidCents;
    row.priceLabel.text = [SaleArtwork dollarsFromCents:cents currencySymbol:saleArtwork.currencySymbol];
    row.priceLabel.font = [UIFont sansSerifFontWithSize:24];

    row.margin = 16;
    [self addSubview:row withTopMargin:@"0" sideMargin:@"0"];
    [row alignLeadingEdgeWithView:self predicate:@"0"];

    row.bidStatusText = [self statusMessageForSaleArtwork:saleArtwork];
}

- (NSString *)statusMessageForSaleArtwork:(SaleArtwork *)saleArtwork
{
    ARReserveStatus reserveStatus = saleArtwork.reserveStatus;

    NSInteger bidCount = saleArtwork.artworkNumPositions.integerValue;
    NSString *bids = bidCount > 1 ? @"Bids" : @"Bid";
    BOOL startedAuction = saleArtwork.auctionState & ARAuctionStateStarted;

    if (bidCount && reserveStatus == ARReserveStatusReserveNotMet) {
        return [NSString stringWithFormat:@"(%@ %@, Reserve not met)", @(bidCount), bids];
    } else if (bidCount && (reserveStatus == ARReserveStatusNoReserve || reserveStatus == ARReserveStatusUnknown)) {
        return [NSString stringWithFormat:@"(%@ %@)", @(bidCount), bids];
    } else if (bidCount && reserveStatus == ARReserveStatusReserveMet) {
        return [NSString stringWithFormat:@"(%@ %@, Reserve met)", @(bidCount), bids];
    } else if (reserveStatus == ARReserveStatusReserveNotMet) {
        return startedAuction ? @"This work has a reserve" : @"(This work has a reserve)";
    } else {
        return nil;
    }
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    [self drawDottedBorders];
}
@end
