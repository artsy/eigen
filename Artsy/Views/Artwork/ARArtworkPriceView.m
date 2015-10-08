#import "ARArtworkPriceView.h"
#import "ARArtworkPriceRowView.h"
#import <Artsy+UILabels/UIView+ARDrawing.h>


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
    row.priceLabel.font = [UIFont serifItalicFontWithSize:row.priceLabel.font.pointSize];
    row.messageLabel.text = @"Price:";
    row.priceLabel.text = @"Contact for Price";
    row.margin = 16;
    [self addSubview:row withTopMargin:@"0" sideMargin:@"0"];
    [row alignLeadingEdgeWithView:self predicate:@"0"];
}

- (void)addNotForSaleLabel
{
    ARArtworkPriceRowView *row = [[ARArtworkPriceRowView alloc] initWithFrame:CGRectZero];
    row.messageLabel.text = @"Work is Not for Sale";
    row.margin = 16;
    [self addSubview:row withTopMargin:@"0" sideMargin:@"0"];
    [row alignLeadingEdgeWithView:self predicate:@"0"];
}

- (void)updatePriceWithArtwork:(Artwork *)artwork andSaleArtwork:(SaleArtwork *)saleArtwork
{
    ARArtworkPriceRowView *row = [[ARArtworkPriceRowView alloc] initWithFrame:CGRectZero];

    if (artwork.sold.boolValue) {
        row.messageLabel.textColor = [UIColor artsyRed];
        row.messageLabel.font = [UIFont sansSerifFontWithSize:row.messageLabel.font.pointSize];
        row.messageLabel.text = @"SOLD";
    } else {
        if (saleArtwork != nil) {
            row.messageLabel.text = @"Buy Now Price:";
        } else {
            row.messageLabel.text = @"Price:";
        }
    }

    if (saleArtwork != nil) {
        row.priceLabel.font = [UIFont sansSerifFontWithSize:24];
    }

    row.priceLabel.text = artwork.price;

    row.margin = artwork.sold.boolValue ? 10 : 16;
    [self addSubview:row withTopMargin:@"0" sideMargin:@"0"];
    [row alignLeadingEdgeWithView:self predicate:@"0"];
}

- (void)setBounds:(CGRect)bounds
{
    [super setBounds:bounds];
    [self drawDottedBorders];
}

@end
