#import <UIKit/UIKit.h>


@interface UIViewController (FullScreenLoading)

/// Show a full screen loading indicator, fades in a view
/// at the top of the view heirarchy
- (void)ar_presentIndeterminateLoadingIndicatorAnimated:(BOOL)animated;

/// Removes the full screen indicator if it exists
- (void)ar_removeIndeterminateLoadingIndicatorAnimated:(BOOL)animated;

@end
