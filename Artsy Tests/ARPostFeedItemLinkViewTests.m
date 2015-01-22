#import "ARPostFeedItemLinkView.h"
#import "ARPostFeedItem.h"

SpecBegin(ARPostFeedItemLinkView)

__block ARPostFeedItemLinkView *view = nil;
__block ARPostFeedItem *postFeedItem = nil;

beforeEach(^{
    view = [[ARPostFeedItemLinkView alloc] init];
    postFeedItem = [ARPostFeedItem modelWithJSON:@{
        @"id" : @"post_id"
    }];
    [view updateWithPostFeedItem:postFeedItem];
});

it(@"targetURL", ^{
    expect([view targetPath]).to.equal(@"/post/post_id");
});

SpecEnd
