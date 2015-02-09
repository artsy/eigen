#import "ARFairPostsViewController.h"
#import "ARPostFeedItemLinkView.h"
#import "ARSwitchBoard.h"

SpecBegin(ARFairPostsViewController)

__block ARFairPostsViewController *fairVC = nil;

beforeEach(^{
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/profile/fair-profile-id/posts" withResponse:@{ @"results" : @[ @{ @"id": @"post-id", @"title": @"Post Title", @"_type" : @"Post" } ] }];
    Fair *fair = [Fair modelWithJSON:@{ @"name" : @"The Armory Show", @"organizer" : @{ @"profile_id" : @"fair-profile-id" } }];
    fairVC = [[ARFairPostsViewController alloc] initWithFair:fair];
});

afterEach(^{
    [OHHTTPStubs removeAllStubs];
});

it(@"sets fair and fetches posts", ^{
    expect(fairVC.fair.name).to.equal(@"The Armory Show");
    expect(fairVC.feedTimeline).willNot.beNil();
    expect([fairVC.feedTimeline numberOfItems]).to.equal(1);
});

describe(@"rendered", ^{
    beforeEach(^{
        UIWindow *window = [UIWindow new];
        window.rootViewController = fairVC;
        [window makeKeyAndVisible];
        expect(fairVC.view.subviews.count).will.equal(3);
    });

    it(@"displays posts", ^{
        // title
        UIView *titleView = fairVC.view.subviews[0];
        expect(titleView).to.beKindOf([UILabel class]);
        expect(((UILabel *) titleView).text).to.equal(@"POSTS");

        // first post
        UIView *firstPostView = fairVC.view.subviews[2];
        expect(firstPostView).to.beKindOf([ARPostFeedItemLinkView class]);
        expect(((ARPostFeedItemLinkView *) firstPostView).targetPath).to.equal(@"/post/post-id");
    });

    it(@"navigates to the target url when a post is tapped", ^{
        ARPostFeedItemLinkView *firstPostView = (ARPostFeedItemLinkView *) fairVC.view.subviews[2];

        id mock = [OCMockObject partialMockForObject:ARSwitchBoard.sharedInstance];
        [[mock expect] loadPath:@"/post/post-id"];

        [firstPostView sendActionsForControlEvents:UIControlEventTouchUpInside];

        [mock verifyWithDelay:1];
        [mock stopMocking];
    });
});

SpecEnd
