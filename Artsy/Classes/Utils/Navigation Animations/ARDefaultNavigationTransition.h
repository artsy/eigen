#import "ARNavigationTransition.h"

// We want to have custom transitions when you move between navigation controllers,
// and this is done via UIViewControllerAnimatedTransitioning.

/// This Transition will shrink & fade the current view controller, and push the new view in from the left.


@interface ARDefaultNavigationTransition : ARNavigationTransition

@end
