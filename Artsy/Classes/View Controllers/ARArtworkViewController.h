#import "ARInquireForArtworkViewController.h"

@interface ARArtworkViewController : UIViewController

/// Designated initializer
- (instancetype)initWithArtworkID:(NSString *)artworkID fair:(Fair *)fair;
- (instancetype)initWithArtwork:(Artwork *)artwork fair:(Fair *)fair;

/// The artwork this VC represents
@property (nonatomic, strong, readonly) Artwork *artwork;
@property (nonatomic, strong, readonly) Fair *fair;
@property (nonatomic, assign, readwrite) BOOL shouldAnimate;

/// The index in the current set of artworks
@property (nonatomic, assign) NSInteger index;

/// The imageview for the artwork preview, used in transitions
- (UIImageView *)imageView;

/// The current offset that should be applied to the imageview
- (CGPoint)imageViewOffset;

// Triggers actions based on when scrolling has settled
- (void)setHasFinishedScrolling;

- (NSString *)inquiryURLRepresentation;


@end
