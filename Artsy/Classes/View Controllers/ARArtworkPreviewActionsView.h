@class ARHeartButton, ARArtworkInfoButton;

/// Presents buttons for an artwork

@interface ARArtworkPreviewActionsView : UIView

/// Creates an instance, does not retain artwork but registers for updates
- (instancetype)initWithArtwork:(Artwork *)artwork andFair:(Fair *)fair;

/// The button for indicating you're favoriting a work
@property (readonly, nonatomic, strong) ARHeartButton *favoriteButton;

/// The button for sharing a work over airplay / twitter / fb
@property (readonly, nonatomic, strong) ARCircularActionButton *shareButton;

/// The button for viewing a room, initially hidden, only available
/// if the Artwork can be viewed in a room.
@property (readonly, nonatomic, strong) ARCircularActionButton *viewInRoomButton;

/// The button for showing the map, initially hidden, only available
/// if in a fair context
@property (readonly, nonatomic, strong) ARCircularActionButton *viewInMapButton;

@end
