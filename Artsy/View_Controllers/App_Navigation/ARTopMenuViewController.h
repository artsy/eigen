/** Is the App's Root View Controller.

    It holds multiple navigation controllers for the menu.
    It also handles the status bar API, and the Menu / Back button.
*/

#import "ARMenuAwareViewController.h"
#import "ARNavigationController.h"
#import "ARTopMenuNavigationDataSource.h"

NS_ASSUME_NONNULL_BEGIN

@class ARTabContentView;


@interface ARTopMenuViewController : UIViewController <ARMenuAwareViewController, UIViewControllerTransitioningDelegate>

/// The main interface of the app
+ (ARTopMenuViewController *)sharedController;

/// The current navigation controller for the app from inside the tab controller
@property (readonly, nonatomic, strong) ARNavigationController *rootNavigationController;

/// The view controller associated with the currently visible view in the navigation interface, be it in a tab’s
/// navigation controller or shown modally.
@property (readonly, nonatomic, strong) UIViewController *visibleViewController;

/// The content view for the tabbed nav
@property (readonly, nonatomic, weak) ARTabContentView *tabContentView;

/// Pushes the view controller into the current navigation controller or if it’s an existing view controller at the root
/// of a navigation stack of any of the tabs, it changes to that tab and pop’s to root if necessary.
///
/// Using this method makes it easier to change the navigation systems
- (void)pushViewController:(UIViewController *)viewController;

/// Same as above but with the option to animate
- (void)pushViewController:(UIViewController *)viewController animated:(BOOL)animated;

/// Same as above, but allows you to hook in to the completion callback
/// @Note : This does _not_ run your a callback if you are pushing on to the navigation stack,
///         and thus should only be relied upon when knowing you are presenting a modal
- (void)pushViewController:(UIViewController *)viewController animated:(BOOL)animated completion:(void (^__nullable)(void))completion;

/// Hides the toolbar
- (void)hideToolbar:(BOOL)hideToolbar animated:(BOOL)animated;

/// Shows/Hides the status bar, and sets the color
- (void)showStatusBarBackground:(BOOL)visible animated:(BOOL)animated white:(BOOL)white;

/// Used in search to exit out of search and back into a previous tab.
- (void)returnToPreviousTab;

/// Present the root view controller of the navigation controller at the specified (tab) index. If a navigation stack
/// exists, it is popped to said root view controller.
- (void)presentRootViewControllerAtIndex:(NSInteger)index animated:(BOOL)animated;

/// Present a specific instance of a root view controller at its corresponding tab index. If a navigation stack
/// exists, it is popped to said root view controller.
- (void)presentRootViewController:(UIViewController *)viewController animated:(BOOL)animated;

/// Returns the root navigation controller for the tab at the specified index.
- (ARNavigationController *)rootNavigationControllerAtIndex:(NSInteger)index;

/// Returns the index of the tab that holds the given view controller at the root of the navigation stack or
/// `NSNotFound` in case it’s not a root view controller.
- (NSInteger)indexOfRootViewController:(UIViewController *)viewController;

/// Update the badge number on the data source for the navigation root view controller at the specified tab index.
- (void)setNotificationCount:(NSUInteger)number forControllerAtIndex:(ARTopTabControllerIndex)index;

/// Not all view controllers should be presented as a push, use this to determine whether the topVC will present modally or push.
+ (BOOL)shouldPresentViewControllerAsModal:(UIViewController *)viewController;

- (BOOL)isShowingStatusBar;

/// Used by analytics to get the tab name for a particular idnex
- (NSString *)descriptionForNavIndex:(NSInteger)index;

@end

NS_ASSUME_NONNULL_END
