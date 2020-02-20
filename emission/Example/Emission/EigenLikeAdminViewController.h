#import <UIKit/UIKit.h>
#import <ARGenericTableViewController/ARGenericTableViewController.h>

/// Tickable cells
extern NSString *const AROptionCell;
/// Cells with a subtitle
extern NSString *const ARSubtitledLabOptionCell;
/// Cells with a preload button
extern NSString *const ARPreloadOptionCell;
/// Normal cells
extern NSString *const ARLabOptionCell;

@class ARGraphQLQuery;

typedef NSArray<ARGraphQLQuery *> *(^ARAdminVCPreloadBlock)(void);

/// Provides some setup + extra functions on ARGenericTableViewController
/// that are extra useful for admin tooling

@interface EigenLikeAdminViewController : ARGenericTableViewController

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

- (ARCellData *)viewControllerCellDataWithTitle:(NSString *)title
                                      selection:(dispatch_block_t)selection
                                        preload:(ARAdminVCPreloadBlock)preload;

@end
