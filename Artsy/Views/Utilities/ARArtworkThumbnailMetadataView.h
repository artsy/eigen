#import "ARPostAttachment.h"
#import "ARCustomEigenLabels.h"

@class Artwork;

@interface ARArtworkThumbnailMetadataView : UIView

- (void)configureWithArtwork:(Artwork *)artwork showPriceLabel:(BOOL)showPrice;
- (void)resetLabels;

@property (nonatomic, readonly) ARSerifLabel *primaryLabel;
@property (nonatomic, readonly) ARArtworkTitleLabel *secondaryLabel;
@property (nonatomic, readonly) ARSerifLabel *priceLabel;
@property (nonatomic, assign) BOOL showPrice;

@end
