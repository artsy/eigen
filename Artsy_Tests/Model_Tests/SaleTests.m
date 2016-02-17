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

    it(@"has a buyers premium", ^{
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
