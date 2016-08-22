#import <UIKit/UIKit.h>

/// When we get an unknown Artsy path, we need to show a view controller
/// synchronously, so this VC wil do a head request to gravity
/// to discover what the route after redirection is.
///
/// This new path will then be re-routed through ARRouter, resulting
/// in either a ProfileVC or the real view controller for that path.
///
/// This is then added as a child view controller, or presented modally
/// on the top menu view controller.


@interface ARMutableLinkViewController : UIViewController

/// Unknown path, e.g. /danger
- (instancetype)initWithPath:(NSString *)path;

@end
