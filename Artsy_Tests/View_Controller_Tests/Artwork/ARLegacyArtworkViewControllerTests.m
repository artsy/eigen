#import "ARLegacyArtworkViewController.h"
#import "ARArtworkView.h"
#import "ArtsyAPI+Artworks.h"

void stubEmptyBidderPositions(void);
void stubSaleArtwork(void);
void stubBidder(BOOL requiresApproval);

@interface ARLegacyArtworkViewController ()
@property (nonatomic, strong) NSTimer *updateInterfaceWhenAuctionChangesTimer;
@end

SpecBegin(ARLegacyArtworkViewController);

__block ARLegacyArtworkViewController *vc;

beforeEach(^{
    [OHHTTPStubs stubJSONResponseAtPath:@"/oauth2/access_token" withResponse:@{ @"access_token" : @"token", @"expires_in" : @"2034-11-11" }];
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/posts" withResponse:@[]];
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/fairs" withResponse:@[]];
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/sales" withResponse:@[]];
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/shows" withResponse:@[]];
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/collection/saved-artwork/artworks" withResponse:@[]];
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/layer/synthetic/main/artworks" withResponse:@[]];
    
    // This is the mutation to say "we have seen this artwork"
    [OHHTTPStubs stubJSONResponseForHost:@"metaphysics-staging.artsy.net" withResponse:@{ }];
    // ?
    [OHHTTPStubs stubJSONResponseForHost:@"metaphysics-staging.artsy.net" withResponse:@{ }];

    // This is the artwork request
    [OHHTTPStubs stubJSONResponseForHost:@"metaphysics-staging.artsy.net" withResponse:@{ @"data": @{ @"artwork" : @{ @"id": @"some-artwork", @"title": @"Some Title" } } }];
});

describe(@"no related data", ^{

    it(@"shows artwork on iPhone", ^{
        [ARTestContext useDevice:ARDeviceTypePhone6 :^{

            vc = [[ARLegacyArtworkViewController alloc] initWithArtworkID:@"some-artwork" fair:nil];
            [vc ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
            [vc setHasFinishedScrolling];
            [vc.view snapshotViewAfterScreenUpdates:YES];

            expect(vc.view).to.haveValidSnapshot();
        }];
    });

    it(@"shows artwork on iPad", ^{
        [ARTestContext useDevice:ARDeviceTypePad :^{

            vc = [[ARLegacyArtworkViewController alloc] initWithArtworkID:@"some-artwork" fair:nil];
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
                                              @{ @"id": @"one", @"title": @"One", @"sale_message": @"$10" },
                                              @{ @"id": @"two", @"title": @"Two", @"sale_message": @"Sold" },
                                              @{ @"id": @"three", @"title": @"Three", @"sale_message": @"Not For Sale" },
                                              @{ @"id": @"four", @"title": @"Four" }
                                              ]];
        
        
        [ARTestContext useDevice:ARDeviceTypePhone6 :^{
    
            vc = [[ARLegacyArtworkViewController alloc] initWithArtworkID:@"some-artwork" fair:nil];
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

                vc = [[ARLegacyArtworkViewController alloc] initWithArtworkID:@"some-artwork" fair:nil];
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

                vc = [[ARLegacyArtworkViewController alloc] initWithArtworkID:@"some-artwork" fair:nil];
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

    [OHHTTPStubs stubJSONResponseForHost:@"metaphysics-staging.artsy.net" withResponse:@{ @"data": @{ @"artwork" : artworkDict } }];

    Artwork *artwork = [Artwork modelWithJSON:artworkDict];
    CGRect frame = [[UIScreen mainScreen] bounds];
    vc = [[ARLegacyArtworkViewController alloc] initWithArtwork:artwork fair:nil];
    [vc ar_presentWithFrame:frame];

    // The callbacks we're interested in are registered on view heriarchy things
    UIView *view = [[UIView alloc] initWithFrame:frame];
    [view addSubview:vc.view];

    [vc setHasFinishedScrolling];

    expect(vc.view).to.haveValidSnapshot();
});


describe(@"at a closed auction", ^{
    before(^{
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/sales" withResponse:@[@{
            @"id": @"some-auction",
            @"name": @"Some Auction",
            @"is_auction": @YES,
            @"start_at": @"2000-04-07T16:00:00.000+00:00",
            @"end_at": @"2014-04-17T03:59:00.000+00:00",
            @"auction_state": @"closed",
            @"published": @YES
        }]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/me/bidders" withResponse:@[]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/layer/synthetic/main/artworks" withResponse:@[]];
        stubEmptyBidderPositions();
        stubSaleArtwork();
    });

    it(@"displays artwork on iPhone", ^{
        [ARTestContext useDevice:ARDeviceTypePhone6 :^{

            vc = [[ARLegacyArtworkViewController alloc] initWithArtworkID:@"some-artwork" fair:nil];
            [vc ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
            [vc setHasFinishedScrolling];

            [vc.view snapshotViewAfterScreenUpdates:YES];
            expect(vc.view).to.haveValidSnapshot();
        }];
    });

    it(@"displays artwork on iPad", ^{
        [ARTestContext useDevice:ARDeviceTypePad :^{

            vc = [[ARLegacyArtworkViewController alloc] initWithArtworkID:@"some-artwork" fair:nil];
            [vc ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
            [vc setHasFinishedScrolling];
            [vc.view snapshotViewAfterScreenUpdates:YES];


            expect(vc.view).to.haveValidSnapshot();
            
        }];
    });
    
    it(@"does not set up a timer", ^{
        [ARTestContext useDevice:ARDeviceTypePad :^{
            vc = [[ARLegacyArtworkViewController alloc] initWithArtworkID:@"some-artwork" fair:nil];
            [vc ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
            [vc setHasFinishedScrolling];
            
            expect(vc.updateInterfaceWhenAuctionChangesTimer).to.beNil();
        }];
    });
});


describe(@"at an auction requireing registration", ^{
    before(^{
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/sales" withResponse:@[@{
            @"id": @"some-auction",
            @"name": @"Some Auction",
            @"is_auction": @YES,
            @"start_at": @"2000-04-07T16:00:00.000+00:00",
            @"end_at": @"2020-04-17T03:59:00.000+00:00",
            @"auction_state": @"open",
            @"published": @YES,
        }]];
        
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/layer/synthetic/main/artworks" withResponse:@[]];
        
        stubEmptyBidderPositions();
        stubBidder(YES);
        stubSaleArtwork();
    });

    // This class is about to be removed, and the test is failing because
    // the [NSSDate dte] isn't stubbed. Oh well. See: MX-50.
    pending(@"displays artwork on iPhone", ^{
        vc = [[ARLegacyArtworkViewController alloc] initWithArtworkID:@"some-artwork" fair:nil];
        [vc ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
        [vc setHasFinishedScrolling];
        
        [vc.view snapshotViewAfterScreenUpdates:YES];
        expect(vc.view).to.haveValidSnapshot();
    });
});

describe(@"before a live auction", ^{
    before(^{
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/sales" withResponse:@[
            @{
            @"id": @"some-auction",
            @"name": @"Some Auction",
            @"is_auction": @YES,
            @"start_at": @"2000-04-07T16:00:00.000+00:00",
            @"live_start_at": @"2020-04-17T03:59:00.000+00:00",
            @"auction_state": @"open",
            @"published": @YES,
        }]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/sale/some-auction/sale_artworks" withResponse:@[]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/layer/synthetic/main/artworks" withResponse:@[]];
        stubEmptyBidderPositions();
        stubBidder(NO);
        stubSaleArtwork();
    });
    
    it(@"sets up an internal timer", ^{
        vc = [[ARLegacyArtworkViewController alloc] initWithArtworkID:@"some-artwork" fair:nil];
        [vc ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
        [vc setHasFinishedScrolling];
        
        expect(vc.updateInterfaceWhenAuctionChangesTimer).toNot.beNil();
    });
});

it(@"creates an NSUserActivity", ^{
    vc = [[ARLegacyArtworkViewController alloc] initWithArtworkID:@"some-artwork" fair:nil];
    [vc ar_presentWithFrame:[[UIScreen mainScreen] bounds]];
    [vc setHasFinishedScrolling];
    [vc.view snapshotViewAfterScreenUpdates:YES];
    
    expect(vc.userActivity).notTo.beNil();
    expect(vc.userActivity.title).to.equal(@"Some Title");
});

it(@"calls recordViewingOfArtwork within viewDidLoad", ^{
  ARLegacyArtworkViewController *vc = [[ARLegacyArtworkViewController alloc] initWithArtworkID:@"some-artwork" fair:nil];
  id apiMock = [OCMockObject niceMockForClass:ArtsyAPI.class];
  
  [[apiMock expect] recordViewingOfArtwork:@"some-artwork" success:nil failure:nil];
  
  [vc viewWillAppear:NO];
  [apiMock verify];
});



pending(@"at a fair");

SpecEnd;

void stubEmptyBidderPositions() {
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/me/bidder_positions" withParams:@{
        @"artwork_id":@"some-artwork",
        @"sale_id":@"some-auction"
    } withResponse:@[]];
}

void stubSaleArtwork() {
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
}

void stubBidder(BOOL requiresApproval) {
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/me/bidders" withResponse:@[
        @{
             @"qualified_for_bidding": @(!requiresApproval),
             @"id":@"asdada",
             @"sale": @{ @"id" : @"some-auction", @"require_bidder_approval": @(requiresApproval) },
        }]];
}
