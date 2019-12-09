#import "ARNavigationTransitionController.h"

#import "ARAppSearchTransition.h"
#import "ARDefaultNavigationTransition.h"å

#import "ARAppSearchViewController.h"
#import <Emission/ARArtworkComponentViewController.h>
#import "ARViewInRoomViewController.h"


@implementation ARNavigationTransitionController

+ (ARNavigationTransition *)animationControllerForOperation:(UINavigationControllerOperation)operation
                                         fromViewController:(UIViewController *)fromVC
                                           toViewController:(UIViewController *)toVC
{
    ARNavigationTransition *transition = nil;

   if ([toVC isKindOfClass:[ARAppSearchViewController class]] || [fromVC isKindOfClass:[ARAppSearchViewController class]]) {
        transition = [[ARAppSearchTransition alloc] init];
    } else {
        transition = [[ARDefaultNavigationTransition alloc] init];
    }

    transition.operationType = operation;
    return transition;
}

+ (BOOL)objects:(id)first andSecond:(id)second areTransitionsFromClass:(Class)klass1 andClass:(Class)klass2
{
    return ([first isKindOfClass:[klass1 class]] && [second isKindOfClass:[klass2 class]]) ||
        ([first isKindOfClass:[klass2 class]] && [second isKindOfClass:[klass1 class]]);
}

@end
