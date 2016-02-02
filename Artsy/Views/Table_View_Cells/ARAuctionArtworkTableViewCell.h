#import <UIKit/UIKit.h>

/// A cell for showing an auction result, either from an artwork
/// or from a auction lot.

@class Artwork, AuctionLot;

@interface ARAuctionArtworkTableViewCell : UITableViewCell

/// provides the cell with updated information from a lot
- (void)updateWithAuctionResult:(AuctionLot *)auctionLot;

/// provides the cell with updated information from an artwork
- (void)updateWithArtwork:(Artwork *)artwork;

/// Provides a rough estimation of the height, doesn't take multi line
/// into account
+ (CGFloat)estimatedHeightWithAuctionLot:(AuctionLot *)auctionLot;

/// Gets an accurate cell height for the auction lot, takes the expected width
+ (CGFloat)heightWithAuctionLot:(AuctionLot *)auctionLot withWidth:(CGFloat)width;

/// Gets an accurate cell height for the artwork, takes the expected width
+ (CGFloat)heightWithArtwork:(Artwork *)auctionLot withWidth:(CGFloat)width;

@end
