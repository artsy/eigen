#import "AROnboardingTransition.h"

@implementation AROnboardingTransition

- (NSTimeInterval)transitionDuration:(id <UIViewControllerContextTransitioning>)transitionContext
{
    return ARAnimationDuration;
}

- (void)pushTransitionFrom:(UIViewController *)fromVC to:(UIViewController *)toVC withContext:(id <UIViewControllerContextTransitioning>)transitionContext {

    CGRect fullFrame = [transitionContext containerView].bounds;
    CGRect offScreenRight = fullFrame;
    CGRect offScreenLeft = fullFrame;

    offScreenRight.origin.x = fullFrame.size.width;
    offScreenLeft.origin.x = -fullFrame.size.width;

    toVC.view.frame = offScreenRight;

    [transitionContext.containerView addSubview:fromVC.view];
    [transitionContext.containerView addSubview:toVC.view];

    [UIView animateWithDuration:[self transitionDuration:transitionContext] delay:0.0 options:UIViewAnimationOptionCurveEaseOut animations:^{
        toVC.view.frame = fullFrame;
        fromVC.view.frame = offScreenLeft;

    } completion:^(BOOL finished) {
        [transitionContext completeTransition:YES];
    }];
}

- (void)popTransitionFrom:(UIViewController *)fromVC to:(UIViewController *)toVC withContext:(id <UIViewControllerContextTransitioning>)transitionContext {

    CGRect fullFrame = [transitionContext containerView].bounds;
    CGRect offScreenRight = fullFrame;
    CGRect offScreenLeft = fullFrame;

    offScreenRight.origin.x = fullFrame.size.width;
    offScreenLeft.origin.x = -fullFrame.size.width;

    fromVC.view.frame = fullFrame;
    toVC.view.frame = offScreenLeft;

    [transitionContext.containerView addSubview:toVC.view];
    [transitionContext.containerView addSubview:fromVC.view];

    [UIView animateWithDuration:[self transitionDuration:transitionContext] delay:0.0 options:UIViewAnimationOptionCurveEaseOut animations:^{
        fromVC.view.frame = offScreenRight;
        toVC.view.frame = fullFrame;

    } completion:^(BOOL finished) {
        [transitionContext completeTransition:YES];
    }];
}


@end
