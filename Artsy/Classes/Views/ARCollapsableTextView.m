#import "ARCollapsableTextView.h"

static const CGFloat ARCollapsableTextViewHeight = 80;

@interface ARCollapsableTextView()
@property (nonatomic, assign) CGFloat collapsedHeight;
@property (nonatomic, strong) UITapGestureRecognizer *tapGesture;
@property (nonatomic, strong) UISwipeGestureRecognizer *downSwipeGesture;
@property (nonatomic, strong) NSLayoutConstraint *heightCollapsingConstraint;
@property (nonatomic, strong) UIView *collapsedOverlapView;
@end

@implementation ARCollapsableTextView

- (instancetype)init
{
    self = [super init];
    if (self) {
        _collapsedHeight = ARCollapsableTextViewHeight;

        _heightCollapsingConstraint = [[self constrainHeight:@(_collapsedHeight).stringValue] lastObject];
    }
    return self;
}

- (void)setAttributedText:(NSAttributedString *)attributedText
{
    [super setAttributedText:attributedText];

    if (attributedText && !self.tapGesture) {

        // Only show the more indicator if the height of the text exceeds the height of the constraint.
        if (self.intrinsicContentSize.height > self.heightCollapsingConstraint.constant) {

            self.collapsedOverlapView = [[UIView alloc] init];
            self.collapsedOverlapView.backgroundColor = [UIColor whiteColor];
            [self addSubview:self.collapsedOverlapView];

            NSString *accuratePositionString = [NSString stringWithFormat:@"%0.f", self.collapsedHeight - 12];

            [self.collapsedOverlapView constrainWidthToView:self predicate:nil];
            [self.collapsedOverlapView alignBottomEdgeWithView:self predicate:accuratePositionString];
            [self.collapsedOverlapView alignCenterXWithView:self predicate:nil];
            [self.collapsedOverlapView constrainHeight:@"8"];

            UIView *border = [[UIView alloc] init];
            border.backgroundColor = [UIColor artsyMediumGrey];
            [self.collapsedOverlapView addSubview:border];
            [border constrainWidthToView:self predicate:nil];
            [border alignTopEdgeWithView:_collapsedOverlapView predicate:nil];
            [border alignCenterXWithView:self predicate:nil];
            [border constrainHeight:@"1"];

            UIImageView *hintImage = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"SmallMoreVerticalArrow"]];
            [self.collapsedOverlapView addSubview:hintImage];
            [hintImage constrainTopSpaceToView:border predicate:@"8"];
            [hintImage alignCenterXWithView:self.collapsedOverlapView predicate:nil];

            UITapGestureRecognizer *tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(openToFullHeight)];
            [self addGestureRecognizer:tapGesture];
            self.tapGesture = tapGesture;

            [self setNeedsLayout];
            [self.superview setNeedsLayout];
            [self layoutIfNeeded];
            [self.superview layoutIfNeeded];
        } else {
            self.heightCollapsingConstraint.constant = self.intrinsicContentSize.height;
        }
    }
}

- (void)openToFullHeight
{
    self.tapGesture.enabled = NO;
    self.downSwipeGesture.enabled = NO;

    [self layoutIfNeeded];
    [UIView animateWithDuration:0.3 animations:^{
        self.heightCollapsingConstraint.constant = self.intrinsicContentSize.height;
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

@end
