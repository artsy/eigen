#import "ARPostAttachment.h"

@interface ARArtworkThumbnailMetadataView : UIView

+ (CGFloat)heightForView;
- (void)configureWithArtwork:(Artwork *)artwork;
- (void)resetLabels;

@end
