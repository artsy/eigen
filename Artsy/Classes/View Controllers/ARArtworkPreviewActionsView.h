@class ARHeartButton, ARArtworkInfoButton;

/// Presents buttons for an artwork
@interface ARArtworkPreviewActionsView : UIView

/// Creates an instance, does not retain artwork but registers for updates
- (instancetype)initWithArtwork:(Artwork *)artwork andFair:(Fair *)fair;

@end
