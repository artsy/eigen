#import <Foundation/Foundation.h>

#import "ARNavigationTransition.h"


@interface ARNavigationTransitionController : NSObject

/// Get an animation transition for a navigation view controller

+ (ARNavigationTransition *)animationControllerForOperation:(UINavigationControllerOperation)operation
                                         fromViewController:(UIViewController *)fromVC
                                           toViewController:(UIViewController *)toVC;

@end
