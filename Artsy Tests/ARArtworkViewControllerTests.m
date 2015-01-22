#import "ARArtworkViewController.h"
#import "ARArtworkView.h"

SpecBegin(ARArtworkViewController)

__block UIWindow *window;
__block ARArtworkViewController *vc;

after(^{
    [OHHTTPStubs removeAllStubs];
    vc = nil;
});

describe(@"no related data", ^{
    before(^{
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/posts" withResponse:@[]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/fairs" withResponse:@[]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/sales" withResponse:@[]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/collection/saved-artwork/artworks" withResponse:@[]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/layer/synthetic/main/artworks" withResponse:@[]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/artwork/some-artwork"
            withResponse:@{ @"id": @"some-artwork", @"title": @"Some Title" }];
    });

    it(@"shows artwork on iPhone", ^{
        window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
        vc = [[ARArtworkViewController alloc] initWithArtworkID:@"some-artwork" fair:nil];
        vc.shouldAnimate = NO;

        window.rootViewController = vc;
        expect(vc.view).willNot.beNil();
        [window makeKeyAndVisible];
        [vc setHasFinishedScrolling];
        expect(vc.view).will.haveValidSnapshot();
    });

    it(@"shows artwork on iPad", ^{
        waitUntil(^(DoneCallback done) {
            [ARTestContext stubDevice:ARDeviceTypePad];
            window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
            vc = [[ARArtworkViewController alloc] initWithArtworkID:@"some-artwork" fair:nil];
            vc.shouldAnimate = NO;

            window.rootViewController = vc;
            expect(vc.view).willNot.beNil();
            [window makeKeyAndVisible];
            [vc setHasFinishedScrolling];
            activelyWaitFor(0.5, ^{
                expect(vc.view).will.haveValidSnapshot();
                [ARTestContext stopStubbing];
                done();
            });
        });
    });
});

describe(@"with related artworks", ^{
    before(^{
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/posts" withResponse:@[]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/fairs" withResponse:@[]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/sales" withResponse:@[]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/collection/saved-artwork/artworks" withResponse:@[]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/artwork/some-artwork"
            withResponse:@{ @"id": @"some-artwork", @"title": @"Some Title" }];

    });

    describe(@"iPhone", ^{
        before(^{
            [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/layer/synthetic/main/artworks"
                withParams:@{@"artwork[]": @"some-artwork"}
                withResponse:@[ @{ @"id": @"one", @"title": @"One" }, @{ @"id": @"two", @"title": @"Two" } ]];

            window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
            vc = [[ARArtworkViewController alloc] initWithArtworkID:@"some-artwork" fair:nil];
            vc.shouldAnimate = NO;
        });

        it(@"displays related artworks", ^{
            [vc.imageView removeFromSuperview];;
            window.rootViewController = vc;
            expect(vc.view).willNot.beNil();
            [window makeKeyAndVisible];
            [vc setHasFinishedScrolling];
            expect(vc.view).will.haveValidSnapshot();
        });

        it(@"related artworks view looks correct", ^{
            waitUntil(^(DoneCallback done) {

                window.rootViewController = vc;
                expect(vc.view).willNot.beNil();
                [window makeKeyAndVisible];
                [vc setHasFinishedScrolling];
                activelyWaitFor(0.5, ^{
                    expect([(ARArtworkView *)vc.view relatedArtworksView]).will.haveValidSnapshot();
                    done();
                });
            });
        });
    });

    describe(@"iPad", ^{
        before(^{
            [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/layer/synthetic/main/artworks"
                withParams:@{@"artwork[]": @"some-artwork"}
                withResponse:@[
                    @{ @"id": @"one", @"title": @"One" }, @{ @"id": @"two", @"title": @"Two" },
                    @{ @"id": @"three", @"title": @"Three" }, @{ @"id": @"four", @"title": @"Four" },
                    @{ @"id": @"five", @"title": @"Five" }, @{ @"id": @"six", @"title": @"Six" },
                ]];

            [ARTestContext stubDevice:ARDeviceTypePad];
            window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
            vc = [[ARArtworkViewController alloc] initWithArtworkID:@"some-artwork" fair:nil];
            vc.shouldAnimate = NO;
        });

        after(^{
            [ARTestContext stopStubbing];
        });

        it(@"displays related artworks", ^{
            waitUntil(^(DoneCallback done) {

                window.rootViewController = vc;
                expect(vc.view).willNot.beNil();
                [window makeKeyAndVisible];
                [vc setHasFinishedScrolling];
                activelyWaitFor(0.5, ^{
                    expect(vc.view).will.haveValidSnapshot();
                    done();
                });
            });
        });

        it(@"related artworks view looks correct", ^{
            waitUntil(^(DoneCallback done) {

                window.rootViewController = vc;
                expect(vc.view).willNot.beNil();
                [window makeKeyAndVisible];
                [vc setHasFinishedScrolling];
                activelyWaitFor(0.5, ^{
                    expect([(ARArtworkView *)vc.view relatedArtworksView]).will.haveValidSnapshot();
                    done();
                });
            });
        });
    });

});

describe(@"at a closed auction", ^{
    before(^{
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/posts" withResponse:@[]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/fairs" withResponse:@[]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/collection/saved-artwork/artworks" withResponse:@[]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/sales" withResponse:@[@{
            @"id": @"some-auction",
            @"name": @"Some Auction",
            @"is_auction": @YES,
            @"start_at": @"2000-04-07T16:00:00.000+00:00",
            @"end_at": @"2014-04-17T03:59:00.000+00:00",
            @"auction_state": @"closed",
            @"published": @YES
        }]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/me/bidder_positions" withParams:@{
            @"artwork_id":@"some-artwork",
            @"sale_id":@"some-auction"
        } withResponse:@[]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/me/bidders" withResponse:@[]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/sale/some-auction/sale_artworks" withResponse:@[]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/sale/some-auction/sale_artwork/some-artwork" withResponse:@{
            @"id": @"some-artwork",
            @"sale_id": @"some-auction",
            @"bidder_positions_count": @(1),
            @"opening_bid_cents": @(1700000),
            @"highest_bid_amount_cents": @(2200000),
            @"minimum_next_bid_cents": @(2400000),
            @"highest_bid": @{
                @"id": @"highest-bid-id",
                @"amount_cents": @(2200000)
            }
        }];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/artwork/some-artwork"
            withResponse:@{ @"id": @"some-artwork", @"title": @"Some Title" }];
    });
    
    it(@"displays artwork on iPhone", ^{
        window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
        vc = [[ARArtworkViewController alloc] initWithArtworkID:@"some-artwork" fair:nil];
        vc.shouldAnimate = NO;

        [vc.imageView removeFromSuperview];
        window.rootViewController = vc;
        expect(vc.view).willNot.beNil();
        [window makeKeyAndVisible];
        [vc setHasFinishedScrolling];
        expect(vc.view).will.haveValidSnapshot();
    });

    it(@"displays artwork on iPad", ^{
        waitUntil(^(DoneCallback done) {

            [ARTestContext stubDevice:ARDeviceTypePad];
            window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
            vc = [[ARArtworkViewController alloc] initWithArtworkID:@"some-artwork" fair:nil];
            vc.shouldAnimate = NO;

            window.rootViewController = vc;
            expect(vc.view).willNot.beNil();
            [window makeKeyAndVisible];
            [vc setHasFinishedScrolling];
            activelyWaitFor(0.5, ^{
                expect(vc.view).will.haveValidSnapshot();
                [ARTestContext stopStubbing];
                done();
            });
        });
    });
});
pending(@"at a fair");

SpecEnd
