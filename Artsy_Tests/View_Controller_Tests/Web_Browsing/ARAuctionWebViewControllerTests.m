#import "ARAuctionWebViewController.h"
#import "ARSwitchBoard.h"
#import "ARSwitchboard+Eigen.h"
#import <Emission/ARArtworkComponentViewController.h>

#import <OCMock/OCObserverMockObject.h>


@interface ARAuctionWebViewController (Private)
- (void)bidHasBeenConfirmed;
@end


static NSURL *
URLWithPath(NSString *path)
{
    // For some reason the URL produced by this method does not equal a NSURL initialized with -URLWithString:
    NSURL *URL = [[ARSwitchBoard sharedInstance] resolveRelativeUrl:path];
    return [NSURL URLWithString:URL.absoluteString];
}

static NSURL *
AuctionURL(NSString *auctionID)
{
    return URLWithPath([NSString stringWithFormat:@"/auctions/%@", auctionID]);
}

static NSURL *
AuctionArtworkURL(NSString *auctionID, NSString *artworkID)
{
    return URLWithPath([NSString stringWithFormat:@"/auction/%@/bid/%@", auctionID, artworkID]);
}

SpecBegin(ARAuctionWebViewController);

__block ARAuctionWebViewController *controller = nil;

afterEach(^{
    controller = nil;
});

it(@"parses the aution/lot IDs from the URL", ^{
    NSURL *auctionURL = AuctionURL(@"the-auction");
    controller = [[ARAuctionWebViewController alloc] initWithURL:auctionURL];
    expect(controller.currentURL).to.equal(auctionURL);
    expect(controller.auctionID).to.equal(@"the-auction");
    expect(controller.artworkID).to.beNil();

    NSURL *artworkURL = AuctionArtworkURL(@"the-auction", @"the-artwork");
    controller = [[ARAuctionWebViewController alloc] initWithURL:artworkURL];
    expect(controller.currentURL).to.equal(artworkURL);
    expect(controller.auctionID).to.equal(@"the-auction");
    expect(controller.artworkID).to.equal(@"the-artwork");
});

describe(@"with an artwork", ^{
    beforeEach(^{
        controller = [[ARAuctionWebViewController alloc] initWithURL:AuctionArtworkURL(@"the-auction", @"the-artwork")];
    });

    it(@"listens for a bid to be confirmed", ^{
        id navigationActionMock = [OCMockObject mockForClass:WKNavigationAction.class];
        [[[navigationActionMock stub] andReturnValue:@(WKNavigationTypeOther)] navigationType];
        NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:@"https://artsy.net/artwork/the-artwork#confirm-bid"]];
        [[[navigationActionMock stub] andReturn:request] request];

        id mock = [OCMockObject partialMockForObject:controller];
        [[mock expect] bidHasBeenConfirmed];

        expect([controller shouldLoadNavigationAction:navigationActionMock]).to.equal(WKNavigationActionPolicyCancel);
        [mock verify];
    });

    describe(@"once a bid has been confirmed", ^{
        it(@"posts a ‘updated’ notification", ^{
            id mock = [OCMockObject observerMock];
            [[NSNotificationCenter defaultCenter] addMockObserver:mock
                                                             name:ARAuctionArtworkBidUpdatedNotification
                                                           object:nil];

            [[mock expect] notificationWithName:ARAuctionArtworkBidUpdatedNotification
                                         object:controller
                                       userInfo:@{ ARAuctionIDKey: @"the-auction", ARAuctionArtworkIDKey: @"the-artwork" }];
            [controller bidHasBeenConfirmed];

            [mock verify];
            [[NSNotificationCenter defaultCenter] removeObserver:mock];
        });

        // TODO MAXIM : fix tests
//        it(@"pops the VC from the stack once a bid has been confirmed", ^{
//            ARArtworkSetViewController *artworkViewController = [[ARArtworkSetViewController alloc] initWithArtworkID:@"the-artwork"];
//            (void)artworkViewController.view; // Ensure there’s a currentArtworkViewController
//
//            UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController:artworkViewController];
//            [navigationController pushViewController:controller animated:NO];
//
//            [controller bidHasBeenConfirmed];
//            expect(navigationController.viewControllers.count).to.equal(1);
//        });
//        
//        it(@"inserts an artwork view controller underneath the webview if there is none", ^{
//            UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController:[UIViewController new]];
//            [navigationController pushViewController:controller animated:NO];
//
//            [controller bidHasBeenConfirmed];
//            expect(navigationController.viewControllers.count).to.equal(2);
//
//            ARArtworkSetViewController *artworkViewController = navigationController.viewControllers[1];
//            (void)artworkViewController.view; // Ensure there’s a currentArtworkViewController
//            expect(artworkViewController.currentArtworkViewController.artwork.artworkID).to.equal(@"the-artwork");
//        });
    });

    it(@"reloads only if the ‘updated’ notification is about the artwork in question", ^{
        id mock = nil;
        NSNotificationCenter *notificationCenter = [NSNotificationCenter defaultCenter];

        mock = [OCMockObject partialMockForObject:controller];
        [(ARAuctionWebViewController *)[mock reject] reload];
        [notificationCenter postNotificationName:ARAuctionArtworkBidUpdatedNotification
                                          object:nil
                                        userInfo:@{ ARAuctionIDKey: @"another-auction", ARAuctionArtworkIDKey: @"the-artwork" }];
        [mock verifyWithDelay:1];
        [mock stopMocking];

        mock = [OCMockObject partialMockForObject:controller];
        [(ARAuctionWebViewController *)[mock reject] reload];
        [notificationCenter postNotificationName:ARAuctionArtworkBidUpdatedNotification
                                          object:nil
                                        userInfo:@{ ARAuctionIDKey: @"the-auction", ARAuctionArtworkIDKey: @"another-artwork" }];
        [mock verifyWithDelay:1];
        [mock stopMocking];

        mock = [OCMockObject partialMockForObject:controller];
        [(ARAuctionWebViewController *)[mock expect] reload];
        [notificationCenter postNotificationName:ARAuctionArtworkBidUpdatedNotification
                                          object:nil
                                        userInfo:@{ ARAuctionIDKey: @"the-auction", ARAuctionArtworkIDKey: @"the-artwork" }];
        [mock verifyWithDelay:1];
        [mock stopMocking];
    });
});

describe(@"with an auction", ^{
    it(@"reloads if the artwork, that the ‘updated’ notification is about, is part of the auction", ^{
        controller = [[ARAuctionWebViewController alloc] initWithURL:AuctionURL(@"the-auction")];

        id mock = nil;
        NSNotificationCenter *notificationCenter = [NSNotificationCenter defaultCenter];

        mock = [OCMockObject partialMockForObject:controller];
        [(ARAuctionWebViewController *)[mock reject] reload];
        [notificationCenter postNotificationName:ARAuctionArtworkBidUpdatedNotification
                                          object:nil
                                        userInfo:@{ ARAuctionIDKey: @"another-auction", ARAuctionArtworkIDKey: @"any-artwork" }];
        [mock verifyWithDelay:1];
        [mock stopMocking];

        mock = [OCMockObject partialMockForObject:controller];
        [(ARAuctionWebViewController *)[mock expect] reload];
        [notificationCenter postNotificationName:ARAuctionArtworkBidUpdatedNotification
                                          object:nil
                                        userInfo:@{ ARAuctionIDKey: @"the-auction", ARAuctionArtworkIDKey: @"any-artwork" }];
        [mock verifyWithDelay:1];
        [mock stopMocking];
    });
});

SpecEnd;
