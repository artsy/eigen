#import "ARArtworkViewController.h"
#import "ARArtworkView.h"
#import "ARUserManager+Stubs.h"
#import "ARRouter.h"


@interface ARArtworkViewController (Tests)
- (void)tappedBuyButton;
- (void)tappedContactGallery;
@end

SpecBegin(ARArtworkViewController);

__block UIWindow *window;
__block ARArtworkViewController *vc;

after(^{
    [OHHTTPStubs removeAllStubs];
    vc = nil;
});

describe(@"buy button", ^{
    __block id routerMock;
    __block id vcMock;
    before(^{
        routerMock = [OCMockObject mockForClass:[ARRouter class]];
    });

    after(^{
        [routerMock stopMocking];
        [vcMock stopMocking];
    });

    beforeEach(^{
        [ARUserManager stubAndLoginWithUsername];
    });

    afterEach(^{
        [ARUserManager clearUserData];
    });


    it(@"posts order if artwork has no edition sets", ^{
        Artwork *artwork = [Artwork modelWithJSON:@{
            @"id" : @"artwork-id",
            @"title" : @"Artwork Title",
            @"availability" : @"for sale",
            @"acquireable" : @YES
        }];
        vc = [[ARArtworkViewController alloc] initWithArtwork:artwork fair:nil];
        vcMock = [OCMockObject partialMockForObject:vc];
        [[vcMock reject] tappedContactGallery];

        [[[[routerMock expect] andForwardToRealObject] classMethod] newPendingOrderWithArtworkID:@"artwork-id" editionSetID:[OCMArg isNil]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/me/orders" withResponse:@[]];

        [vc tappedBuyButton];
        [routerMock verify];
        [vcMock verify];
    });

    it(@"posts order if artwork has 1 edition set", ^{
        Artwork *artwork = [Artwork modelWithJSON:@{
            @"id" : @"artwork-id",
            @"title" : @"Artwork Title",
            @"availability" : @"for sale",
            @"acquireable" : @YES,
            @"edition_sets" : @[
                @{ @"id": @"set-1"}
            ]
        }];

        vc = [[ARArtworkViewController alloc] initWithArtwork:artwork fair:nil];
        vcMock = [OCMockObject partialMockForObject:vc];
        [[vcMock reject] tappedContactGallery];

        [[[[routerMock expect] andForwardToRealObject] classMethod] newPendingOrderWithArtworkID:@"artwork-id" editionSetID:@"set-1"];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/me/orders" withResponse:@[]];

        [vc tappedBuyButton];
        [routerMock verify];
        [vcMock verify];
    });

    it(@"displays inquiry form if artwork has multiple sets", ^{
        Artwork *artwork = [Artwork modelWithJSON:@{
            @"id" : @"artwork-id",
            @"title" : @"Artwork Title",
            @"availability" : @"for sale",
            @"acquireable" : @YES,
            @"edition_sets" : @[
                @{ @"id": @"set-1"},
                @{ @"id": @"set-2"}
            ]
        }];

        vc = [[ARArtworkViewController alloc] initWithArtwork:artwork fair:nil];
        vcMock = [OCMockObject partialMockForObject:vc];
        [[vcMock expect] tappedContactGallery];

        [[[routerMock reject] classMethod] newPendingOrderWithArtworkID:OCMOCK_ANY editionSetID:OCMOCK_ANY];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/me/orders" withResponse:@[]];

        [vc tappedBuyButton];
        [routerMock verify];
        [vcMock verify];
    });

    it(@"displays inquiry form if request fails", ^{
        Artwork *artwork = [Artwork modelWithJSON:@{
            @"id" : @"artwork-id",
            @"title" : @"Artwork Title",
            @"availability" : @"for sale",
            @"acquireable" : @YES,
        }];

        vc = [[ARArtworkViewController alloc] initWithArtwork:artwork fair:nil];
        vcMock = [OCMockObject partialMockForObject:vc];
        [[vcMock expect] tappedContactGallery];

        [[[[routerMock expect] andForwardToRealObject]classMethod] newPendingOrderWithArtworkID:OCMOCK_ANY editionSetID:OCMOCK_ANY];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/me/orders" withResponse:@[] andStatusCode:400];

        [vc tappedBuyButton];
        [routerMock verify];
        [vcMock verifyWithDelay:2.0];
    });
});

describe(@"no related data", ^{
    before(^{
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/posts" withResponse:@[]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/fairs" withResponse:@[]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/sales" withResponse:@[]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/shows" withResponse:@[]];
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
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/shows" withResponse:@[]];
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
                [vc.view snapshotViewAfterScreenUpdates:YES];

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

it(@"shows an upublished banner", ^{
    window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];

    NSDictionary *artworkDict = @{
        @"id" : @"artwork-id",
        @"title" : @"Artwork Title",
        @"published" : @NO,
    };
    Artwork *artwork = [Artwork modelWithJSON:artworkDict];
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/artwork/artwork-id" withResponse:artworkDict];

    vc = [[ARArtworkViewController alloc] initWithArtwork:artwork fair:nil];
    vc.shouldAnimate = NO;

    window.rootViewController = vc;
    expect(vc.view).willNot.beNil();
    [window makeKeyAndVisible];
    [vc setHasFinishedScrolling];
    [artwork updateArtwork];

    [vc.view snapshotViewAfterScreenUpdates:YES];
    expect(vc.view).will.haveValidSnapshot();
});


describe(@"at a closed auction", ^{
    before(^{
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/posts" withResponse:@[]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/fairs" withResponse:@[]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/shows" withResponse:@[]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/collection/saved-artwork/artworks" withResponse:@[]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/sales" withResponse:@[
@{
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
        waitUntil(^(DoneCallback done) {

            [ARTestContext stubDevice:ARDeviceTypePhone6];
            window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
            vc = [[ARArtworkViewController alloc] initWithArtworkID:@"some-artwork" fair:nil];
            vc.shouldAnimate = NO;

            [vc.imageView removeFromSuperview];
            window.rootViewController = vc;
            expect(vc.view).willNot.beNil();
            [window makeKeyAndVisible];
            [vc setHasFinishedScrolling];

            activelyWaitFor(0.5, ^{
                [vc.view snapshotViewAfterScreenUpdates:YES];
                expect(vc.view).will.haveValidSnapshot();
                [ARTestContext stopStubbing];
                done();
            });
        });
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
