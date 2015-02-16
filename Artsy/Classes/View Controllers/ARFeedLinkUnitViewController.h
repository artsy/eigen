#import "ARNavigationButtonsViewController.h"

@interface ARFeedLinkUnitViewController : ARNavigationButtonsViewController

/// Fetch the required links, and will call the completion block multiple times
/// as different parts are downloaded

- (void)fetchLinks:(void (^)(void))completion;

@end
