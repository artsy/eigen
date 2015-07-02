#import "ARFairSectionViewController.h"
#import "ARPostFeedItemLinkView.h"

@protocol ARFairPostsViewControllerDelegate
@required
- (void)didSelectPost:(NSString *)postURL;
@end


@interface ARFairPostsViewController : ARFairSectionViewController

@property (nonatomic, strong, readonly) ARFeedTimeline *feedTimeline;
@property (nonatomic, strong) id<ARFairPostsViewControllerDelegate> selectionDelegate;
@end
