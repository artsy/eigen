@class ARHeartButton, ARArtworkInfoButton;

@protocol ARArtworkPreviewActionsViewDelegate <NSObject>

- (void)tappedArtworkFavorite:(id)sender;
- (void)tappedArtworkShare:(id)sender;
- (void)tappedArtworkViewInRoom;
- (void)tappedArtworkViewInMap;

@end

/// Presents buttons for an artwork
@interface ARArtworkPreviewActionsView : UIView

/// Creates an instance, does not retain artwork but registers for updates
- (instancetype)initWithArtwork:(Artwork *)artwork andFair:(Fair *)fair;

@property (nonatomic, weak) id<ARArtworkPreviewActionsViewDelegate> delegate;

@end
