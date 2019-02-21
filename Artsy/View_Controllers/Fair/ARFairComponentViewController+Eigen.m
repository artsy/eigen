#import "ARFairComponentViewController+Eigen.h"
#import "UIViewController+SimpleChildren.h"
#import "ARAppConstants.h"
#import "Fair.h"
#import "UIViewController+Search.h"

#import <UIView+BooleanAnimations/UIView+BooleanAnimations.h>
#import <FLKAutoLayout/FLKAutoLayout.h>

// We only expect one fair search VC to be on screen at once, so keeping a static variable is okay.
// Otherwise, we can't add stored properties to the Emission VC. We'll use this value to determine
// if we're displaying a search controller at the moment or not, too.
static Fair *stashedFair;

@implementation ARFairComponentViewController (Eigen)

- (void)presentFairSearchViewController:(ARFairSearchViewController *)searchViewController completion:(void (^__nullable)(void))completion
{
    [self willChangeValueForKey:@"hidesNavigationButtons"];
    stashedFair = searchViewController.fair;
    [self didChangeValueForKey:@"hidesNavigationButtons"];

    searchViewController.delegate = self;
    searchViewController.view.alpha = 0.0f;
    [self ar_addModernChildViewController:searchViewController];
    [searchViewController.view alignToView:self.view];
    
    [UIView animateIf:ARPerformWorkAsynchronously duration:ARAnimationDuration :^{
        searchViewController.view.alpha = 1.0;
    } completion:^(BOOL animated) {
        if (completion) {
            completion();
        }
    }];
}


- (void)selectedResult:(SearchResult *)result ofType:(NSString *)type fromQuery:(NSString *)query
{
    // TODO: When re-appearing, the back button is visible and obscures our view.
    [self presentSearchResult:result fair:stashedFair];
}

- (void)cancelledSearch:(ARFairSearchViewController *)controller
{
    [UIView animateIf:ARPerformWorkAsynchronously duration:ARAnimationDuration :^{
        controller.view.alpha = 0.0;
    } completion:^(BOOL animated) {
        [self ar_removeChildViewController:controller];
        [self willChangeValueForKey:@"hidesNavigationButtons"];
        stashedFair = nil;
        [self didChangeValueForKey:@"hidesNavigationButtons"];
    }];
}

- (BOOL)hidesNavigationButtons
{
    return stashedFair != nil;
}

@end
