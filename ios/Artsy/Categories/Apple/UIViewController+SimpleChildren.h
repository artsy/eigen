#import <UIKit/UIKit.h>


@interface UIViewController (SimpleChildren)

/// Add a childVC to another controller, deals with the normal
/// View Controller containment methods.

- (void)ar_addChildViewController:(UIViewController *)controller atFrame:(CGRect)frame;

/// Allows you to add a childViewController inside a view in your hierarchy and will deal
/// the normal view controller containment methods.

- (void)ar_addChildViewController:(UIViewController *)controller inView:(UIView *)view atFrame:(CGRect)frame;

/// For Auto-Layout child view controllers. The other methods aren't deprecated yet but you shouldn't be using them.
- (void)ar_addModernChildViewController:(UIViewController *)controller;

/// For Auto-Layout child view controllers. This will align the view controller 1 to 1 with the host.
- (void)ar_addAlignedModernChildViewController:(UIViewController *)controller;
/// This will align the view controller to the top safe area inset
- (void)ar_addSafeAlignedModernChildViewController:(UIViewController *)controller;


/// For Auto Layout, adds the childVC but allows you to place the view inside another view
- (void)ar_addModernChildViewController:(UIViewController *)controller intoView:(UIView *)view;

/// These methods use the various insertSubview methods to let you control the ordering of your subviews.
- (void)ar_addModernChildViewController:(UIViewController *)controller intoView:(UIView *)view atIndex:(NSInteger)index;
- (void)ar_addModernChildViewController:(UIViewController *)controller intoView:(UIView *)view belowSubview:(UIView *)subview;
- (void)ar_addModernChildViewController:(UIViewController *)controller intoView:(UIView *)view aboveSubview:(UIView *)subview;

/// Remove a child View Controller and removes from superview
- (void)ar_removeChildViewController:(UIViewController *)controller;

/// Remove a child View Controller, but not the view
- (void)ar_modernRemoveChildViewController:(UIViewController *)controller;

@end
