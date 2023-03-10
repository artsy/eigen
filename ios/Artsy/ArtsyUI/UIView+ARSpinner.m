#import "UIView+ARSpinner.h"
#import "ARAnimationContinuation.h"

static CGFloat RotationDuration = 0.45;
static NSString * const AnimationKey = @"ARSpinner";

@implementation UIView (ARSpinner)

- (void)ar_startSpinningIndefinitely
{
    [self ar_startSpinning:LONG_MAX removedOnCompletion:NO];
}

- (void)ar_startSpinning:(NSInteger)times
     removedOnCompletion:(BOOL)removedOnCompletion
{
    CATransform3D rotationTransform = CATransform3DMakeRotation(-1.01f * M_PI, 0, 0, 1.0);

    CABasicAnimation *rotationAnimation = [CABasicAnimation animationWithKeyPath:@"transform"];
    rotationAnimation.toValue = [NSValue valueWithCATransform3D:rotationTransform];
    rotationAnimation.duration = RotationDuration;
    rotationAnimation.cumulative = YES;
    rotationAnimation.repeatCount = times;
    rotationAnimation.removedOnCompletion = removedOnCompletion;

    [self.layer addAnimation:rotationAnimation forKey:AnimationKey];
    [ARAnimationContinuation addToLayer:self.layer];
}

- (void)ar_stopSpinningInstantly:(BOOL)instant
{
    [self.layer removeAnimationForKey:AnimationKey];
    if (!instant) {
        [self ar_startSpinning:1 removedOnCompletion:YES];
    }
    [ARAnimationContinuation removeFromLayer:self.layer];
}

@end
