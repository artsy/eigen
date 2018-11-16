// Running out of names.

/// Contains a device agnostic view of the Artwork
/// preview images, action buttons, details & for sale messaages

#import <ORStackView/ORStackView.h>
#import "ARArtworkDetailView.h"
#import "ARArtworkActionsView.h"
#import "ARArtworkPreviewImageView.h"
#import "ARArtworkPreviewActionsView.h"

@class ARArtworkMetadataView;


@interface ARArtworkMetadataView : UIView

- (instancetype)initWithArtwork:(Artwork *)artwork andFair:(Fair *)fair NS_DESIGNATED_INITIALIZER;;
- (void)updateWithFair:(Fair *)fair;
- (void)updateConstraintsIsLandscape:(BOOL)isLandscape;

- (UIImageView *)imageView;

- (void)setDelegate:(id<ARArtworkDetailViewDelegate, ARArtworkDetailViewButtonDelegate, ARArtworkActionsViewDelegate, ARArtworkActionsViewButtonDelegate, ARArtworkPreviewImageViewDelegate, ARArtworkPreviewActionsViewDelegate>)delegate;

- (void)updateUIForSaleArtwork:(SaleArtwork *)saleArtwork;
- (void)showActionsViewSpinner;

@property (nonatomic, strong, readonly) UIView *left;
@property (nonatomic, strong, readonly) UIView *right;

@property (nonatomic, strong) ARArtworkPreviewActionsView *artworkPreviewActions;
@property (nonatomic, strong) ARArtworkPreviewImageView *artworkPreview;
@property (nonatomic, strong) ARArtworkActionsView *actionsView;
@property (nonatomic, strong) ARArtworkDetailView *artworkDetailView;

/// TODO: Make this a view controller so that we can negate doing this.
/// Let subviews know that we're in a fair context
@property (readwrite, nonatomic) Fair *fair;

@end
