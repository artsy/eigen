#import "ARTextInputCell.h"


@implementation ARTextInputCell

- (void)configureCellForRow:(FODFormRow *)row
               withDelegate:(id)delegate
{
    [super configureCellForRow:row withDelegate:delegate];
    self.textField.textColor = [UIColor blackColor];
    self.textField.font = [UIFont serifFontWithSize:16];
    self.titleLabel.font = [self.titleLabel.font fontWithSize:14];
}

@end
