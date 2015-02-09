@class ARPostsViewController;

@protocol ARPostsViewControllerDelegate <NSObject>

-(void)postViewController:(ARPostsViewController *)postViewController shouldShowViewController:(UIViewController *)viewController;

@end

@interface ARPostsViewController : UIViewController

@property (nonatomic, strong) NSArray *posts;

@property (nonatomic, weak) id<ARPostsViewControllerDelegate> delegate;

@end

