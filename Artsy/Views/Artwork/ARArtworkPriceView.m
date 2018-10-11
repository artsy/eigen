#import "ARArtworkPriceView.h"

#import "Artwork.h"
#import "ARArtworkPriceRowView.h"

#import "ARFonts.h"
#import <Artsy+UILabels/UIView+ARDrawing.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>


@interface ARArtworkPriceView ()
@end


@implementation ARArtworkPriceView

- (id)initWithFrame:(CGRect)frame
{
    if ((self = [super initWithFrame:frame])) {
        self.bottomMarginHeight = 0;
    }
    return self;
}

- (void)addContactForPrice
{
    ARArtworkPriceRowView *row = [[ARArtworkPriceRowView alloc] initWithFrame:CGRectZero];
    row.messageLabel.font = [UIFont serifBoldFontWithSize:22];
    row.messageLabel.text = @"Contact for Price";
    [self addSubview:row withTopMargin:@"16" sideMargin:@"0"];
    [row alignLeadingEdgeWithView:self predicate:@"0"];
}


- (void)addShippingDetails:(Artwork *)artwork
{
    if (artwork.shippingInfo) {
        ARArtworkPriceRowView *row = [[ARArtworkPriceRowView alloc] initWithFrame:CGRectZero];
        row.messageLabel.text = artwork.shippingInfo;
        row.messageLabel.font = [UIFont displaySansSerifFontWithSize:12];
        row.messageLabel.textColor = [UIColor artsyGraySemibold];
        [self addSubview:row withTopMargin:@"8" sideMargin:@"0"];
        [row alignLeadingEdgeWithView:self predicate:@"0"];
    }

    if (artwork.shippingOrigin) {
        ARArtworkPriceRowView *row = [[ARArtworkPriceRowView alloc] initWithFrame:CGRectZero];
        row.messageLabel.text = [NSString stringWithFormat:@"Ships from %@", artwork.shippingOrigin];
        row.messageLabel.font = [UIFont displaySansSerifFontWithSize:12];
        row.messageLabel.textColor = [UIColor artsyGraySemibold];
        NSString *topMargin = artwork.shippingInfo ? @"0" : @"8";
        [self addSubview:row withTopMargin:topMargin sideMargin:@"0"];
        [row alignLeadingEdgeWithView:self predicate:@"0"];
    }
}

- (void)updatePriceWithArtwork:(Artwork *)artwork andSaleArtwork:(SaleArtwork *)saleArtwork
{
    ARArtworkPriceRowView *row = [[ARArtworkPriceRowView alloc] initWithFrame:CGRectZero];

    if (artwork.sold.boolValue) {
        row.messageLabel.text = @"Sold";
    } else {
        row.messageLabel.text = artwork.price;
    }

    row.messageLabel.font = [UIFont serifBoldFontWithSize:22];
    [self addSubview:row withTopMargin:@"16" sideMargin:@"0"];
    [row alignLeadingEdgeWithView:self predicate:@"0"];
}

- (void)setBounds:(CGRect)bounds
{
    [super setBounds:bounds];
    [self drawDottedBorders];
}

@end
