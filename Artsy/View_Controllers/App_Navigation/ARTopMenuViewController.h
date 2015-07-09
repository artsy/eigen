/** Is the App's Root View Controller.

    The Top MenuVC is a member of the ARNavigationContainer protocol, this means it supports
    the standard way of pushing new view controllers into a stack using the ARSwitchBoard API.

    It currently handles the status bar API, and the Menu / Back button.
*/

#import "ARMenuAwareViewController.h"
#import "ARNavigationContainer.h"
#import "ARNavigationController.h"
#import "ARBackButtonCallbackManager.h"

@class ARTabContentView;


@interface ARTopMenuViewController : UIViewController <ARMenuAwareViewController, ARNavigationContainer, UIViewControllerTransitioningDelegate>

/// The main interface of the app
+ (ARTopMenuViewController *)sharedController;

/// The current navigation controller for the app from inside the tab controller
@property (readonly, nonatomic, strong) ARNavigationController *rootNavigationController;

/// The content view for the tabbed nav
@property (readonly, nonatomic, weak) ARTabContentView *tabContentView;

@property (nonatomic, strong, readwrite) ARBackButtonCallbackManager *backButtonCallbackManager;

/// Pushes the view controller into the current navigation controller.
/// Using this method makes it easier to change the navigation systems
- (void)pushViewController:(UIViewController *)viewController;

/// Same as above but with the option to animate
- (void)pushViewController:(UIViewController *)viewController animated:(BOOL)animated;

/// Hides the toolbar
- (void)hideToolbar:(BOOL)hideToolbar animated:(BOOL)animated;

/// Used in search to exit out of search and back into a previous tab.
- (void)returnToPreviousTab;

@end
