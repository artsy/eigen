#import "ARPostFeedItemLinkView.h"
#import "ARPostFeedItem.h"

SpecBegin(ARPostFeedItemLinkView);

__block ARPostFeedItemLinkView *view = nil;
__block ARPostFeedItem *postFeedItem = nil;

beforeEach(^{
    postFeedItem = [ARPostFeedItem modelWithJSON:@{ @"id" : @"post_id" }];
    view = [[ARPostFeedItemLinkView alloc] initWithPostFeedItem:postFeedItem];
});

it(@"targetURL", ^{
    expect([view targetPath]).to.equal(@"/post/post_id");
});

SpecEnd;
