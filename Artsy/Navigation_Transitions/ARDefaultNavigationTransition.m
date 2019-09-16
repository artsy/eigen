#import "ARDefaultNavigationTransition.h"

#import "UIView+OldSchoolSnapshots.h"
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

- (void)popTransitionFrom:(UIViewController *)fromVC to:(UIViewController *)toVC withContext:(id<UIViewControllerContextTransitioning>)context
{
    CGRect fullFrame = [context initialFrameForViewController:fromVC];

    // To = Coming up
    // From = Moving to the Side

    [context.containerView addSubview:toVC.view];
    [context.containerView addSubview:fromVC.view];
    fromVC.view.frame = fullFrame;

    UIViewAnimationOptions options = UIViewAnimationOptionCurveEaseOut;

    ARNavigationController *navigationController = (ARNavigationController *)fromVC.navigationController;

    UIView *backButtonSnapshot;

    CGFloat orinalBackButtonAlpha = navigationController.backButton.alpha;
    if ([context isInteractive] && [navigationController isKindOfClass:ARNavigationController.class]) {
        options = UIViewAnimationOptionCurveLinear;

        // For interactive transitions, we copy snapshots of the buttons to the
        // top of the context view.

        // Set the alpha to 1 so we know that there is something to take a
        // snapshot of.
        navigationController.backButton.alpha = 1;

        // We don't use the iOS snapshotting API because we can't wait
        // for a screen update to reflect our changes.
        backButtonSnapshot = [navigationController.backButton ar_snapshot];

        // Make sure the snapshots match the original views in alpha and appear
        // at the right position
        backButtonSnapshot.alpha = orinalBackButtonAlpha;

        backButtonSnapshot.frame = [context.containerView convertRect:navigationController.backButton.frame fromView:navigationController.view];

        // Restore the original alpha values
        navigationController.backButton.alpha = orinalBackButtonAlpha;

        // Hide the original buttons for the duration of the animation, we'll
        // revert this after the transition has finished.
        navigationController.backButton.hidden = YES;

        [context.containerView addSubview:backButtonSnapshot];
    }

    toVC.view.alpha = 0.2;
    toVC.view.transform = CGAffineTransformMakeScale(0.9, 0.9);

    [UIView animateWithDuration:[self transitionDuration:context]
        delay:0.0
        options:options
        animations:^{
         toVC.view.alpha = 1;
         toVC.view.transform = CGAffineTransformIdentity;

         fromVC.view.transform = CGAffineTransformMakeTranslation(fullFrame.size.width, 0);

         backButtonSnapshot.alpha = self.backButtonTargetAlpha;
        }
        completion:^(BOOL finished) {
         toVC.view.alpha = 1;
         toVC.view.transform = CGAffineTransformIdentity;

         // Unhide the buttons
         navigationController.backButton.hidden = NO;

         [backButtonSnapshot removeFromSuperview];

         if ([context transitionWasCancelled]) {
             fromVC.view.frame = fullFrame;
         }

         [context completeTransition:![context transitionWasCancelled]];
        }];
}

#pragma mark - Properties

- (BOOL)supportsInteractiveTransitioning
{
    return YES;
}

@end
