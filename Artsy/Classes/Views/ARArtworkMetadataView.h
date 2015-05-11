// Running out of names.

/// Contains a device agnostic view of the Artwork
/// preview images, action buttons, details & for sale messaages

#import <ORStackView/ORStackView.h>
#import "ARArtworkDetailView.h"
#import "ARArtworkActionsView.h"

@class ARArtworkMetadataView;

@protocol ARArtworkMetadataViewDelegate <NSObject>

- (void)artworkMetadataView:(ARArtworkMetadataView *)metadataView shouldPresentViewController:(UIViewController *)viewController;
- (void)artworkMetadataView:(ARArtworkMetadataView *)metadataView didUpdateArtworkDetailView:(ARArtworkDetailView *)detailView;
- (void)artworkMetadataView:(ARArtworkMetadataView *)metadataView didUpdateArtworkActionsView:(ARArtworkActionsView *)actionsView;

@end

@interface ARArtworkMetadataView : UIView

- (instancetype)initWithArtwork:(Artwork *)artwork andFair:(Fair *)fair;
- (void)updateWithFair:(Fair *)fair;
- (void)updateConstraintsIsLandscape:(BOOL)isLandscape;

- (UIImageView *)imageView;

/// TODO: Make this a view controller so that we can negate doing this.
/// Let subviews know that we're in a fair context
@property (readwrite, nonatomic) Fair *fair;

@property (nonatomic, weak) id<ARArtworkMetadataViewDelegate> delegate;

@end
