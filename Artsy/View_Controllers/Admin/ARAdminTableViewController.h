#import <ARGenericTableViewController/ARGenericTableViewController.h>

#import <Foundation/Foundation.h>

/// Tickable cells
extern NSString *const AROptionCell;
/// Normal cells
extern NSString *const ARLabOptionCell;
/// So that they don't get reused as actions
extern NSString *const ARReadOnlyOptionCell;
// So that we know when to show two cells
extern NSString *const ARTwoLabelCell;

@interface ARAdminTableViewController : ARGenericTableViewController


/// Adds an Artsy styled header to the section
- (void)setupSection:(ARSectionData *)section withTitle:(NSString *)title;

/// Show a "Are you sure?" with a cancel that doesn't run the closure
- (void)showAlertViewWithTitle:(NSString *)title message:(NSString *)message actionTitle:(NSString *)actionTitle actionHandler:(void (^)(void))handler;

/// Easy NSUserDefault toggle
- (ARCellData *)editableTextCellDataWithName:(NSString *)name defaultKey:(NSString *)key;

/// Metadata about the app version etc
- (NSString *)titleForApp;

/// Simple cell that has a title and a click handler
- (ARCellData *)tappableCellDataWithTitle:(NSString *)title selection:(dispatch_block_t)selection;

/// Simple cell that shows info
- (ARCellData *)informationCellDataWithTitle:(NSString *)title;

@end
