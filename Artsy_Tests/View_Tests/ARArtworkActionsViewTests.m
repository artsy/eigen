#import "ARArtworkActionsView.h"
#import "ORStackView+ArtsyViews.h"
#import "ARArtworkPriceView.h"
#import "ARArtworkAuctionPriceView.h"
#import "ArtsyEcho.h"


@interface ARArtworkActionsView ()
@property (nonatomic, strong) Artwork *artwork;
@property (nonatomic, strong) ArtsyEcho *echo;
@property (nonatomic, strong) SaleArtwork *saleArtwork;
@property (nonatomic, strong) ARBorderLabel *bidderStatusLabel;
@property (nonatomic, strong) ARArtworkPriceView *priceView;
@property (nonatomic, strong) ARArtworkAuctionPriceView *auctionPriceView;
- (void)updateUI;
- (void)setupCountdownView;

- (void)tappedContactGallery:(id)sender;
- (void)tappedAuctionInfo:(id)sender;
- (void)tappedConditionsOfSale:(id)sender;
- (void)tappedLiveSaleButton:(id)sender;
- (void)tappedBidButton:(id)sender;
- (void)tappedBuyersPremium:(id)sender;
- (void)tappedBuyButton:(id)sender;
- (void)tappedMoreInfo:(id)sender;
@end

SpecBegin(ARArtworkActionsView);

__block ARArtworkActionsView *view = nil;
__block id mockView = nil;

beforeEach(^{
    view = [[ARArtworkActionsView alloc] initWithFrame:CGRectMake(0, 0, 320, 310)];
    mockView = [OCMockObject partialMockForObject:view];
    [[mockView stub] setupCountdownView];
});

afterEach(^{
    [mockView stopMocking];

    // Explicitely release the view now so that it won’t receive anymore notifications
    // from e.g. ARAuctionWebViewController.
    view = nil;
});

it(@"displays contact gallery for a for sale artwork", ^{
    view.artwork = [Artwork modelWithJSON:@{
       @"id" : @"artwork-id",
       @"title" : @"Artwork Title",
       @"availability" : @"for sale",
       @"inquireable" : @YES,
    }];
    [view updateUI];
    [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
    expect(view).to.haveValidSnapshotNamed(@"forSale");
});

it(@"does not display contact gallery for an uninquireable for sale artwork", ^{
    view.artwork = [Artwork modelWithJSON:@{
        @"id" : @"artwork-id",
        @"title" : @"Artwork Title",
        @"availability" : @"for sale",
        @"inquireable" : @NO,
    }];
    [view updateUI];
    [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
    expect(view).to.haveValidSnapshotNamed(@"uninquireableForSale");
});

it(@"displays buy now for an acquireable work with pricing", ^{
    view.artwork = [Artwork modelWithJSON:@{
        @"id" : @"artwork-id",
        @"title" : @"Artwork Title",
        @"availability" : @"for sale",
        @"acquireable" : @YES
    }];
    [view updateUI];
    [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
    expect(view).to.haveValidSnapshotNamed(@"buy");
});


it(@"displays buy now for an acquireable work with pricing", ^{
    view.artwork = [Artwork modelWithJSON:@{
        @"id" : @"artwork-id",
        @"title" : @"Artwork Title",
        @"availability" : @"for sale",
        @"acquireable" : @YES
    }];
    [view updateUI];
    [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
    expect(view).to.haveValidSnapshotNamed(@"buy-with-shipping");
});


it(@"hides contact button and shipping if inquirable but artwork is not for sale ", ^{
    view.artwork = [Artwork modelWithJSON:@{
        @"id" : @"artwork-id",
        @"title" : @"Artwork Title",
        @"availability" : @"sold",
        @"sold" : @YES,
        @"inquireable" : @YES,
        @"shippingInfo": @"Some shipping info",
        @"shippingOrigin": @"Origin info for Artwork"
    }];
    [view updateUI];
    [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
    expect(view).to.haveValidSnapshotNamed(@"inquireable-not-not-actually");
});


it(@"displays contact seller when the partner is not a gallery", ^{
    view.artwork = [Artwork modelWithJSON:@{
       @"id" : @"artwork-id",
       @"title" : @"Artwork Title",
       @"availability" : @"for sale",
       @"inquireable" : @YES,
       @"partner" : @{
               @"id" : @"partner_id",
               @"type" : @"Museum",
               @"name" : @"Guggenheim Museum"
       }
    }];
    [view updateUI];
    [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
    expect(view).to.haveValidSnapshotNamed(@"forSaleByAnInstitution");
});

it(@"displays only the live button when live auction is running", ^{
    view.artwork = [Artwork modelWithJSON:@{
        @"id" : @"artwork-id",
        @"title" : @"Artwork Title",
        @"availability" : @"for sale"
    }];
    view.saleArtwork = [SaleArtwork modelWithJSON:@{
        @"high_estimate_cents" : @20000,
        @"low_estimate_cents" : @10000,
        @"symbol" : @"$"
    }];
    view.saleArtwork.auction = [Sale modelWithJSON:@{
        @"start_at" : @"1-12-30 00:00:00",
        @"live_start_at" : @"1-12-30 00:00:00",
        @"auction_state" : @"open"
    }];
    [view updateUI];
    [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
    [view snapshotViewAfterScreenUpdates:YES];
    expect(view).to.haveValidSnapshot();
});

it(@"does not display contact when artwork is in auction", ^{
    view.artwork = [Artwork modelWithJSON:@{
        @"id" : @"artwork-id",
        @"title" : @"Artwork Title",
        @"availability" : @"for sale",
        @"inquireable" : @YES
    }];
    view.saleArtwork = [SaleArtwork modelWithJSON:@{
        @"high_estimate_cents" : @20000,
        @"low_estimate_cents" : @10000,
        @"symbol" : @"$"
    }];
    [view updateUI];
    [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
    [view snapshotViewAfterScreenUpdates:YES];
    expect(view).to.haveValidSnapshotNamed(@"forSaleAtAuction");
});

describe(@"frozen time", ^{
    __block id timeStub;

    beforeEach(^{
        timeStub = [ARTestContext freezeTime];

        // Now that time is frozen we can stop preventing the countdown from counting down.
        [mockView stopMocking];
    });

    afterEach(^{
        [timeStub stopMocking];
    });

    it(@"uses live_start_at for the countdown for an upcoming live auction", ^{
        view.artwork = [Artwork modelWithJSON:@{
            @"id" : @"artwork-id",
            @"title" : @"Artwork Title",
            @"availability" : @"for sale"
        }];
        view.saleArtwork = [SaleArtwork modelWithJSON:@{
            @"high_estimate_cents" : @20000,
            @"low_estimate_cents" : @10000,
            @"symbol" : @"$"
        }];
        view.saleArtwork.auction = [Sale modelWithDictionary:@{
            @"startDate" : [[NSDate date] dateByAddingTimeInterval:-3600],
            @"liveAuctionStartDate" : [[NSDate date] dateByAddingTimeInterval:3600],
            @"endDate" : [[NSDate date] dateByAddingTimeInterval:4000]
        } error:nil];
        [view updateUI];
        [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
        [view snapshotViewAfterScreenUpdates:YES];

        expect(view).to.haveValidSnapshot();
    });
});

it(@"displays both bid and buy when artwork is in auction and is acquireable", ^{
    view.artwork = [Artwork modelWithJSON:@{
        @"id" : @"artwork-id",
        @"title" : @"Artwork Title",
        @"availability" : @"for sale",
        @"price" : @"$5,000",
        @"sold" : @NO,
        @"acquireable" : @YES,
        @"symbol" : @"$"
    }];
    view.saleArtwork = [SaleArtwork modelWithJSON:@{
        @"high_estimate_cents" : @20000,
        @"low_estimate_cents" : @10000,
        @"symbol" : @"$"
    }];
    view.saleArtwork.auction = [Sale modelWithJSON:@{
        @"start_at" : @"1-12-30 00:00:00",
        @"end_at" : @"4001-01-01 00:00:00"
    }];
    [view updateUI];
    [view snapshotViewAfterScreenUpdates:YES];
    expect(view).to.haveValidSnapshotNamed(@"acquireableAtAuction");
});

it(@"shows a buyers premium notice", ^{
    view.artwork = [Artwork modelWithJSON:@{
        @"id" : @"artwork-id",
        @"title" : @"Artwork Title",
        @"availability" : @"for sale",
        @"price" : @"$5,000",
        @"sold" : @NO,
        @"acquireable" : @YES
    }];
    view.saleArtwork = [SaleArtwork modelWithJSON:@{
        @"high_estimate_cents" : @20000,
        @"low_estimate_cents" : @10000,
        @"symbol" : @"$"
    }];
    view.saleArtwork.auction = [Sale modelWithJSON:@{
        @"start_at" : @"1-12-30 00:00:00",
        @"end_at" : @"4001-01-01 00:00:00",
        @"buyers_premium" : @{ },
        @"symbol" : @"$"
    }];
    [view updateUI];
    [view snapshotViewAfterScreenUpdates:YES];
    expect(view).to.haveValidSnapshot();
});

it(@"displays sold when artwork is in auction and has been acquired", ^{
    view.artwork = [Artwork modelWithJSON:@{
        @"id" : @"artwork-id",
        @"title" : @"Artwork Title",
        @"availability" : @"sold",
        @"sold" : @YES,
        @"price" : @"$5,000",
        @"acquireable" : @NO
    }];
    view.saleArtwork = [SaleArtwork modelWithJSON:@{
        @"high_estimate_cents" : @20000,
        @"low_estimate_cents" : @10000,
        @"symbol" : @"$"
    }];
    view.saleArtwork.auction = [Sale modelWithJSON:@{
        @"start_at" : @"1-12-30 00:00:00",
        @"end_at" : @"4001-01-01 00:00:00",
        @"symbol" : @"$"
    }];
    [view updateUI];
    [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
    [view snapshotViewAfterScreenUpdates:YES];
    expect(view).will.haveValidSnapshotNamed(@"soldAtAuction");
});

describe(@"with Echo config that has BNMO enabled", ^{
    beforeEach(^{
        view.echo = [[ArtsyEcho alloc] init];
        view.echo.features = @{ @"AREnableMakeOfferFlow": [[Feature alloc] initWithName:@"AREnableMakeOfferFlow" state:@(YES)] };
        view.echo.messages = @{@"ExchangeCurrentVersion": [[Message alloc] initWithName:@"ExchangeCurrentVersion" content:@"1"]};
    });

    it(@"displays make offer and buy buttons", ^{
        view.artwork = [Artwork modelWithJSON:@{
            @"id": @"artwork-id",
            @"title": @"Artwork Title",
            @"availability": @"for sale",
            @"acquireable": @(YES),
            @"offerable": @(YES)
        }];
        [view updateUI];
        [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
        [view layoutIfNeeded];
        expect(view).to.haveValidSnapshot();
    });

    it(@"doesn't display make offer button for multiple edition sets", ^{
        view.artwork = [Artwork modelWithJSON:@{
            @"id": @"artwork-id",
            @"title": @"Artwork Title",
            @"availability": @"for sale",
            @"acquireable": @(YES),
            @"offerable": @(YES),
            @"edition_sets": @[
                @"some-string", @"some-other-string"
            ]
        }];
        [view updateUI];
        [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
        [view layoutIfNeeded];
        expect(view).to.haveValidSnapshot();
    });

    it(@"displays make offer button only", ^{
        view.artwork = [Artwork modelWithJSON:@{
            @"id": @"artwork-id",
            @"title": @"Artwork Title",
            @"availability": @"for sale",
            @"acquireable": @(NO),
            @"offerable": @(YES)
        }];
        [view updateUI];
        [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
        [view layoutIfNeeded];
        expect(view).to.haveValidSnapshot();
    });

    describe(@"contactable artwork", ^{
        it(@"displays make offer button only", ^{
            view.artwork = [Artwork modelWithJSON:@{
                @"id": @"artwork-id",
                @"title": @"Artwork Title",
                @"availability": @"for sale",
                @"acquireable": @(NO),
                @"offerable": @(YES),
                // The follow ones mark the artwork as contactable.
                @"inquireable" : @(true),
                @"availability" : @(ARArtworkAvailabilityForSale),
                @"price_hidden" : @(true)
            }];
            [view updateUI];
            [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
            [view layoutIfNeeded];
            expect(view).to.haveValidSnapshot();
        });
    });
});

context(@"price view", ^{
    context(@"not at auction", ^{
        it(@"price", ^{
            view.artwork = [Artwork modelWithJSON:@{ @"price" : @"$30,000", @"inquireable" : @(true)}];
            view.artwork.availability = ARArtworkAvailabilityForSale;
            [view updateUI];
            [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
            [view layoutIfNeeded];
            expect(view.priceView).to.haveValidSnapshot();
        });

        it(@"sold", ^{
            view.artwork = [Artwork modelWithJSON:@{ @"price" : @"$30,000", @"sold" : @(true) }];
            [view updateUI];
            [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
            [view layoutIfNeeded];
            expect(view.priceView).to.haveValidSnapshot();
        });

        // This is currently impossible when we conform strictly to the doc.
        // As show price label would fail on the first check of `self.artwork.price.length`

        pending(@"sold but inquireable", ^{
            view.artwork = [Artwork modelWithJSON:@{ @"sold" : @(true), @"inquireable": @(true), @"forSale": @(false) }];
            view.artwork.availability = ARArtworkAvailabilitySold;
            [view updateUI];
            [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
            [view layoutIfNeeded];
            expect(view.priceView).to.haveValidSnapshot();
        });

        it(@"contact for price", ^{
            view.artwork = [Artwork modelWithJSON:@{ @"price" : @"$30,000", @"inquireable" : @(true), @"availability" : @(ARArtworkAvailabilityForSale), @"price_hidden" : @(true) }];
            [view updateUI];
            [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
            [view layoutIfNeeded];
            expect(view.priceView).to.haveValidSnapshot();
        });

        it(@"contact for price with no price", ^{
            view.artwork = [Artwork modelWithJSON:@{ @"inquireable" : @(true), @"price_hidden" : @(true) }];
            view.artwork.availability = ARArtworkAvailabilityForSale;
            [view updateUI];
            [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
            [view layoutIfNeeded];
            expect(view.priceView).to.haveValidSnapshot();
        });

        it(@"not for sale", ^{
            view.artwork = [Artwork modelWithJSON:@{ @"sold" : @(false), @"inquireable": @(true), @"forSale": @(false)}];
            [view updateUI];
            [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
            [view layoutIfNeeded];
            expect(view).to.haveValidSnapshot();
        });

        it(@"not for sale, but has a price to show", ^{
            view.artwork = [Artwork modelWithJSON:@{ @"price" : @"$30,000", @"is_price_hidden" : @(false), @"sold" : @(false), @"inquireable": @(true), @"forSale": @(false)}];
            [view updateUI];
            [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
            [view layoutIfNeeded];
            expect(view.priceView).to.haveValidSnapshot();
        });

        it(@"shows shipping when the work is acquirable", ^{
            view.artwork = [Artwork modelWithJSON:@{ @"availability" : @"for sale", @"price" : @"$30,000", @"acquirable": @(true), @"shippingInfo": @"Ships with version 4.3.4"}];
            [view updateUI];
            [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
            [view layoutIfNeeded];
            expect(view.priceView).to.haveValidSnapshot();
        });

    });

    context(@"at auction", ^{
        context(@"a bidder", ^{
            it(@"is sold", ^{
                view.saleArtwork = [SaleArtwork modelWithJSON:@{ @"opening_bid_cents" : @(1000000), @"symbol" : @"$" }];
                view.saleArtwork.auction = [Sale modelWithJSON:@{ @"start_at" : @"1976-01-30T15:00:00+00:00", @"auction_state" : @"closed" }];
                view.artwork = [Artwork modelWithJSON:@{ @"sold" : @(false) }];
                [view updateUI];
                [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
                [view layoutIfNeeded];
                expect(view).to.haveValidSnapshot();
            });
        });

        it(@"no bids", ^{
            view.saleArtwork = [SaleArtwork modelWithJSON:@{ @"opening_bid_cents" : @(1000000), @"symbol" : @"$" }];
            view.saleArtwork.auction = [Sale modelWithJSON:@{ @"start_at" : @"1976-01-30T15:00:00+00:00", @"end_at" : @"2045-01-30T15:00:00+00:00" }];
            view.artwork = [Artwork modelWithJSON:@{ @"sold" : @(false) }];
            [view updateUI];
            [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
            [view layoutIfNeeded];
            expect(view.auctionPriceView).to.haveValidSnapshot();
        });

        it(@"has bids", ^{
            Bid *highBid = [Bid modelWithJSON:@{ @"id" : @"abc", @"amount_cents" : @(10000000), @"symbol" : @"$" }];
            expect(highBid.cents).to.equal(10000000);
            view.saleArtwork = [SaleArtwork saleArtworkWithHighBid:highBid AndReserveStatus:ARReserveStatusNoReserve];;
            view.saleArtwork.auction = [Sale modelWithJSON:@{ @"start_at" : @"1976-01-30T15:00:00+00:00", @"end_at" : @"2045-01-30T15:00:00+00:00" }];

            expect(view.saleArtwork.saleHighestBid.cents).to.equal(10000000);
            view.artwork = [Artwork modelWithJSON:@{ @"sold" : @(false) }];
            [view updateUI];
            [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
            [view layoutIfNeeded];
            expect(view.auctionPriceView).to.haveValidSnapshot();
        });

        it(@"reserve met and has bids", ^{
            Bid *highBid = [Bid modelWithJSON:@{ @"id" : @"abc", @"amount_cents" : @(10000000), @"symbol" : @"$" }];
            view.saleArtwork = [SaleArtwork saleArtworkWithHighBid:highBid AndReserveStatus:ARReserveStatusReserveMet];
            view.saleArtwork.auction = [Sale modelWithJSON:@{ @"start_at" : @"1976-01-30T15:00:00+00:00", @"end_at" : @"2045-01-30T15:00:00+00:00" }];

            view.artwork = [Artwork modelWithJSON:@{ @"sold" : @(false) }];
            [view updateUI];
            [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
            [view layoutIfNeeded];
            expect(view.auctionPriceView).to.haveValidSnapshot();
        });

        it(@"current auction reserve not met and has bids", ^{
            Bid *highBid = [Bid modelWithJSON:@{ @"id" : @"abc", @"amount_cents" : @(10000000), @"symbol" : @"$" }];
            view.saleArtwork = [SaleArtwork saleArtworkWithHighBid:highBid AndReserveStatus:ARReserveStatusReserveNotMet];
            view.saleArtwork.auction = [Sale modelWithJSON:@{ @"start_at" : @"1976-01-30T15:00:00+00:00", @"end_at" : @"2045-01-30T15:00:00+00:00" }];
            view.artwork = [Artwork modelWithJSON:@{ @"sold" : @(false) }];
            [view updateUI];
            [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
            [view layoutIfNeeded];
            expect(view.auctionPriceView).to.haveValidSnapshot();
        });
        
        it(@"reserve not met and has no bids", ^{
            view.saleArtwork = [SaleArtwork modelWithJSON:@{ @"opening_bid_cents" : @(1000000), @"reserve_status" : @"reserve_not_met", @"symbol" : @"$" }];
            view.saleArtwork.auction = [Sale modelWithJSON:@{ @"start_at" : @"1976-01-30T15:00:00+00:00", @"end_at" : @"2045-01-30T15:00:00+00:00" }];
            view.artwork = [Artwork modelWithJSON:@{ @"sold" : @(false) }];
            [view updateUI];
            [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
            [view layoutIfNeeded];
            expect(view.auctionPriceView).to.haveValidSnapshot();
        });

        context(@"the user has bid", ^{
            it(@"as the highest bidder", ^{
                Bid *highBid = [Bid modelWithJSON:@{ @"id" : @"abc", @"amount_cents" : @(10000000), @"symbol" : @"$" }];
                expect(highBid.cents).to.equal(10000000);
                SaleArtwork *saleArtwork = [SaleArtwork modelFromDictionary:
                    @{
                        @"artworkNumPositions" : @(1),
                        @"saleHighestBid" : highBid,
                        @"minimumNextBidCents" : @(11000000),
                        @"reserveStatus" : @(ARReserveStatusNoReserve),
                        @"currencySymbol" : @"$"
                    }];
                saleArtwork.positions = @[[BidderPosition modelFromDictionary:
                    @{
                        @"bidderPositionID": highBid.bidID,
                        @"highestBid": highBid,
                        @"maxBidAmountCents": highBid.cents
                    }]];
                view.saleArtwork = saleArtwork;
                view.saleArtwork.auction = [Sale modelWithJSON:@{ @"start_at" : @"1976-01-30T15:00:00+00:00", @"end_at" : @"2045-01-30T15:00:00+00:00" }];

                view.artwork = [Artwork modelWithJSON:@{ @"sold" : @(false) }];
                [view updateUI];
                [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
                [view layoutIfNeeded];
                expect(view.auctionPriceView).to.haveValidSnapshot();
            });

            it(@"with reserve not met", ^{
                Bid *highBid = [Bid modelWithJSON:@{ @"id" : @"abc", @"amount_cents" : @(10000000), @"symbol" : @"$" }];
                expect(highBid.cents).to.equal(10000000);
                SaleArtwork *saleArtwork = [SaleArtwork modelFromDictionary:
                    @{
                        @"artworkNumPositions" : @(1),
                        @"saleHighestBid" : highBid,
                        @"minimumNextBidCents" : @(11000000),
                        @"reserveStatus" : @(ARReserveStatusReserveNotMet),
                        @"currencySymbol" : @"$"
                    }];
                saleArtwork.positions = @[[BidderPosition modelFromDictionary:
                    @{
                        @"bidderPositionID": highBid.bidID,
                        @"highestBid": highBid,
                        @"maxBidAmountCents": highBid.cents
                    }]];
                view.saleArtwork = saleArtwork;
                view.saleArtwork.auction = [Sale modelWithJSON:@{ @"start_at" : @"1976-01-30T15:00:00+00:00", @"end_at" : @"2045-01-30T15:00:00+00:00" }];

                view.artwork = [Artwork modelWithJSON:@{ @"sold" : @(false) }];
                [view updateUI];
                [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
                [view layoutIfNeeded];
                expect(view.auctionPriceView).to.haveValidSnapshot();
            });

            it(@"with reserve met", ^{
                Bid *highBid = [Bid modelWithJSON:@{ @"id" : @"abc", @"amount_cents" : @(10000000), @"symbol" : @"$" }];
                expect(highBid.cents).to.equal(10000000);
                SaleArtwork *saleArtwork = [SaleArtwork modelFromDictionary:
                    @{
                        @"artworkNumPositions" : @(1),
                        @"saleHighestBid" : highBid,
                        @"minimumNextBidCents" : @(11000000),
                        @"reserveStatus" : @(ARReserveStatusReserveMet),
                        @"currencySymbol" : @"$"
                    }];
                saleArtwork.positions = @[[BidderPosition modelFromDictionary:
                    @{
                        @"bidderPositionID": highBid.bidID,
                        @"highestBid": highBid,
                        @"maxBidAmountCents": highBid.cents
                    }]];
                view.saleArtwork = saleArtwork;
                view.saleArtwork.auction = [Sale modelWithJSON:@{ @"start_at" : @"1976-01-30T15:00:00+00:00", @"end_at" : @"2045-01-30T15:00:00+00:00" }];

                view.artwork = [Artwork modelWithJSON:@{ @"sold" : @(false) }];
                [view updateUI];
                [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
                [view layoutIfNeeded];
                expect(view.auctionPriceView).to.haveValidSnapshot();
            });

            it(@"after being outbid with reserve met", ^{
                Bid *highBid = [Bid modelWithJSON:@{ @"id" : @"abc", @"amount_cents" : @(10000000), @"symbol" : @"$" }];
                expect(highBid.cents).to.equal(10000000);
                SaleArtwork *saleArtwork = [SaleArtwork modelFromDictionary:
                    @{
                        @"artworkNumPositions" : @(2),
                        @"saleHighestBid" : highBid,
                        @"minimumNextBidCents" : @(11000000),
                        @"reserveStatus" : @(ARReserveStatusReserveMet),
                        @"currencySymbol" : @"$"
                    }];
                saleArtwork.positions = @[[BidderPosition modelFromDictionary:
                    @{
                        @"bidderPositionID": @"some-other-id",
                        @"highestBid": [Bid modelWithJSON:@{ @"id": @"some-other-id", @"amount_cents": @(9000000), @"symbol" : @"$"}],
                        @"maxBidAmountCents": @(9000000)
                    }]];
                view.saleArtwork = saleArtwork;
                view.saleArtwork.auction = [Sale modelWithJSON:@{ @"start_at" : @"1976-01-30T15:00:00+00:00", @"end_at" : @"2045-01-30T15:00:00+00:00" }];

                view.artwork = [Artwork modelWithJSON:@{ @"sold" : @(false) }];
                [view updateUI];
                [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
                [view layoutIfNeeded];
                expect(view.auctionPriceView).to.haveValidSnapshot();
            });

            it(@"after being outbid with reserve not met", ^{
                Bid *highBid = [Bid modelWithJSON:@{ @"id" : @"abc", @"amount_cents" : @(10000000), @"symbol" : @"$" }];
                expect(highBid.cents).to.equal(10000000);
                SaleArtwork *saleArtwork = [SaleArtwork modelFromDictionary:
                    @{
                        @"artworkNumPositions" : @(2),
                        @"saleHighestBid" : highBid,
                        @"minimumNextBidCents" : @(11000000),
                        @"reserveStatus" : @(ARReserveStatusReserveNotMet),
                        @"currencySymbol" : @"$"
                    }];
                saleArtwork.positions = @[[BidderPosition modelFromDictionary:
                    @{
                        @"bidderPositionID": @"some-other-id",
                        @"highestBid": [Bid modelWithJSON:@{ @"id": @"some-other-id", @"amount_cents": @(9000000), @"symbol" : @"$"}],
                        @"maxBidAmountCents": @(9000000)
                    }]];
                view.saleArtwork = saleArtwork;
                view.saleArtwork.auction = [Sale modelWithJSON:@{ @"start_at" : @"1976-01-30T15:00:00+00:00", @"end_at" : @"2045-01-30T15:00:00+00:00" }];

                view.artwork = [Artwork modelWithJSON:@{ @"sold" : @(false) }];
                [view updateUI];
                [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
                [view layoutIfNeeded];
                expect(view.auctionPriceView).to.haveValidSnapshot();
            });

            it(@"after being outbid with no reserve", ^{
                Bid *highBid = [Bid modelWithJSON:@{ @"id" : @"abc", @"amount_cents" : @(10000000), @"symbol" : @"$" }];
                expect(highBid.cents).to.equal(10000000);
                SaleArtwork *saleArtwork = [SaleArtwork modelFromDictionary:
                    @{
                        @"artworkNumPositions" : @(2),
                        @"saleHighestBid" : highBid,
                        @"minimumNextBidCents" : @(11000000),
                        @"reserveStatus" : @(ARReserveStatusNoReserve),
                        @"currencySymbol" : @"$"
                    }];
                saleArtwork.positions = @[[BidderPosition modelFromDictionary:
                    @{
                        @"bidderPositionID": @"some-other-id",
                        @"highestBid": [Bid modelWithJSON:@{ @"id": @"some-other-id", @"amount_cents": @(9000000), @"symbol" : @"$"}],
                        @"maxBidAmountCents": @(9000000)
                    }]];
                view.saleArtwork = saleArtwork;
                view.saleArtwork.auction = [Sale modelWithJSON:@{ @"start_at" : @"1976-01-30T15:00:00+00:00", @"end_at" : @"2045-01-30T15:00:00+00:00" }];

                view.artwork = [Artwork modelWithJSON:@{ @"sold" : @(false) }];
                [view updateUI];
                [view ensureScrollingWithHeight:CGRectGetHeight(view.bounds)];
                [view layoutIfNeeded];
                expect(view.auctionPriceView).to.haveValidSnapshot();
            });
        });
    });
});

describe(@"mocked artwork promises", ^{
    beforeEach(^{
        id artwork = [OCMockObject mockForClass:[Artwork class]];
        [[[artwork stub] andReturn:[KSPromise new]] onArtworkUpdate:OCMOCK_ANY failure:OCMOCK_ANY];
        [[[artwork stub] andReturn:[KSPromise new]] onSaleArtworkUpdate:OCMOCK_ANY failure:OCMOCK_ANY];

        view.artwork = artwork;
    });

    it(@"forwards contact gallery to delegate", ^{
        id mockDelegate = [OCMockObject mockForProtocol:@protocol(ARArtworkActionsViewButtonDelegate)];
        view.delegate = mockDelegate;

        [[mockDelegate expect] tappedContactGallery];
        [view tappedContactGallery:nil];

        [mockDelegate verify];
    });

    it(@"forwards auction info to delegate", ^{
        id mockDelegate = [OCMockObject mockForProtocol:@protocol(ARArtworkActionsViewButtonDelegate)];
        view.delegate = mockDelegate;

        [[mockDelegate expect] tappedAuctionInfo];
        [view tappedAuctionInfo:nil];

        [mockDelegate verify];
    });

    it(@"forwards conditions of sale to delegate", ^{
        id mockDelegate = [OCMockObject mockForProtocol:@protocol(ARArtworkActionsViewButtonDelegate)];
        view.delegate = mockDelegate;

        [[mockDelegate expect] tappedConditionsOfSale];
        [view tappedConditionsOfSale:nil];

        [mockDelegate verify];
    });

    it(@"forwards bid button to delegate", ^{
        id mockDelegate = [OCMockObject mockForProtocol:@protocol(ARArtworkActionsViewButtonDelegate)];
        view.delegate = mockDelegate;

        [[mockDelegate expect] tappedBidButton:nil saleID:OCMOCK_ANY];
        [view tappedBidButton:nil];

        [mockDelegate verify];
    });

    it(@"forwards buyers premium to delegate", ^{
        id mockDelegate = [OCMockObject mockForProtocol:@protocol(ARArtworkActionsViewButtonDelegate)];
        view.delegate = mockDelegate;

        [[mockDelegate expect] tappedBuyersPremium:nil];
        [view tappedBuyersPremium:nil];

        [mockDelegate verify];
    });

    it(@"forwards buy button to delegate", ^{
        id mockDelegate = [OCMockObject mockForProtocol:@protocol(ARArtworkActionsViewButtonDelegate)];
        view.delegate = mockDelegate;

        [[mockDelegate expect] tappedBuyButton];
        [view tappedBuyButton:nil];

        [mockDelegate verify];
    });

    it(@"forwards more info to delegate", ^{
        id mockDelegate = [OCMockObject mockForProtocol:@protocol(ARArtworkActionsViewButtonDelegate)];
        view.delegate = mockDelegate;

        [[mockDelegate expect] tappedMoreInfo];
        [view tappedMoreInfo:nil];

        [mockDelegate verify];
    });
});

SpecEnd;
