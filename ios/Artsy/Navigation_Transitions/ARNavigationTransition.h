#import <UIKit/UIKit.h>


@interface ARNavigationTransition : NSObject <UIViewControllerAnimatedTransitioning>

@property (nonatomic, assign) enum UINavigationControllerOperation operationType;

// For interactive transitions, set these to the required values for the
// target viewcontroller to tie the fading of the buttons to the user
// interaction.
//
// These values are currently only used by the ARDefaultTransition
@property (readwrite, nonatomic, assign) CGFloat backButtonTargetAlpha;
@property (readwrite, nonatomic, assign) CGFloat menuButtonTargetAlpha;

// Currently, only ARDefaultTransition returns YES
@property (readonly, nonatomic, assign) BOOL supportsInteractiveTransitioning;

- (void)pushTransitionFrom:(UIViewController *)fromVC to:(UIViewController *)toVC withContext:(id<UIViewControllerContextTransitioning>)transitionContext;

- (void)popTransitionFrom:(UIViewController *)fromVC to:(UIViewController *)toVC withContext:(id<UIViewControllerContextTransitioning>)transitionContext;

@end
