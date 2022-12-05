#import <UIKit/UIKit.h>


@interface UIViewController (SimpleChildren)

/// For Auto-Layout child view controllers. The other methods aren't deprecated yet but you shouldn't be using them.
- (void)ar_addModernChildViewController:(UIViewController *)controller;

/// For Auto Layout, adds the childVC but allows you to place the view inside another view
- (void)ar_addModernChildViewController:(UIViewController *)controller intoView:(UIView *)view;

/// These methods use the various insertSubview methods to let you control the ordering of your subviews.
- (void)ar_addModernChildViewController:(UIViewController *)controller intoView:(UIView *)view atIndex:(NSInteger)index;
- (void)ar_addModernChildViewController:(UIViewController *)controller intoView:(UIView *)view belowSubview:(UIView *)subview;
- (void)ar_addModernChildViewController:(UIViewController *)controller intoView:(UIView *)view aboveSubview:(UIView *)subview;

/// Remove a child View Controller, but not the view
- (void)ar_modernRemoveChildViewController:(UIViewController *)controller;

@end
