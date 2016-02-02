#import "ARFairSectionViewController.h"

@protocol ARFairPostsViewControllerDelegate
@required
- (void)didSelectPost:(NSString *)postURL;
@end

@class ARFeedTimeline;

@interface ARFairPostsViewController : ARFairSectionViewController

@property (nonatomic, strong, readonly) ARFeedTimeline *feedTimeline;
@property (nonatomic, strong) id<ARFairPostsViewControllerDelegate> selectionDelegate;
@end
