#import "UIView+Spinner.h"
#import <objc/runtime.h>

CGFloat RotationDuration = 0.9;


@implementation UIView (Spinner)

- (void)ar_startSpinningIndefinitely
{
    [self ar_startSpinning:LONG_MAX];
}

- (void)ar_startSpinning:(NSInteger)times
{
    CATransform3D rotationTransform = CATransform3DMakeRotation(-1.01f * M_PI, 0, 0, 1.0);

    CABasicAnimation *rotationAnimation = [CABasicAnimation animationWithKeyPath:@"transform"];
    objc_setAssociatedObject(self, @selector(ar_startSpinning:), rotationAnimation, OBJC_ASSOCIATION_RETAIN_NONATOMIC);

    rotationAnimation.toValue = [NSValue valueWithCATransform3D:rotationTransform];
    rotationAnimation.duration = RotationDuration;
    rotationAnimation.cumulative = YES;
    rotationAnimation.repeatCount = times;
    [self.layer addAnimation:rotationAnimation forKey:@"transform"];
}

- (void)ar_stopSpinningInstantly:(BOOL)instant
{
    [self.layer removeAllAnimations];
    if (!instant) {
        [self ar_startSpinning:1];
    }
}

@end
