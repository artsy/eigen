#import <UIKit/UIKit.h>


@interface UIViewController (InnermostTopViewController)

/**
 *  Locate the most inner child navigation view controller.
 *
 *  @return The topViewController of the UINavigationController.
 */
- (UIViewController *)ar_innermostTopViewController;

@end
