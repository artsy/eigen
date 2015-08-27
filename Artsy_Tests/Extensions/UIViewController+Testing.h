#import <UIKit/UIKit.h>


@interface UIViewController (Testing)

/// Presents and sets the frame for the view controller, if self
/// responds to the removing the animations via shouldAnimate:
/// then this is set before viewDidLoad/viewWill/DidAppear are called.

- (void)ar_presentWithFrame:(CGRect)frame;

/// Traverse the view controller's views to find a single instance
/// of a specific view class
- (UIView *)findSubviewWithClass:(Class)subviewClass;

@end
