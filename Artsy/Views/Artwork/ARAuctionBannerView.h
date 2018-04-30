#import <UIKit/UIKit.h>

#import "SaleArtwork.h"


@interface ARAuctionBannerView : UIView
@property (nonatomic, assign) ARAuctionState auctionState;
- (void)updateHeightConstraint;
@end
