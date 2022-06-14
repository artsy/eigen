#import "Fair.h"

SpecBegin(Fair);

afterEach(^{
    [OHHTTPStubs removeAllStubs];
});

it(@"initialize", ^{
    Fair *fair = [Fair modelWithJSON:@{ @"id" : @"fair-id" }];
    expect(fair.fairID).to.equal(@"fair-id");
    expect(fair.organizer).to.beNil();
});

describe(@"generates a location", ^{
    it(@"has no location", ^{
        Fair *fair = [Fair modelWithJSON:@{
            @"id" : @"fair-id",
        }];
        expect(fair.location).to.beNil();
    });
    
    it(@"as a city", ^{
        Fair *fair = [Fair modelWithJSON:@{
            @"id" : @"fair-id",
            @"location" : @{ @"city": @"Toronto" }
        }];
        expect(fair.location).to.equal(@"Toronto");
    });
    
    it(@"has a state", ^{
        Fair *fair = [Fair modelWithJSON:@{
            @"id" : @"fair-id",
            @"location" : @{ @"state": @"ON" }
        }];
        expect(fair.location).to.equal(@"ON");
    });
    
    it(@"has a city and a state", ^{
        Fair *fair = [Fair modelWithJSON:@{
            @"id" : @"fair-id",
            @"location" : @{ @"city": @"Toronto", @"state" : @"ON" }
        }];
        expect(fair.location).to.equal(@"Toronto, ON");
    });
});

describe(@"getting image URL string", ^{
    it(@"gets nil for no image urls", ^{
        Fair *fair = [Fair modelFromDictionary:@{ @"fairID" : @"fair-id" }];
        expect([fair bannerAddress]).to.beNil();
    });

    it(@"says it doesnt have a new banner format without banner URLs", ^{
        Fair *fair = [Fair modelFromDictionary:@{ @"fairID" : @"fair-id" }];
        expect([fair usesBrandedBanners]).to.beFalsy();
    });

    it (@"gets nil for non-existent image version", ^{
        Fair *fair = [Fair modelFromDictionary:@{
            @"fairID" : @"fair-id",
            @"imageURLs": @{
                @"something_that_we_do_not_support" : @"http://something/something_that_we_do_not_support.jpg"
            }
        }];
        expect([fair bannerAddress]).to.beNil();
    });
    
    it (@"gets wide if availble", ^{
        Fair *fair = [Fair modelFromDictionary:@{
            @"fairID" : @"fair-id",
            @"imageURLs": @{
                @"wide": @"http://something/wide.jpg",
                @"square" : @"http://something/square.jpg"
            }
        }];
        expect([fair bannerAddress]).to.equal(@"http://something/wide.jpg");
    });

    it (@"prioritises banners if availble", ^{
        Fair *fair = [Fair modelFromDictionary:@{
             @"fairID" : @"fair-id",
             @"imageURLs": @{
                 @"wide": @"http://something/wide.jpg",
                 @"square" : @"http://something/square.jpg"
             },
             @"bannerURLs": @{
                 @"wide": @"http://something/banner_wide.jpg",
             }
         }];
        expect([fair bannerAddress]).to.equal(@"http://something/banner_wide.jpg");
    });

    it (@"can work with just banners", ^{
        Fair *fair = [Fair modelFromDictionary:@{
            @"fairID" : @"fair-id",
            @"bannerURLs": @{
                @"wide": @"http://something/banner_wide.jpg",
            }
        }];
        expect([fair bannerAddress]).to.equal(@"http://something/banner_wide.jpg");
    });

});

SpecEnd;
