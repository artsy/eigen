#import <UIKit/UIKit.h>
#import "ARFeedItem.h"

/**
    The Modern Partner Show TableView Cell is the table view cell
    used the show feed, it uses auto-layout and the new AREmbeddedArtwork View Controllers
    and provides an example of a lot of the best practices.
*/

@class ARModernPartnerShowTableViewCell;

@protocol ARModernPartnerShowTableViewCellDelegate <NSObject>

-(void)modernPartnerShowTableViewCell:(ARModernPartnerShowTableViewCell *)cell shouldShowViewController:(UIViewController *)viewController;

@end

@interface ARModernPartnerShowTableViewCell : UITableViewCell

/// Get the pre-generated height for the table view cell
+ (CGFloat)heightForItem:(ARFeedItem *)feedItem useLandscapeValues:(BOOL)useLandscapeValues;

/// Configure the cell with the feed item
- (void)configureWithFeedItem:(ARFeedItem *)feedItem;

@property (nonatomic, weak) id<ARModernPartnerShowTableViewCellDelegate> delegate;

@end
