#import "ARSwitchCell.h"


@implementation ARSwitchCell

- (void)awakeFromNib
{
    [self.switchControl setOnTintColor:[UIColor artsyPurple]];
    self.titleLabel.font = [self.titleLabel.font fontWithSize:16];
}

@end
