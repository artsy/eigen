#import "ARAdminTableViewCell.h"


@interface ARTickedTableViewCell : ARAdminTableViewCell

- (void)setTickSelected:(BOOL)selected animated:(BOOL)animated;
- (BOOL)isSelected;
@end
