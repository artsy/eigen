#import "ARSearchTableViewCell.h"

#import "ARFonts.h"

@implementation ARSearchTableViewCell

- (instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (!self) {
        return nil;
    }

    self.backgroundColor = [UIColor clearColor];
    self.textLabel.textColor = [UIColor whiteColor];
    self.textLabel.font = [UIFont serifFontWithSize:18];
    self.indentationWidth = 0;
    self.selectionStyle = UITableViewCellSelectionStyleNone;
    return self;
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    self.textLabel.frame = CGRectMake(52, 8, CGRectGetWidth(self.bounds) - 52 - 8, 32);
    self.imageView.frame = CGRectMake(8, 4, 36, 36);
}

@end
