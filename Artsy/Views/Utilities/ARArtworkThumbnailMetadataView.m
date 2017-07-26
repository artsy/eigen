#import "ARArtworkThumbnailMetadataView.h"

#import "Artist.h"
#import "Artwork.h"
#import "ARFonts.h"
#import "Artsy-Swift.h"

#import "UIDevice-Hardware.h"

#import <ObjectiveSugar/ObjectiveSugar.h>

static CGFloat ARMetadataFontSize;


@interface ARArtworkThumbnailMetadataView ()

@property (nonatomic, strong) ARSerifLabel *primaryLabel;
@property (nonatomic, strong) ARArtworkTitleLabel *secondaryLabel;
@property (nonatomic, strong) ARSerifLabel *priceLabel;
@property (nonatomic, strong) UIImageView *paddleImageView;

@property (nonatomic, assign) ARArtworkWithMetadataThumbnailCellPriceInfoMode mode;
@property (nonatomic, assign) BOOL showPaddle;

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
    _showPaddle = NO;

    _paddleImageView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"paddle"]];
    [self addSubview:_paddleImageView];

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

    switch (self.mode) {
        case ARArtworkWithMetadataThumbnailCellPriceInfoModeAuctionInfo:
            labelFrame.size.height /= 3;

            self.primaryLabel.frame = labelFrame;
            labelFrame.origin.y = labelFrame.size.height;
            self.secondaryLabel.frame = labelFrame;
            labelFrame.origin.y += labelFrame.size.height;
            if (self.showPaddle) {
                labelFrame.origin.x += 8;
                self.paddleImageView.hidden = NO;
                self.paddleImageView.frame = CGRectMake(self.bounds.origin.x, labelFrame.origin.y+2, 6, 9);
            }
            self.priceLabel.frame = labelFrame;

            break;
        case ARArtworkWithMetadataThumbnailCellPriceInfoModeSaleMessage:
            labelFrame.size.height /= 3;

            self.primaryLabel.frame = labelFrame;
            labelFrame.origin.y = labelFrame.size.height;
            self.secondaryLabel.frame = labelFrame;
            labelFrame.origin.y += labelFrame.size.height;
            self.priceLabel.frame = labelFrame;

            break;
        case ARArtworkWithMetadataThumbnailCellPriceInfoModeNone:
            labelFrame.size.height /= 2;

            self.primaryLabel.frame = labelFrame;
            labelFrame.origin.y = labelFrame.size.height;
            self.secondaryLabel.frame = labelFrame;

            break;
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
            SaleArtwork *saleArtwork = [artwork saleArtwork];
            NSAssert(saleArtwork, @"Tried to display auction info but sale artwork was missing.");
            if (artwork.auction.saleState == SaleStateClosed) {
                self.priceLabel.text = @"Auction closed";
            } else {
                SaleArtworkViewModel *saleArtworkViewModel = [[SaleArtworkViewModel alloc] initWithSaleArtwork:saleArtwork];
                self.priceLabel.text = [saleArtworkViewModel currentOrStartingBidWithNumberOfBids:YES];
                self.showPaddle = YES;
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

    self.mode = mode;
}

- (void)resetLabels
{
    self.primaryLabel.text = nil;
    [self.secondaryLabel setTitle:@"" date:nil];
    self.priceLabel.text = nil;
    self.paddleImageView.hidden = YES;
    self.showPaddle = NO;
}

@end
