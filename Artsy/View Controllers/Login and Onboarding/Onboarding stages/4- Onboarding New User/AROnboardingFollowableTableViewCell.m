#import "AROnboardingFollowableTableViewCell.h"

@implementation AROnboardingFollowableTableViewCell

- (id)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        self.accessoryType = UITableViewCellAccessoryNone;
        _followState = NO;
    }
    return self;
}

- (void)prepareForReuse
{
    self.alpha = 1;
    self.textLabel.text = @"";
    self.imageView.image = nil;
}

- (void)layoutSubviews
{
    [super layoutSubviews];

    if (!self.imageView.image) {
        self.textLabel.frame = CGRectMake(20, 0, 250, 54);
    }

    [self setFollowState:_followState];
}

- (void)setFollowState:(BOOL)followState
{
    if (!self.accessoryView) {
        UIImage *check = [UIImage imageNamed:@"FollowCheckmark"];
        self.accessoryView = [[UIImageView alloc] initWithImage:check];
    }
    self.accessoryView.alpha = followState ? 1.f : .5f;
    _followState = followState;
}

- (void)toggleFollowState
{
    self.followState = !self.followState;
}

- (void)setHighlighted:(BOOL)highlighted animated:(BOOL)animated
{
    //to override the flash from AROnboardingTVC
}
@end
