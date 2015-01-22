/// We want the Artwork View Controller to allow rotation, but
/// in order for this to happen by default *every* other view in the
/// heirarchy has to support this. So in this case we only check the top VC.

@interface ARNavigationController : UINavigationController

@property (readonly, nonatomic, strong) UIButton *backButton;

- (void)showBackButton:(BOOL)visible animated:(BOOL)animated;
- (void)showStatusBar:(BOOL)visible animated:(BOOL)animated;
- (void)showStatusBarBackground:(BOOL)visible animated:(BOOL)animated;

- (IBAction)back:(id)sender;

/// Presents a pending operation overlay view controller.
///
/// @returns A RACCommand representing the work to remove the view controller.
/// Subscribe to the completion of the command's execution to perform work after
/// the pending operation view controller has been removed.

- (RACCommand *)presentPendingOperationLayover;
- (RACCommand *)presentPendingOperationLayoverWithMessage:(NSString *)message;

@property (nonatomic, assign) BOOL animatesLayoverChanges;

@end
