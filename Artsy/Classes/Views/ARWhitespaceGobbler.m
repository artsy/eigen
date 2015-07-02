#import "ARWhitespaceGobbler.h"


@implementation ARWhitespaceGobbler

- (instancetype)init
{
    self = [super initWithFrame:CGRectNull];
    if (!self) {
        return nil;
    }
    self.backgroundColor = [UIColor clearColor];
    [self setContentHuggingPriority:50 forAxis:UILayoutConstraintAxisVertical];
    [self setContentHuggingPriority:50 forAxis:UILayoutConstraintAxisHorizontal];

    return self;
}

- (CGSize)intrinsicContentSize
{
    return CGSizeMake(0, 0);
}
@end
