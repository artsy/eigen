#import "ARArtworkViewController.h"
#import "ARArtworkView.h"

SpecBegin(ARArtworkViewController);

__block ARArtworkViewController *vc;

beforeEach(^{
    [OHHTTPStubs stubJSONResponseAtPath:@"/oauth2/access_token" withResponse:@{ @"access_token" : @"token", @"expires_in" : @"2034-11-11" }];
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/posts" withResponse:@[]];
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/fairs" withResponse:@[]];
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/sales" withResponse:@[]];
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/shows" withResponse:@[]];
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/collection/saved-artwork/artworks" withResponse:@[]];
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/layer/synthetic/main/artworks" withResponse:@[]];
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/artwork/some-artwork" withResponse:@{ @"id": @"some-artwork", @"title": @"Some Title" }];
});

describe(@"no related data", ^{

    it(@"shows artwork on iPhone", ^{
        [ARTestContext useDevice:ARDeviceTypePhone6 :^{

            vc = [[ARArtworkViewController alloc] initWithArtworkID:@"some-artwork" fair:nil];
            [vc ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
            [vc setHasFinishedScrolling];
            [vc.view snapshotViewAfterScreenUpdates:YES];

            expect(vc.view).to.haveValidSnapshot();
        }];
    });

    it(@"shows artwork on iPad", ^{
        [ARTestContext useDevice:ARDeviceTypePad :^{

            vc = [[ARArtworkViewController alloc] initWithArtworkID:@"some-artwork" fair:nil];
            [vc ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
            [vc setHasFinishedScrolling];
            [vc.view snapshotViewAfterScreenUpdates:YES];

            expect(vc.view).to.haveValidSnapshot();
        }];
    });
});

describe(@"with related artworks", ^{
    
    it(@"shows the price when applicable", ^{
        
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/layer/synthetic/main/artworks"
                                 withParams:@{@"artwork[]": @"some-artwork"}
                               withResponse:@[
                                              @{ @"id": @"one", @"title": @"One", @"price_hidden": @YES, @"price": @"$10" },
                                              @{ @"id": @"two", @"title": @"Two", @"price": @"$1,200" },
                                              @{ @"id": @"three", @"title": @"Three", @"price": @"$10", @"sold": @YES },
                                              @{ @"id": @"four", @"title": @"Four", @"price": @"$300" }
                                              ]];
        
        
        [ARTestContext useDevice:ARDeviceTypePhone6 :^{
    
            vc = [[ARArtworkViewController alloc] initWithArtworkID:@"some-artwork" fair:nil];
            [vc ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
            [vc setHasFinishedScrolling];
            [vc.view snapshotViewAfterScreenUpdates:YES];
            
            expect([(ARArtworkView *)vc.view relatedArtworksView]).to.haveValidSnapshot();
        }];
    });

    describe(@"iPhone", ^{
        it(@"related artworks view looks correct", ^{

            [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/layer/synthetic/main/artworks"
                                     withParams:@{@"artwork[]": @"some-artwork"}
                                   withResponse:@[ @{ @"id": @"one", @"title": @"One" }, @{ @"id": @"two", @"title": @"Two" } ]];
            

            [ARTestContext useDevice:ARDeviceTypePhone6 :^{

                vc = [[ARArtworkViewController alloc] initWithArtworkID:@"some-artwork" fair:nil];
                [vc ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
                [vc setHasFinishedScrolling];
                [vc.view snapshotViewAfterScreenUpdates:YES];

                expect([(ARArtworkView *)vc.view relatedArtworksView]).to.haveValidSnapshot();
            }];

        });
    });
    
    describe(@"iPad", ^{

        it(@"related artworks view looks correct", ^{
            [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/layer/synthetic/main/artworks"
                                     withParams:@{@"artwork[]": @"some-artwork"}
                                   withResponse:@[
                                                  @{ @"id": @"one", @"title": @"One" }, @{ @"id": @"two", @"title": @"Two" },
                                                  @{ @"id": @"three", @"title": @"Three" }, @{ @"id": @"four", @"title": @"Four" },
                                                  @{ @"id": @"five", @"title": @"Five" }, @{ @"id": @"six", @"title": @"Six" },
                                                  ]];

            [ARTestContext useDevice:ARDeviceTypePad :^{

                vc = [[ARArtworkViewController alloc] initWithArtworkID:@"some-artwork" fair:nil];
                [vc ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
                [vc setHasFinishedScrolling];
                [vc.view snapshotViewAfterScreenUpdates:YES];

                expect([(ARArtworkView *)vc.view relatedArtworksView]).to.haveValidSnapshot();
            }];
        });
    });
});

it(@"shows an upublished banner", ^{
    NSDictionary *artworkDict = @{
        @"id" : @"artwork-id",
        @"title" : @"Artwork Title",
        @"published" : @NO,
    };
    Artwork *artwork = [Artwork modelWithJSON:artworkDict];
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/artwork/artwork-id" withResponse:artworkDict];

    CGRect frame = [[UIScreen mainScreen] bounds];
    vc = [[ARArtworkViewController alloc] initWithArtwork:artwork fair:nil];
    [vc ar_presentWithFrame:frame];

    // The callbacks we're interested in are registered on view heriarchy things
    UIView *view = [[UIView alloc] initWithFrame:frame];
    [view addSubview:vc.view];

    [vc setHasFinishedScrolling];

    expect(vc.view).to.haveValidSnapshot();
});


describe(@"at a closed auction", ^{
    before(^{
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
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/layer/synthetic/main/artworks" withResponse:@[]];
    });

    it(@"displays artwork on iPhone", ^{
        [ARTestContext useDevice:ARDeviceTypePhone6 :^{

            vc = [[ARArtworkViewController alloc] initWithArtworkID:@"some-artwork" fair:nil];
            [vc ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
            [vc setHasFinishedScrolling];

            [vc.view snapshotViewAfterScreenUpdates:YES];
            expect(vc.view).to.haveValidSnapshot();
        }];
    });

    it(@"displays artwork on iPad", ^{
        [ARTestContext useDevice:ARDeviceTypePad :^{

            vc = [[ARArtworkViewController alloc] initWithArtworkID:@"some-artwork" fair:nil];
            [vc ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
            [vc setHasFinishedScrolling];
            [vc.view snapshotViewAfterScreenUpdates:YES];


            expect(vc.view).to.haveValidSnapshot();
            
        }];
    });
});


describe(@"at an auction requireing registration", ^{
    before(^{
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/sales" withResponse:@[
            @{
            @"id": @"some-auction",
            @"name": @"Some Auction",
            @"is_auction": @YES,
            @"start_at": @"2000-04-07T16:00:00.000+00:00",
            @"end_at": @"2020-04-17T03:59:00.000+00:00",
            @"auction_state": @"open",
            @"published": @YES,
        }]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/me/bidder_positions" withParams:@{
            @"artwork_id":@"some-artwork",
            @"sale_id":@"some-auction"
        } withResponse:@[]];

        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/me/bidders" withResponse:@[
@{
             @"qualified_for_bidding": @NO,
             @"id":@"asdada",
             @"sale": @{ @"id" : @"some-auction", @"require_bidder_approval": @YES },
        }]];
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
                @"amount_cents": @(2200000),
            }
        }];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/artwork/some-artwork"
            withResponse:@{ @"id": @"some-artwork", @"title": @"Some Title" }];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/layer/synthetic/main/artworks" withResponse:@[]];
    });

    it(@"displays artwork on iPhone", ^{
        [ARTestContext useDevice:ARDeviceTypePhone6 :^{

            vc = [[ARArtworkViewController alloc] initWithArtworkID:@"some-artwork" fair:nil];
            [vc ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
            [vc setHasFinishedScrolling];

            [vc.view snapshotViewAfterScreenUpdates:YES];
            expect(vc.view).to.haveValidSnapshot();
        }];
    });
});

it(@"creates an NSUserActivity", ^{
    
    vc = [[ARArtworkViewController alloc] initWithArtworkID:@"some-artwork" fair:nil];
    [vc ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
    [vc setHasFinishedScrolling];
    [vc.view snapshotViewAfterScreenUpdates:YES];
    
    expect(vc.userActivity).notTo.beNil();
    expect(vc.userActivity.title).to.equal(@"Some Title");
});

pending(@"at a fair");

SpecEnd;
