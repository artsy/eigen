#import "ARNavigationButton.h"


@interface ARNavigationButton ()

@property (nonatomic, strong, readonly) UILabel *primaryTitleLabel;
@property (nonatomic, strong, readonly) UILabel *subtitleLabel;
@property (nonatomic, strong, readonly) UIView *topBorder;
@property (nonatomic, strong, readonly) UIView *bottomBorder;
@property (nonatomic, strong, readonly) UIImageView *arrowView;
@property (nonatomic, assign, readonly) CGFloat borderWidth;

@end


@implementation ARNavigationButton

- (id)initWithFrame:(CGRect)frame
{
    return [self initWithFrame:frame withBorder:1];
}

- (id)initWithFrame:(CGRect)frame withBorder:(CGFloat)borderWidth
{
    self = [super initWithFrame:frame];
    if (!self) {
        return nil;
    }

    _borderWidth = borderWidth;
    _topBorder = [[UIView alloc] init];
    [self.topBorder constrainHeight:NSStringWithFormat(@"%f", borderWidth)];
    self.topBorder.backgroundColor = [UIColor artsyLightGrey];
    [self addSubview:self.topBorder];
    [self.topBorder alignCenterXWithView:self predicate:nil];
    [self.topBorder constrainWidthToView:self predicate:nil];
    [self alignTopEdgeWithView:self.topBorder predicate:nil];

    _primaryTitleLabel = [[UILabel alloc] init];
    self.primaryTitleLabel.backgroundColor = [UIColor clearColor];
    self.primaryTitleLabel.font = [UIFont sansSerifFontWithSize:14];
    [self addSubview:self.primaryTitleLabel];
    [self.primaryTitleLabel constrainTopSpaceToView:self.topBorder predicate:@"10"];
    [self.primaryTitleLabel alignLeadingEdgeWithView:self predicate:nil];
    [self.primaryTitleLabel alignTrailingEdgeWithView:self predicate:@"-26"];

    _subtitleLabel = [[UILabel alloc] init];
    self.subtitleLabel.backgroundColor = [UIColor clearColor];
    self.subtitleLabel.font = [UIFont serifFontWithSize:14];
    self.subtitleLabel.textColor = [UIColor blackColor];
    [self addSubview:self.subtitleLabel];
    [self.subtitleLabel constrainTopSpaceToView:self.primaryTitleLabel predicate:nil];
    [self.subtitleLabel alignLeadingEdgeWithView:self predicate:nil];
    [self.subtitleLabel alignTrailingEdgeWithView:self predicate:@"-26"];

    _arrowView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"MoreArrow"]];
    self.arrowView.backgroundColor = [UIColor clearColor];
    self.arrowView.contentMode = UIViewContentModeCenter;
    [self addSubview:self.arrowView];
    [self.arrowView alignTrailingEdgeWithView:self predicate:nil];
    [self.arrowView alignCenterYWithView:self predicate:nil];

    _bottomBorder = [[UIView alloc] init];
    [self.bottomBorder constrainHeight:NSStringWithFormat(@"%f", borderWidth)];
    self.bottomBorder.backgroundColor = [UIColor artsyLightGrey];
    [self addSubview:self.bottomBorder];
    [self.bottomBorder constrainTopSpaceToView:self.subtitleLabel predicate:@"10"];
    [self.bottomBorder alignCenterXWithView:self predicate:nil];
    [self.bottomBorder constrainWidthToView:self predicate:nil];
    [self alignBottomEdgeWithView:self.bottomBorder predicate:nil];

    return self;
}

- (id)initWithTitle:(NSString *)title
{
    return [self initWithTitle:title andSubtitle:nil];
}

- (id)initWithTitle:(NSString *)title andSubtitle:(NSString *)subtitle
{
    return [self initWithTitle:title andSubtitle:subtitle withBorder:1];
}

- (id)initWithTitle:(NSString *)title andSubtitle:(NSString *)subtitle withBorder:(CGFloat)borderWidth
{
    return [self initWithFrame:CGRectZero andTitle:title andSubtitle:subtitle withBorder:borderWidth];
}

- (id)initWithFrame:(CGRect)frame andTitle:(NSString *)title andSubtitle:(NSString *)subtitle withBorder:(CGFloat)borderWidth
{
    self = [self initWithFrame:frame withBorder:borderWidth];
    if (!self) {
        return nil;
    }

    self.title = title;
    self.subtitle = subtitle;

    return self;
}

- (void)setTitle:(NSString *)title
{
    _title = [title copy];

    self.primaryTitleLabel.text = title.uppercaseString;
}

- (void)setSubtitle:(NSString *)subtitle
{
    _subtitle = [subtitle copy];

    [self.subtitleLabel setText:subtitle];
}

#pragma mark - UIView

- (void)tappedButton
{
    [self sendActionsForControlEvents:UIControlEventTouchUpInside];
}

- (void)setEnabled:(BOOL)enabled
{
    [super setEnabled:enabled];

    self.primaryTitleLabel.alpha = enabled ? 1 : 0.6;
    self.arrowView.alpha = enabled ? 1 : 0.6;
}

- (void)setOnTap:(void (^)(UIButton *))onTap
{
    _onTap = [onTap copy];
    [self addTarget:self action:@selector(tappedForBlockAPI:) forControlEvents:UIControlEventTouchUpInside];
}


- (void)tappedForBlockAPI:(id)sender
{
    self.onTap(self);
}

- (CGSize)intrinsicContentSize
{
    CGFloat labelMarginsHeight = 20;
    CGFloat height = labelMarginsHeight + self.borderWidth + self.primaryTitleLabel.intrinsicContentSize.height + self.subtitleLabel.intrinsicContentSize.height;
    height = MAX(height, self.arrowView.intrinsicContentSize.height);
    return CGSizeMake(280, height);
}
@end


@implementation ARSerifNavigationButton

- (id)initWithFrame:(CGRect)frame withBorder:(CGFloat)borderWidth
{
    self = [super initWithFrame:frame withBorder:borderWidth];
    if (self) {
        self.primaryTitleLabel.font = [UIFont serifFontWithSize:18];
        self.subtitleLabel.font = [UIFont serifFontWithSize:16];
    }

    return self;
}

- (void)setTitle:(NSString *)title
{
    [super setTitle:title];

    self.primaryTitleLabel.text = title;
}

@end
