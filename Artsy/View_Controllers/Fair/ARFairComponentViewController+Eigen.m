#import "ARFairComponentViewController+Eigen.h"
#import "UIViewController+SimpleChildren.h"
#import "ARAppConstants.h"

#import <UIView+BooleanAnimations/UIView+BooleanAnimations.h>
#import <FLKAutoLayout/FLKAutoLayout.h>

@implementation ARFairComponentViewController (Eigen)

- (void)presentFairSearchViewController:(ARFairSearchViewController *)searchViewController completion:(void (^__nullable)(void))completion
{
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
    // TODO: implement.
    
}

- (void)cancelledSearch:(ARFairSearchViewController *)controller
{
    [UIView animateIf:ARPerformWorkAsynchronously duration:ARAnimationDuration :^{
        controller.view.alpha = 0.0;
    } completion:^(BOOL animated) {
        [self ar_removeChildViewController:controller];
    }];
}

@end
