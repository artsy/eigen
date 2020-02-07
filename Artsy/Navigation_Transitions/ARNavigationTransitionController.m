#import "ARNavigationTransitionController.h"

#import "ARDefaultNavigationTransition.h"

#import <Emission/ARArtworkComponentViewController.h>
#import "ARViewInRoomViewController.h"


@implementation ARNavigationTransitionController

+ (ARNavigationTransition *)animationControllerForOperation:(UINavigationControllerOperation)operation
                                         fromViewController:(UIViewController *)fromVC
                                           toViewController:(UIViewController *)toVC
{
    ARNavigationTransition *transition = [[ARDefaultNavigationTransition alloc] init];
    transition.operationType = operation;
    return transition;
}

+ (BOOL)objects:(id)first andSecond:(id)second areTransitionsFromClass:(Class)klass1 andClass:(Class)klass2
{
    return ([first isKindOfClass:[klass1 class]] && [second isKindOfClass:[klass2 class]]) ||
        ([first isKindOfClass:[klass2 class]] && [second isKindOfClass:[klass1 class]]);
}

@end
