#import <UIKit/UIKit.h>


@interface UIViewController (Testing)

/// Presents and sets the frame for the view controller and ensures viewDidLoad/viewWill/DidAppear are called.

- (void)ar_presentWithFrame:(CGRect)frame;

/// Traverse the view controller's views to find a single instance
/// of a specific view class
- (UIView *)findSubviewWithClass:(Class)subviewClass;

@end
