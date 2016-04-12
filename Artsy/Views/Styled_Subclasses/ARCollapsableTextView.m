#import "ARCollapsableTextView.h"

#import "ARFonts.h"

#import <UIView_BooleanAnimations/UIView+BooleanAnimations.h>
#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

static const CGFloat ARCollapsableTextViewHeight = 80;


@interface ARCollapsableTextView ()
@property (nonatomic, assign) CGFloat collapsedHeight;
@property (nonatomic, strong) UITapGestureRecognizer *tapGesture;
@property (nonatomic, strong) UISwipeGestureRecognizer *downSwipeGesture;
@property (nonatomic, strong, readonly) NSLayoutConstraint *heightCollapsingConstraint;
@property (nonatomic, strong, readonly) NSLayoutConstraint *fullHeightConstraint;
@property (nonatomic, strong) UIView *collapsedOverlapView;
@end


@implementation ARCollapsableTextView

- (instancetype)init
{
    self = [super init];
    if (self) {
        _collapsedHeight = ARCollapsableTextViewHeight;

        _heightCollapsingConstraint = [self constrainHeight:@(_collapsedHeight).stringValue];
        self.heightCollapsingConstraint.active = NO;
    }
    return self;
}

- (void)setAttributedText:(NSAttributedString *)attributedText
{
    [super setAttributedText:attributedText];

    CGFloat fullHeight = ceilf([self sizeThatFits:self.frame.size].height);

    _fullHeightConstraint = [self constrainHeight:@(fullHeight).stringValue];

    if (attributedText && !self.tapGesture) {
        // Only show the more indicator if the height of the text exceeds the height of the constraint.
        if (fullHeight > self.heightCollapsingConstraint.constant) {
            self.heightCollapsingConstraint.active = YES;
            self.fullHeightConstraint.active = NO;

            self.collapsedOverlapView = [[UIView alloc] init];
            self.collapsedOverlapView.backgroundColor = [UIColor whiteColor];
            [self addSubview:self.collapsedOverlapView];

            NSString *accuratePositionString = [NSString stringWithFormat:@"%0.f", self.collapsedHeight - 12];

            [self.collapsedOverlapView constrainWidthToView:self predicate:@"0"];
            [self.collapsedOverlapView alignBottomEdgeWithView:self predicate:accuratePositionString];
            [self.collapsedOverlapView alignCenterXWithView:self predicate:@"0"];
            [self.collapsedOverlapView constrainHeight:@"8"];

            UIView *border = [[UIView alloc] init];
            border.backgroundColor = [UIColor artsyGrayMedium];
            [self.collapsedOverlapView addSubview:border];
            [border constrainWidthToView:self predicate:@"0"];
            [border alignTopEdgeWithView:_collapsedOverlapView predicate:@"0"];
            [border alignCenterXWithView:self predicate:@"0"];
            [border constrainHeight:@"1"];

            UIImageView *hintImage = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"SmallMoreVerticalArrow"]];
            [self.collapsedOverlapView addSubview:hintImage];
            [hintImage constrainTopSpaceToView:border predicate:@"8"];
            [hintImage alignCenterXWithView:self.collapsedOverlapView predicate:@"0"];

            UITapGestureRecognizer *tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(openToFullHeight)];
            [self addGestureRecognizer:tapGesture];
            self.tapGesture = tapGesture;

            [self setNeedsLayout];
            [self.superview setNeedsLayout];
            [self layoutIfNeeded];
            [self.superview layoutIfNeeded];
        }
    }
}

- (void)openToFullHeight
{
    [self openToFullHeightAnimated:YES];
}

- (void)openToFullHeightAnimated:(BOOL)animates
{
    self.tapGesture.enabled = NO;
    self.downSwipeGesture.enabled = NO;

    [self layoutIfNeeded];

    self.heightCollapsingConstraint.active = NO;
    self.fullHeightConstraint.active = YES;

    [UIView animateIf:animates duration:0.3:^{

        self.collapsedOverlapView.alpha = 0;

        [self setNeedsLayout];
        [self.superview setNeedsLayout];
        [self layoutIfNeeded];
        [self.superview layoutIfNeeded];
    }];

    if (self.expansionBlock) {
        self.expansionBlock(self);
    }
}

- (void)layoutSubviews
{
    [super layoutSubviews];
}

@end
