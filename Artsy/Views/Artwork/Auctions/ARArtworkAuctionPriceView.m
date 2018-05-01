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
    // There's a lot of tricky logic in this method, let's declare all our variables upfront.
    BOOL hasBids = saleArtwork.auctionState & ARAuctionStateArtworkHasBids;
    BOOL hasUserBid = (saleArtwork.auctionState & ARAuctionStateUserIsBidder);
    BOOL isUserHighestBidder = (saleArtwork.auctionState & ARAuctionStateUserIsHighBidder);
    NSInteger bidCount = saleArtwork.artworkNumPositions.integerValue;
    BOOL hasReserve = saleArtwork.reserveStatus != ARReserveStatusNoReserve;
    BOOL isReserveMet = saleArtwork.reserveStatus == ARReserveStatusReserveMet;

    ARArtworkPriceRowView *currentOrStartingBidRow = [[ARArtworkPriceRowView alloc] initWithFrame:CGRectZero];
    currentOrStartingBidRow.messageLabel.text = hasBids ? @"Current bid" : @"Starting bid";
    currentOrStartingBidRow.messageLabel.font = [UIFont serifSemiBoldFontWithSize:18];

    NSNumber *currentOrtStartingBidCents = hasBids ? saleArtwork.saleHighestBid.cents : saleArtwork.openingBidCents;
    currentOrStartingBidRow.priceLabel.text = [SaleArtwork dollarsFromCents:currentOrtStartingBidCents currencySymbol:saleArtwork.currencySymbol];
    currentOrStartingBidRow.priceLabel.font = [UIFont serifSemiBoldFontWithSize:18];

    [self addSubview:currentOrStartingBidRow withTopMargin:@"28" sideMargin:@"0"];
    [currentOrStartingBidRow alignLeadingEdgeWithView:self predicate:@"0"];

    // Set the green check / red x accessory image.
    if (hasUserBid) {
        if (isUserHighestBidder && isReserveMet) {
            currentOrStartingBidRow.priceAccessoryImage = [UIImage imageNamed:@"CircleCheckGreen"];
        } else {
            // Infer here that the user has been outbid or the reserve is not met.
            currentOrStartingBidRow.priceAccessoryImage = [UIImage imageNamed:@"CircleXRed"];
        }
    }

    // The logic for displaying the supplementary view is a bit tricky, but generally we want to display it if one of
    // the following conditions is met.
    if (hasBids || hasReserve || hasUserBid) {
        ARArtworkPriceRowView *supplementaryInfoRow = [[ARArtworkPriceRowView alloc] initWithFrame:CGRectZero];
        supplementaryInfoRow.messageLabel.font = [UIFont displaySansSerifFontWithSize:10];
        supplementaryInfoRow.priceLabel.font = supplementaryInfoRow.messageLabel.font;
        supplementaryInfoRow.messageLabel.textColor = [UIColor artsyGraySemibold];
        supplementaryInfoRow.priceLabel.textColor = supplementaryInfoRow.messageLabel.textColor;

        // Let's take care of the left side first, which is # of bids and/or reserve status.
        if (hasBids) {
            NSString *bids = bidCount > 1 ? @"bids" : @"bid";
            if (hasReserve) {
                if (isReserveMet) {
                    supplementaryInfoRow.messageLabel.text = [NSString stringWithFormat:@"%@ %@, reserve met.", @(bidCount), bids];
                } else {
                    supplementaryInfoRow.messageLabel.text = [NSString stringWithFormat:@"%@ %@, reserve not met.", @(bidCount), bids];
                    supplementaryInfoRow.messageLabel.textColor = [UIColor artsyRedRegular];
                }
            } else {
                supplementaryInfoRow.messageLabel.text = [NSString stringWithFormat:@"%@ %@", @(bidCount), bids];
            }
        } else {
            if (isReserveMet) {
                // We're unlikely to have a lot with no bids but whose reserve is met, but let's handle it just in case.
                supplementaryInfoRow.messageLabel.text = [NSString stringWithFormat:@"Reserve met."];
            } else {
                supplementaryInfoRow.messageLabel.text = [NSString stringWithFormat:@"This work has a reserve."];
            }
        }

        // Okay now let's do the right side, which is only the user's bid status.
        if (hasUserBid) {
            NSString *userMaxBidString = [SaleArtwork dollarsFromCents:saleArtwork.userMaxBidderPosition.maxBidAmountCents currencySymbol:saleArtwork.currencySymbol];
            supplementaryInfoRow.priceLabel.text = [NSString stringWithFormat:@"Your max bid: %@", userMaxBidString];
        }

        [self addSubview:supplementaryInfoRow withTopMargin:@"5" sideMargin:@"0"];
    }
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    [self drawTopSolidBorderWithColor:[UIColor artsyGrayRegular]];
}

@end
