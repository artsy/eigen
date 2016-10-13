#import <UIKit/UIKit.h>
#import <ARGenericTableViewController/ARGenericTableViewController.h>

/// Tickable cells
extern NSString *const AROptionCell;
/// Normal cells
extern NSString *const ARLabOptionCell;

/// Provides some setup + extra functions on ARGenericTableViewController
/// that are extra useful for admin tooling

@interface EigenLikeAdminViewController : ARGenericTableViewController

/// Adds an Artsy styled header to the section
- (void)setupSection:(ARSectionData *)section withTitle:(NSString *)title;

/// Show a "Are you sure?" with a cancel that doesn't run the closure
- (void)showAlertViewWithTitle:(NSString *)title message:(NSString *)message actionTitle:(NSString *)actionTitle actionHandler:(void (^)())handler;

/// Easy NSUserDefault toggle
- (ARCellData *)editableTextCellDataWithName:(NSString *)name defaultKey:(NSString *)key;

/// Metadata about the app version etc
- (NSString *)titleForApp;

/// Simple cell that has a title and a click handler
- (ARCellData *)tappableCellDataWithTitle:(NSString *)title selection:(dispatch_block_t)selection;


@end
