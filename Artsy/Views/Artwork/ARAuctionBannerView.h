#import <UIKit/UIKit.h>


@interface ARAuctionBannerView : UIView
@property (nonatomic, assign) ARAuctionState auctionState;
- (void)updateHeightConstraint;
@end
