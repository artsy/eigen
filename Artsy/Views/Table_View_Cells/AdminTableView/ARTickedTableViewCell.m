#import "ARTickedTableViewCell.h"
#import "ARAnimatedTickView.h"


@implementation ARTickedTableViewCell

- (id)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        self.useSerifFont = YES;
        self.selectionStyle = UITableViewCellSelectionStyleNone;
        self.accessoryView = [[ARAnimatedTickView alloc] initWithSelection:NO];
        self.textLabel.textColor = [UIColor blackColor];
    }
    return self;
}

// Using setSelected comes with too much baggage. Lets simplify.

- (void)setTickSelected:(BOOL)selected animated:(BOOL)animated
{
    if ([self.accessoryView isKindOfClass:[ARAnimatedTickView class]]) {
        [(ARAnimatedTickView *)self.accessoryView setSelected:selected animated:animated];
    }
}

- (BOOL)isSelected
{
    if ([self.accessoryView isKindOfClass:[ARAnimatedTickView class]]) {
        return [(ARAnimatedTickView *)self.accessoryView selected];
    }
    return NO;
}

@end
