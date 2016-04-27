#import "ARPostsViewController.h"
#import "ARPostFeedItemLinkView.h"
#import "ORStackView+ArtsyViews.h"
#import "ARSwitchBoard+Eigen.h"


@interface ARPostsViewController ()
@property (nonatomic, strong) ORStackView *view;
@end


@implementation ARPostsViewController

@dynamic view;

- (void)loadView
{
    self.view = [[ORStackView alloc] init];
    self.view.backgroundColor = [UIColor whiteColor];
    self.view.bottomMarginHeight = 20;
}

- (void)setPosts:(NSArray *)posts
{
    _posts = posts;
    [self reloadData];
}

- (void)reloadData
{
    [self addPageTitleWithString:@"Featured Posts"];

    for (NSInteger i = 0; i < self.posts.count; i++) {
        ARPostFeedItem *post = self.posts[i];
        ARPostFeedItemLinkView *postLinkView = [[ARPostFeedItemLinkView alloc] initWithPostFeedItem:post];
        [self.view addSubview:postLinkView withTopMargin:nil sideMargin:nil];
    }
}

- (void)tappedPostFeedItemLinkView:(ARPostFeedItemLinkView *)sender
{
    UIViewController *viewController = [ARSwitchBoard.sharedInstance loadPath:[sender targetPath]];
    if (viewController) {
        [self.delegate postViewController:self shouldShowViewController:viewController];
    }
}

- (UILabel *)addPageTitleWithString:(NSString *)title
{
    return [self.view addPageSubtitleWithString:title];
}


@end
