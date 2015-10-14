#import "ARFairPostsViewController.h"

#import "Fair.h"
#import "ARFeedTimeline.h"
#import "ARPostFeedItem.h"
#import "ARPostFeedItemLinkView.h"
#import "ORStackView+ArtsyViews.h"
#import "ARSwitchBoard.h"

#import <Mantle/EXTScope.h>

@implementation ARFairPostsViewController

- (instancetype)initWithFair:(Fair *)fair
{
    self = [super initWithFair:fair];
    if (!self) {
        return nil;
    }

   __weak typeof (self) wself = self;
    [fair getPosts:^(ARFeedTimeline *feedTimeline) {
        __strong typeof (wself) sself = wself;
        [sself setFeedTimeline:feedTimeline];
    }];

    return self;
}

- (void)setFeedTimeline:(ARFeedTimeline *)feedTimeline
{
    _feedTimeline = feedTimeline;
    [self reloadData];
}

- (void)reloadData
{
    if ([[self feedTimeline] numberOfItems] > 0) {
        [self addPageTitleWithString:@"Posts"];
        [(ORStackView *)self.view addGenericSeparatorWithSideMargin:@"20"];
        for (NSInteger i = 0; i < [[self feedTimeline] numberOfItems]; i++) {
            ARPostFeedItem *postFeedItem = (ARPostFeedItem *)[[self feedTimeline] itemAtIndex:i];
            ARPostFeedItemLinkView *postLinkView = [[ARPostFeedItemLinkView alloc] initWithPostFeedItem:postFeedItem];
            [self addSubview:postLinkView withTopMargin:nil sideMargin:nil];
        }
    }
}

- (void)tappedPostFeedItemLinkView:(ARPostFeedItemLinkView *)sender
{
    if (self.selectionDelegate) {
        [self.selectionDelegate didSelectPost:sender.targetPath];
    } else {
        UIViewController *viewController = [ARSwitchBoard.sharedInstance loadPath:sender.targetPath];
        [self.navigationController pushViewController:viewController animated:YES];
    }
}

@end
