#import "UIViewController+SimpleChildren.h"

#import <FLKAutoLayout/UIView+FLKAutoLayout.h>
#import <FLKAutoLayout/UIViewController+FLKAutoLayout.h>


@implementation UIViewController (SimpleChildren)

- (void)ar_addModernChildViewController:(UIViewController *)controller
{
    [self ar_addModernChildViewController:controller intoView:self.view];
}

- (void)ar_addModernChildViewController:(UIViewController *)controller intoView:(UIView *)view aboveSubview:(UIView *)subview
{
    [controller willMoveToParentViewController:self];
    [self addChildViewController:controller];
    [view insertSubview:controller.view aboveSubview:subview];
    [controller didMoveToParentViewController:self];
}

- (void)ar_addModernChildViewController:(UIViewController *)controller intoView:(UIView *)view belowSubview:(UIView *)subview
{
    [controller willMoveToParentViewController:self];
    [self addChildViewController:controller];
    [view insertSubview:controller.view belowSubview:subview];
    [controller didMoveToParentViewController:self];
}

- (void)ar_addModernChildViewController:(UIViewController *)controller intoView:(UIView *)view atIndex:(NSInteger)index
{
    [controller willMoveToParentViewController:self];
    [self addChildViewController:controller];
    [view insertSubview:controller.view atIndex:index];
    [controller didMoveToParentViewController:self];
}

- (void)ar_addModernChildViewController:(UIViewController *)controller intoView:(UIView *)view
{
    [controller willMoveToParentViewController:self];
    [self addChildViewController:controller];
    [view addSubview:controller.view];
    [controller didMoveToParentViewController:self];
}

- (void)ar_modernRemoveChildViewController:(UIViewController *)controller
{
    [controller willMoveToParentViewController:nil];
    [controller removeFromParentViewController];
}


@end
