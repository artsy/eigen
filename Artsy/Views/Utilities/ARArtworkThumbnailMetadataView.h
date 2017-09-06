#import "ARPostAttachment.h"
#import "ARCustomEigenLabels.h"
#import "ARArtworkWithMetadataThumbnailCell.h"

@class Artwork;

@interface ARArtworkThumbnailMetadataView : UIView

- (void)configureWithArtwork:(Artwork *)artwork priceInfoMode:(ARArtworkWithMetadataThumbnailCellPriceInfoMode)mode;
- (void)resetLabels;

@property (nonatomic, readonly) ARSerifLabel *primaryLabel;
@property (nonatomic, readonly) ARArtworkTitleLabel *secondaryLabel;
@property (nonatomic, readonly) ARSerifLabel *priceLabel;

@end
