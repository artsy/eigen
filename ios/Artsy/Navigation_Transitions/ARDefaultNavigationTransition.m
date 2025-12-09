#import "ARDefaultNavigationTransition.h"

#import "ARAppConstants.h"
#import "ARNavigationController.h"

#define FADE_MOVEMENT_X 8
#define FADE_MOVEMENT_Y 16
#define FADE_ALPHA 0.2


@implementation ARDefaultNavigationTransition

- (NSTimeInterval)transitionDuration:(id<UIViewControllerContextTransitioning>)transitionContext
{
    return ARAnimationDuration;
}

- (void)pushTransitionFrom:(UIViewController *)fromVC to:(UIViewController *)toVC withContext:(id<UIViewControllerContextTransitioning>)transitionContext
{
    CGRect fullFrame = [transitionContext containerView].bounds;
    CGRect offScreen = fullFrame;

    offScreen.origin.x = offScreen.size.width;
    toVC.view.frame = offScreen;

    [transitionContext.containerView addSubview:fromVC.view];
    [transitionContext.containerView addSubview:toVC.view];

    fromVC.view.alpha = 1;
    fromVC.view.transform = CGAffineTransformIdentity;

    [UIView animateWithDuration:[self transitionDuration:transitionContext]
        delay:0.0
        options:UIViewAnimationOptionCurveEaseOut
        animations:^{
            fromVC.view.alpha = 0.2;
            fromVC.view.transform = CGAffineTransformMakeScale(0.9, 0.9);

            toVC.view.frame = fullFrame;
        }
        completion:^(BOOL finished) {
            fromVC.view.alpha = 1;
            fromVC.view.transform = CGAffineTransformIdentity;

            [transitionContext completeTransition:YES];
        }];
}

#pragma mark - Properties

- (BOOL)supportsInteractiveTransitioning
{
    return YES;
}

@end
