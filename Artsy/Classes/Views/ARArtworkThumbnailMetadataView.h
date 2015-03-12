#import "ARPostAttachment.h"

@interface ARArtworkThumbnailMetadataView : UIView

+ (CGFloat)heightForView;
- (void)configureWithArtwork:(Artwork *)artwork;
- (void)resetLabels;

@property (nonatomic, readonly) ARSerifLabel *primaryLabel;
@property (nonatomic, readonly) ARArtworkTitleLabel *secondaryLabel;

@end
