@class ARHeartButton, ARArtworkInfoButton;

/// Presents buttons for an artwork

typedef NS_ENUM(NSInteger, ARArtworkPreviewActionsStyle) {
    ARArtworkPreviewActionsStyleRight,
    ARArtworkPreviewActionsStyleCenter
};

@interface ARArtworkPreviewActionsView : UIView

/// Creates an instance, does not retain artwork but registers for updates
- (instancetype)initWithArtwork:(Artwork *)artwork andFair:(Fair *)fair;

/// Aligns the buttons to the right, or in the center of a resizeable view.
@property (nonatomic, readwrite) ARArtworkPreviewActionsStyle style;

@end
