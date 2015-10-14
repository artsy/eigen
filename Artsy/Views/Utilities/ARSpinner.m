#import "ARSpinner.h"

#import <UIView+BooleanAnimations/UIView+BooleanAnimations.h>

@interface ARSpinner ()
@property (nonatomic, strong) UIView *spinnerView;
@property (nonatomic, strong) CABasicAnimation *rotationAnimation;
@end


@implementation ARSpinner

CGFloat RotationDuration = 0.9;

- (id)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        [self setupBar];
    }
    return self;
}

- (id)initWithCoder:(NSCoder *)aDecoder
{
    if (self = [super initWithCoder:aDecoder]) {
        [self setupBar];
    }
    return self;
}

- (void)setupBar
{
    _spinnerView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 20, 5)];
    _spinnerView.backgroundColor = [UIColor blackColor];
    [self layoutSubviews];
    [self addSubview:_spinnerView];
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    _spinnerView.center = CGPointMake(CGRectGetWidth(self.bounds) / 2, CGRectGetHeight(self.bounds) / 2);
}

- (void)fadeInAnimated:(BOOL)animated
{
    [self fadeInAnimated:animated completion:nil];
}

- (void)fadeOutAnimated:(BOOL)animated
{
    [self fadeOutAnimated:animated completion:nil];
}

- (void)fadeInAnimated:(BOOL)animated completion:(void (^)(BOOL finished))completion
{
    self.alpha = 0;
    [self startAnimating];

    [UIView animateIf:animated duration:0.3:^{
        self.alpha = 1;
    } completion:completion];
}

- (void)fadeOutAnimated:(BOOL)animated completion:(void (^)(BOOL finished))completion
{
    self.alpha = 1;
    [self stopAnimating];

    [UIView animateIf:animated duration:0.3:^{
        self.alpha = 0;
    } completion:completion];
}

- (void)startAnimating
{
    [self animate:LONG_MAX];
}

- (void)animate:(NSInteger)times
{
    CATransform3D rotationTransform = CATransform3DMakeRotation(-1.01f * M_PI, 0, 0, 1.0);
    _rotationAnimation = [CABasicAnimation animationWithKeyPath:@"transform"];

    _rotationAnimation.toValue = [NSValue valueWithCATransform3D:rotationTransform];
    _rotationAnimation.duration = RotationDuration;
    _rotationAnimation.cumulative = YES;
    _rotationAnimation.repeatCount = times;
    [self.layer addAnimation:_rotationAnimation forKey:@"transform"];
}

- (void)stopAnimating
{
    [self.layer removeAllAnimations];
    [self animate:1];
}

- (UIColor *)spinnerColor
{
    return self.spinnerView.backgroundColor;
}

- (void)setSpinnerColor:(UIColor *)spinnerColor
{
    self.spinnerView.backgroundColor = spinnerColor;
}

@end
