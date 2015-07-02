#import "UIViewController+InnermostTopViewController.h"


@implementation UIViewController (InnermostTopViewController)

- (UIViewController *)ar_innermostTopViewController
{
    for (UIViewController *childViewController in self.childViewControllers) {
        UIViewController *navigationViewController = [childViewController ar_innermostTopViewController];
        if (navigationViewController) {
            return navigationViewController;
        }
    }

    if ([self isKindOfClass:UINavigationController.class]) {
        return ((UINavigationController *)self).topViewController;
    }

    return nil;
}

@end
