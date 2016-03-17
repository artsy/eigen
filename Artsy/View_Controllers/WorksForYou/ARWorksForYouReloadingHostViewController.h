#import "ARWorksForYouViewController.h"

@interface ARWorksForYouReloadingHostViewController : UIViewController

@property (nonatomic, strong, readonly) ARWorksForYouViewController *worksForYouViewController;
@property (nonatomic, assign, readonly) BOOL isContentStale;

- (void)reloadData;

@end
