#import <UIKit/UIKit.h>
#import "AROnboardingTableViewCell.h"
#import "Artsy+UILabels.h"


@interface AROnboardingFollowableTableViewCell : UITableViewCell
//- (void)toggleFollowState;
//@property (nonatomic) BOOL followState;
@property (nonatomic, strong, readonly) UIImageView *thumbnail;
@property (nonatomic, strong, readonly) ARSansSerifLabel *title;
@property (nonatomic, strong, readonly) UIImageView *follow;
@end
