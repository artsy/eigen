#import <UIKit/UIKit.h>


@class Artwork, ARHeartButton, ARArtworkInfoButton, Fair;

@protocol ARArtworkPreviewActionsViewDelegate <NSObject>

- (void)showInformationBannerForVIR:(UIView *)virButton;
- (void)tappedArtworkFavorite:(id)sender;
- (void)tappedArtworkShare:(id)sender;
- (void)tappedArtworkViewInRoom;

@end

/// Presents buttons for an artwork
@interface ARArtworkPreviewActionsView : UIView

/// Creates an instance, does not retain artwork but registers for updates
- (instancetype)initWithArtwork:(Artwork *)artwork andFair:(Fair *)fair modern:(BOOL)modern;

@property (nonatomic, weak) id<ARArtworkPreviewActionsViewDelegate> delegate;

/// Should the icons be centered instead of from trailing -> leading, and
/// removes the black circle around the button
@property (nonatomic, assign, readonly) BOOL modern;

@end
