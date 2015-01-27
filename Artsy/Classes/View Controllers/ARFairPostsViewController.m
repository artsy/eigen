#import "ARFairPostsViewController.h"
#import "ARPostFeedItem.h"
#import "ORStackView+ArtsyViews.h"

@implementation ARFairPostsViewController

- (instancetype)initWithFair:(Fair *)fair
{
    self = [super initWithFair:fair];
    if (!self) { return nil; }

    @weakify(self);
    [fair getPosts:^(ARFeedTimeline *feedTimeline) {
        @strongify(self);
        [self setFeedTimeline:feedTimeline];
    }];

    return self;
}

-(void)setFeedTimeline:(ARFeedTimeline *)feedTimeline
{
    _feedTimeline = feedTimeline;
    [self reloadData];
}

-(void)reloadData
{
    if ([[self feedTimeline] numberOfItems] > 0) {
        [self addPageTitleWithString:@"Posts"];
        [(ORStackView *)self.view addGenericSeparatorWithSideMargin: @"20"];
        for (NSInteger i = 0; i < [[self feedTimeline] numberOfItems]; i++) {
            ARPostFeedItem *postFeedItem = (ARPostFeedItem *) [[self feedTimeline] itemAtIndex:i];
            ARPostFeedItemLinkView * postLinkView = [[ARPostFeedItemLinkView alloc] initWithPostFeedItem:postFeedItem];
            [self addSubview:postLinkView withTopMargin:nil sideMargin:nil];
        }
    }
}

-(void)tappedPostFeedItemLinkView:(ARPostFeedItemLinkView *)sender
{
    if (self.selectionDelegate) {
        [self.selectionDelegate didSelectPost:sender.targetPath];
    } else {
        UIViewController *viewController = [ARSwitchBoard.sharedInstance loadPath:sender.targetPath];
        [self.navigationController pushViewController:viewController animated:YES];
    }
}

@end
