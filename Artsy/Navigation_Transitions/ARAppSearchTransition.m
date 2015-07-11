#import "ARAppSearchTransition.h"
#import "ARAppSearchViewController.h"


@implementation ARAppSearchTransition

- (void)pushTransitionFrom:(UIViewController *)fromVC
                        to:(ARAppSearchViewController *)toVC
               withContext:(id<UIViewControllerContextTransitioning>)transitionContext;
{
    toVC.view.alpha = 0;

    CGRect bounds = [transitionContext containerView].bounds;
    UIGraphicsBeginImageContext(bounds.size);
    [fromVC.view drawViewHierarchyInRect:bounds afterScreenUpdates:NO];
    UIImage *viewImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();

    toVC.backgroundImage = viewImage;

    [transitionContext.containerView addSubview:fromVC.view];
    [transitionContext.containerView addSubview:toVC.view];

    [UIView animateWithDuration:[self transitionDuration:transitionContext]
        delay:0.0
        options:UIViewAnimationOptionCurveEaseOut
        animations:^{
                         toVC.view.alpha = 1;
        }
        completion:^(BOOL finished) {
                        [transitionContext completeTransition:YES];
                        // Doing this here instead of -[ARAppSearchViewController hidesToolbarMenu] so that there won't
                        // be a visible gap underneath the blurred background view.
                        [[ARTopMenuViewController sharedController] hideToolbar:YES animated:YES];
        }];
}

- (void)popTransitionFrom:(ARAppSearchViewController *)fromVC
                       to:(UIViewController *)toVC
              withContext:(id<UIViewControllerContextTransitioning>)transitionContext;
{
    [transitionContext.containerView addSubview:toVC.view];
    [transitionContext.containerView addSubview:fromVC.view];

    [UIView animateWithDuration:[self transitionDuration:transitionContext]
        delay:0.0
        options:UIViewAnimationOptionCurveEaseOut
        animations:^{
                         fromVC.view.alpha = 0;
        }
        completion:^(BOOL finished) {
                             fromVC.backgroundImage = nil;
                         [transitionContext completeTransition:YES];
        }];
}

@end
