#import <UIKit/UIKit.h>
#import "AROnboardingTableViewCell.h"


@interface AROnboardingFollowableTableViewCell : AROnboardingTableViewCell
- (void)toggleFollowState;
@property (nonatomic) BOOL followState;
@end
