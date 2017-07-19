#import "ARArtworkThumbnailMetadataView.h"

#import "Artist.h"
#import "Artwork.h"
#import "ARFonts.h"

#import "UIDevice-Hardware.h"

#import <ObjectiveSugar/ObjectiveSugar.h>

static CGFloat ARMetadataFontSize;


@interface ARArtworkThumbnailMetadataView ()

@property (nonatomic, strong) ARSerifLabel *primaryLabel;
@property (nonatomic, strong) ARArtworkTitleLabel *secondaryLabel;
@property (nonatomic, strong) ARSerifLabel *priceLabel;

@end


@implementation ARArtworkThumbnailMetadataView

+ (void)initialize
{
    [super initialize];
    ARMetadataFontSize = [UIDevice isPad] ? 15 : 12;
}

+ (CGFloat)heightForMargin
{
    return 8;
}

- (instancetype)init
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _primaryLabel = [[ARSerifLabel alloc] init];
    _secondaryLabel = [[ARArtworkTitleLabel alloc] init];
    _secondaryLabel.lineHeight = 1;
    _secondaryLabel.numberOfLines = 1;
    _priceLabel = [[ARSerifLabel alloc] init];

    [@[ self.primaryLabel, self.secondaryLabel, self.priceLabel ] each:^(UILabel *label) {
        label.font = [label.font fontWithSize:ARMetadataFontSize];
        label.textColor = [UIColor artsyGraySemibold];
        [self addSubview:label];
    }];

    return self;
}

- (CGSize)intrinsicContentSize
{
    return (CGSize){UIViewNoIntrinsicMetric, self.frame.size.height};
}

- (void)layoutSubviews
{
    [super layoutSubviews];

    CGRect labelFrame = self.bounds;

    if (self.showPrice) {
        labelFrame.size.height /= 3;

        self.primaryLabel.frame = labelFrame;
        labelFrame.origin.y = labelFrame.size.height;
        self.secondaryLabel.frame = labelFrame;
        labelFrame.origin.y += labelFrame.size.height;
        self.priceLabel.frame = labelFrame;

    } else {
        labelFrame.size.height /= 2;

        self.primaryLabel.frame = labelFrame;
        labelFrame.origin.y = labelFrame.size.height;
        self.secondaryLabel.frame = labelFrame;
    }
}

- (void)configureWithArtwork:(Artwork *)artwork priceInfoMode:(ARArtworkWithMetadataThumbnailCellPriceInfoMode)mode
{
    self.primaryLabel.text = artwork.artist.name;
    [self.secondaryLabel setTitle:artwork.title date:artwork.date];

    // this ensures the title is properly truncated after the custom setter above
    self.secondaryLabel.adjustsFontSizeToFitWidth = NO;
    self.secondaryLabel.lineBreakMode = NSLineBreakByTruncatingTail;

    switch (mode) {
        case ARArtworkWithMetadataThumbnailCellPriceInfoModeAuctionInfo: {
            SaleArtwork *saleArtwork = [artwork mostRecentSaleArtwork];
            NSAssert(saleArtwork, @"Tried to display auction info but sale artwork was missing.");
            if (artwork.auction.saleState == SaleStateClosed) {
                self.priceLabel.text = @"Auction closed";
            } else {
                // TODO: Show paddle, current/starting bid, etc.
            }
            break;
        }
        case ARArtworkWithMetadataThumbnailCellPriceInfoModeSaleMessage:
            self.priceLabel.text = artwork.saleMessage;
            break;
        case ARArtworkWithMetadataThumbnailCellPriceInfoModeNone:
            // nop
            break;
    }

    self.showPrice = (mode != ARArtworkWithMetadataThumbnailCellPriceInfoModeNone);
}

- (void)resetLabels
{
    self.primaryLabel.text = nil;
    [self.secondaryLabel setTitle:@"" date:nil];
    self.priceLabel.text = nil;
}

@end
