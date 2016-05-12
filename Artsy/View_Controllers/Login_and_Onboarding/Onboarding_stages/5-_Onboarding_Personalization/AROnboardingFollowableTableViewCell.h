#import <UIKit/UIKit.h>
#import "Artsy+UILabels.h"


@interface AROnboardingFollowableTableViewCell : UITableViewCell

@property (nonatomic, strong, readonly) UIImageView *thumbnail;
@property (nonatomic, strong, readonly) ARSansSerifLabel *title;
@property (nonatomic, strong, readonly) UIImageView *follow;

- (void)prepareForBudgetUse;

@end
