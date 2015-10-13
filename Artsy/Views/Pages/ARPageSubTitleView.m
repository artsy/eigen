#import "ARPageSubTitleView.h"

#import "ARTheme.h"

@interface ARPageSubTitleView ()
@property (nonatomic, assign) CGFloat margin;
@property (nonatomic, strong) UILabel *titleLabel;
@property (nonatomic, strong) UIView *separator;
@end


@implementation ARPageSubTitleView

- (CGSize)intrinsicContentSize
{
    CGSize labelSize = self.titleLabel.intrinsicContentSize;
    CGFloat width = (CGRectGetWidth(self.bounds) == 0) ? CGRectGetWidth(self.bounds) : CGRectGetWidth(self.superview.bounds);
    return (CGSize){width, labelSize.height + (self.margin * 2) + CGRectGetHeight(self.separator.bounds)};
}

- (instancetype)initWithTitle:(NSString *)title
{
    return [self initWithTitle:title andFrame:CGRectZero];
}

- (instancetype)initWithTitle:(NSString *)title andFrame:(CGRect)frame
{
    self = [super init];
    if (!self) return nil;

    ARThemeLayoutVendor *layout = [ARTheme defaultTheme].layout;

    _titleLabel = [ARThemedFactory labelForFeedSectionHeaders];
    _margin = [layout[@"FeedSectionTitleVerticalMargin"] floatValue];
    _separator = [ARThemedFactory viewForFeedItemSeperatorAttachedToView:self];

    self.backgroundColor = [UIColor whiteColor];
    [self setTitle:title];

    [self addSubview:_titleLabel];
    if (CGRectEqualToRect(CGRectZero, frame)) {
        [_titleLabel alignCenterXWithView:self predicate:@""];
        [_titleLabel alignCenterYWithView:self predicate:layout[@"FeedSectionTitleVerticalOffset"]];
    } else {
        self.frame = frame;
        CGFloat offset = [[ARTheme defaultTheme] floatForKey:@"FeedSectionTitleVerticalOffset"];
        _titleLabel.center = (CGPoint){self.center.x, self.center.y - offset};
    }

    return self;
}

- (NSString *)title
{
    return self.titleLabel.text;
}

- (void)setTitle:(NSString *)title
{
    NSMutableAttributedString *attributedTitle = nil;
    attributedTitle = [[NSMutableAttributedString alloc] initWithString:[title uppercaseString]];
    [attributedTitle addAttribute:NSKernAttributeName value:@0.5 range:NSMakeRange(0, title.length)];

    self.titleLabel.attributedText = attributedTitle;
}

@end
