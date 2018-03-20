#import <FLKAutoLayout/FLKAutoLayout.h>
#import <Artsy+UILabels/Artsy+UILabels.h>
#import <Artsy+UIFonts/UIFont+ArtsyFonts.h>
#import <UIView+BooleanAnimations/UIView+BooleanAnimations.h>
#import "ARDispatchManager.h"

#import "ARAppConstants.h"
#import "ARFullWidthCalloutLabelView.h"

@interface ARFullWidthCalloutLabelView()
@property (nonatomic, copy) NSString *title;
@property (nonatomic, strong) NSLayoutConstraint *bottomConstraint;
@property (nonatomic, weak) id<ARFullWidthCalloutLabelCallback> delegate;
@end

@implementation ARFullWidthCalloutLabelView

- (instancetype)initWithTitle:(NSString *)title delegate:(id<ARFullWidthCalloutLabelCallback>)delegate
{
    self = [super init];
    self.backgroundColor = [UIColor blackColor];
    self.title = title;
    self.delegate = delegate;

    UITapGestureRecognizer *tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapped:)];
    [self addGestureRecognizer:tapGesture];

    return self;
}

- (void)addToRootView:(UIView *)root highlightView:(UIView *)view animated:(BOOL)animated
{
    // Add this to the root view (needs to be in the same heirarchy as view)
    [root addSubview:self];
    [self constrainWidthToView:root predicate:@"0"];
    [self alignCenterXWithView:root predicate:@"0"];

    ARSerifLabel *label = [[ARSerifLabel alloc] init];
    label.textColor = [UIColor whiteColor];
    label.backgroundColor = [UIColor blackColor];
    label.font = [UIFont serifFontWithSize:17];
    label.text = self.title;
    [self addSubview:label];

    UIImageView *close = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"MenuClose"]];
    [self addSubview:close];

    UIImageView *callout = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"MapAnnotationCallout_Anchor"]];
    [self addSubview:callout];

    // Align the label to trailin/leading self, but use labl to decide height
    [label alignLeading:@"20" trailing:@"-60" toView:self];
    [self constrainHeightToView:label predicate:@"30"];
    [label alignCenterYWithView:self predicate:@"0"];

    // Aligh the "x" to the right
    [close alignTrailingEdgeWithView:self predicate:@"-20"];
    [close alignCenterYWithView:self predicate:@"0"];

    // Align the callout to the highlight view
    [callout alignBottomEdgeWithView:self predicate:@"8"];
    [callout alignCenterXWithView:view predicate:@"0"];

    // attach to the view
    NSString *initialPredicate = animated ? @"10" : @"0";
    self.bottomConstraint = [self constrainBottomSpaceToView:view predicate:initialPredicate];

    // Fade up slightly
    if (animated) {
        self.alpha = 0;

        ar_dispatch_after(0.3, ^{
            [UIView animateWithDuration:ARAnimationDuration animations:^{
                self.bottomConstraint.constant = -10;
                self.alpha = 1;

                [self layoutIfNeeded];
                [self.superview layoutIfNeeded];
            }];
        });
    }
}

- (void)tapped:(UITapGestureRecognizer *)gesture
{
    CGFloat tappedX = [gesture locationInView:gesture.view].x;
    BOOL tappedClose = CGRectGetWidth(gesture.view.bounds) - 60 < tappedX;

    if (tappedClose) {
        [self dismissAnimated:YES];
    } else {
        [self.delegate tappedOnLabelSide:self];
    }
}

- (void)dismiss
{
    [self dismissAnimated:YES];
}

- (void)dismissAnimated:(BOOL)animated
{
    [UIView animateIf:animated duration:ARAnimationDuration :^{
        self.alpha = 0;
        self.bottomConstraint.constant = 10;

        [self layoutIfNeeded];
        [self.superview layoutIfNeeded];
    } completion:^(BOOL finished) {
        [self removeFromSuperview];
    }];
}


@end
