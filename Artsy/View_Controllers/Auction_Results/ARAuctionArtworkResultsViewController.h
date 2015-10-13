@class Artwork;

/// Presents the related auction results for an artwork
@interface ARAuctionArtworkResultsViewController : UITableViewController

/// Designated initializer
- (instancetype)initWithArtwork:(Artwork *)artwork;

/// Artwork that the auction results controller represents
@property (nonatomic, strong, readonly) Artwork *artwork;

@end
