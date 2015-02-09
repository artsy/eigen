/// Handles presenting an artwork and dealing with some of the simpler interactions

extern const CGFloat ARiPadPreviewImageWidth;
extern const CGFloat AconstRiPhonePreviewImageWidth;

@interface ARArtworkPreviewImageView : UIImageView

/// The artwork for showing, triggers loading the image and invalidates layout
@property (nonatomic, strong) Artwork *artwork;

/// Provide an idea of the size this view will want to set its intrinsic size from
@property (nonatomic, assign) CGSize outerBounds;

@end
