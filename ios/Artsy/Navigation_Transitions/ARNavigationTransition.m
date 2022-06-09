#import "ARNavigationTransition.h"


@implementation ARNavigationTransition

- (NSTimeInterval)transitionDuration:(id<UIViewControllerContextTransitioning>)transitionContext
{
    return 0.3;
}

- (void)animateTransition:(id<UIViewControllerContextTransitioning>)transitionContext
{
    UIViewController *fromVC = [transitionContext viewControllerForKey:UITransitionContextFromViewControllerKey];
    UIViewController *toVC = [transitionContext viewControllerForKey:UITransitionContextToViewControllerKey];

    switch (self.operationType) {
        case UINavigationControllerOperationPush:
            [self pushTransitionFrom:fromVC to:toVC withContext:transitionContext];
            break;

        case UINavigationControllerOperationPop:
            [self popTransitionFrom:fromVC to:toVC withContext:transitionContext];
            break;

        default: {
            CGRect endFrame = [transitionContext containerView].bounds;
            toVC.view.frame = endFrame;
            [transitionContext completeTransition:YES];
            break;
        }
    }
}

- (void)pushTransitionFrom:(UIViewController *)fromVC to:(UIViewController *)toVC withContext:(id<UIViewControllerContextTransitioning>)transitionContext
{
    [transitionContext completeTransition:YES];
}

- (void)popTransitionFrom:(UIViewController *)fromVC to:(UIViewController *)toVC withContext:(id<UIViewControllerContextTransitioning>)transitionContext
{
    [transitionContext completeTransition:YES];
}

#pragma mark - Properties

- (BOOL)supportsInteractiveTransitioning
{
    return NO;
}

@end
