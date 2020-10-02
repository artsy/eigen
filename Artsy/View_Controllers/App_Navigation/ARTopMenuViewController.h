/** Is the App's Root View Controller.

    It holds multiple navigation controllers for the menu.
    It also handles the status bar API, and the Menu / Back button.
*/

#import "ARNavigationController.h"

NS_ASSUME_NONNULL_BEGIN

@class ARTabContentView;


// remove
@interface ARTopMenuViewController : UIViewController

/// The main interface of the app
+ (ARTopMenuViewController *)sharedController;

/// The view controller associated with the currently visible view in the navigation interface, be it in a tab’s
/// navigation controller or shown modally.
@property (readonly, nonatomic, strong) UIViewController *visibleViewController;

@end

NS_ASSUME_NONNULL_END
