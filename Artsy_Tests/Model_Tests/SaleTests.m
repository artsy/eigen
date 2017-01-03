SpecBegin(Sale);

describe(@"past auction", ^{
    __block Sale *_pastAuction;

    beforeEach(^{
        _pastAuction = [Sale saleWithStart:[NSDate distantPast] end:[NSDate distantPast]];
    });

    it(@"is not active", ^{
        expect(_pastAuction.isCurrentlyActive).to.beFalsy();
    });
});

describe(@"current auction", ^{
    __block Sale *_currentAuction;

    beforeEach(^{
        _currentAuction = [Sale saleWithStart:[NSDate distantPast] end:[NSDate distantFuture]];
    });

    it(@"is active", ^{
        expect(_currentAuction.isCurrentlyActive).to.beTruthy();
    });
});

describe(@"live auction", ^{
    it(@"doesn't show live button before live auction", ^{
        Sale *sale = [Sale modelWithJSON:@{
            @"start_at" : @"1-12-30 00:00:00",
            @"live_start_at" : @"4000-12-30 00:00:00",
            @"end_at" : @"4001-01-01 00:00:00",
            @"auction_state" : @"preview"
        }];

        expect([sale shouldShowLiveInterface]).to.beFalsy();
    });

    it(@"shows live button while live auction is open", ^{
        Sale *sale = [Sale modelWithJSON:@{
            @"start_at" : @"1-12-30 00:00:00",
            @"live_start_at" : @"1-12-30 00:00:00",
            @"end_at" : @"4001-01-01 00:00:00",
            @"auction_state" : @"open"
        }];

        expect([sale shouldShowLiveInterface]).to.beTruthy();
    });

    it(@"doesn't show live button after live auction closes", ^{
        Sale *sale = [Sale modelWithJSON:@{
            @"start_at" : @"1-12-30 00:00:00",
            @"live_start_at" : @"1-12-30 00:00:00",
            @"end_at" : @"2-01-01 00:00:00",
            @"auction_state" : @"closed"
        }];

        expect([sale shouldShowLiveInterface]).to.beFalsy();
    });
});

describe(@"future auction", ^{
    __block Sale *_futureAuction;

    beforeEach(^{
        _futureAuction = [Sale saleWithStart:[NSDate distantFuture] end:[NSDate distantFuture]];
    });

    it(@"is active", ^{
        expect(_futureAuction.isCurrentlyActive).to.beFalsy();
    });
});

describe(@"propertiess", ^{
    __block Sale *auction;

    it(@"has a buyers premium", ^{
        auction = [Sale saleWithBuyersPremium];
        expect([auction hasBuyersPremium]).to.beTruthy();
    });

    it(@"has a buyers premium", ^{
        auction = [Sale modelWithJSON:@{}];
        expect([auction hasBuyersPremium]).to.beFalsy();
    });

    it(@"returns a banner image", ^{
        NSString *urlString = @"http://example.com";
        auction = [Sale modelWithJSON:@{
            @"image_urls" : @{
                @"wide" : urlString
            }
        }];
        expect([auction bannerImageURLString]).to.equal(urlString);
    });
});


SpecEnd;
