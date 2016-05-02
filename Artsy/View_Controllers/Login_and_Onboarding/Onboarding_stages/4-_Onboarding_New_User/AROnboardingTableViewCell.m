#import "AROnboardingTableViewCell.h"

#import "ARFonts.h"


@interface AROnboardingTableViewCell ()
@property (nonatomic) BOOL centerFixed;
@end


@implementation AROnboardingTableViewCell

- (id)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    CGRect screenRect = [[UIScreen mainScreen] bounds];
    CGFloat width = CGRectGetWidth(screenRect);

    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (!self) return nil;

    self.textLabel.font = [UIFont sansSerifFontWithSize:14];
    self.textLabel.textColor = [UIColor blackColor];
    self.accessoryType = UITableViewCellAccessoryDisclosureIndicator;
    self.contentView.backgroundColor = [UIColor clearColor];
    self.backgroundColor = [UIColor clearColor];
    self.selectionStyle = UITableViewCellSelectionStyleNone;
    CGRect frame = self.contentView.frame;
    frame.size.height += 10;
    self.contentView.frame = frame;

    CALayer *sep = [CALayer layer];
    sep.frame = CGRectMake(15, self.contentView.bounds.size.height - .5, width - 30, .5);
    sep.backgroundColor = [UIColor artsyGrayRegular].CGColor;
    [self.layer addSublayer:sep];
    _centerFixed = NO;

    return self;
}

- (UIEdgeInsets)layoutMargins
{
    return UIEdgeInsetsZero;
}

- (void)prepareForReuse
{
    self.centerFixed = NO;
}

//ick, but this frame is CGRectZero in init, so...
- (void)layoutSubviews
{
    [super layoutSubviews];
    CGRect frame = self.textLabel.frame;
    frame.origin.x += 5;
    self.textLabel.frame = frame;
    self.centerFixed = YES;
}

- (void)setHighlighted:(BOOL)highlighted animated:(BOOL)animated
{
    [super setHighlighted:highlighted animated:YES];
    self.backgroundColor = [UIColor artsyGrayRegular];
    [UIView animateWithDuration:.5 animations:^{
        self.backgroundColor = [UIColor clearColor];
    }];
}

@end
