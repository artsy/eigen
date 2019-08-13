#import "ARArtworkDetailView.h"
#import "ARArtworkActionsView.h"

@class ArtsyEcho;

@interface ARLegacyArtworkViewController : UIViewController <ARArtworkActionsViewDelegate, ARArtworkDetailViewDelegate>

/// Designated initializer
- (instancetype)initWithArtworkID:(NSString *)artworkID fair:(Fair *)fair;
- (instancetype)initWithArtwork:(Artwork *)artwork fair:(Fair *)fair;

/// The artwork this VC represents
@property (nonatomic, strong, readonly) Artwork *artwork;
@property (nonatomic, strong, readonly) Fair *fair;

/// Echo config. Useful for unit testing.
@property (nonatomic, strong, readonly) ArtsyEcho *echo;

/// The imageview for the artwork preview, used in transitions
- (UIImageView *)imageView;

/// The current offset that should be applied to the imageview
- (CGPoint)imageViewOffset;

/// Triggers actions based on when scrolling has settled
- (void)setHasFinishedScrolling;

- (NSString *)inquiryURLRepresentation;


@end
