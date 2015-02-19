#import "ARFeedItems.h"

@interface Fair ()

@property (nonatomic, copy) NSArray *maps;

@end

SpecBegin(Fair)

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

it(@"getPosts", ^{
    Fair *fair = [Fair modelFromDictionary:@{
        @"organizer" : [FairOrganizer modelFromDictionary:@{
            @"profileID" : @"art-los-angeles-contemporary-profile"
        }]
    }];

    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/profile/art-los-angeles-contemporary-profile/posts"
                           withResponse:@{ @"results" : @[ @{ @"id": @"post-id", @"title": @"Post Title", @"_type" : @"Post" } ] }];

    __block ARFeedTimeline * _feedTimeline = nil;
    [fair getPosts:^(ARFeedTimeline *feedTimeline) {
        _feedTimeline = feedTimeline;
    }];

    expect(_feedTimeline).willNot.beNil();
    expect([_feedTimeline numberOfItems]).to.equal(1);
    ARPostFeedItem *item = (ARPostFeedItem *) [_feedTimeline itemAtIndex:0];
    expect(item).toNot.beNil();
    expect([item feedItemID]).to.equal(@"post-id");
});

it(@"getOrderedSets", ^{
    Fair *fair = [Fair modelWithDictionary:@{ @"fairID" : @"fair-id" } error:nil];

    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/sets" withResponse:@[
        @{ @"id": @"52ded6edc9dc24bccc0000a4", @"key": @"curator", @"name" : @"Highlights from Art World Influencers", @"item_type" : @"FeaturedLink" },
        @{ @"id": @"52ded6edc9dc24bccc0000a5", @"key": @"curator", @"name" : @"Other Highlights", @"item_type" : @"FeaturedLink" },
        @{ @"id": @"52ded6edc9dc24bccc0000b5", @"key": @"something else", @"name" : @"Something Else", @"item_type" : @"FeaturedLink" }
    ]];

    __block NSMutableDictionary * _orderedSets = nil;
    [fair getOrderedSets:^(NSMutableDictionary *orderedSets) {
        _orderedSets = orderedSets;
    }];

    expect(_orderedSets).willNot.beNil();
    expect(_orderedSets.count).to.equal(2);

    NSArray *curatorOrderedSets = _orderedSets[@"curator"];
    expect(curatorOrderedSets).toNot.beNil();
    expect(curatorOrderedSets.count).to.equal(2);

    OrderedSet *first = (OrderedSet *) curatorOrderedSets[0];
    expect(first).toNot.beNil();
    expect(first.orderedSetID).to.equal(@"52ded6edc9dc24bccc0000a4");
    expect(first.name).to.equal(@"Highlights from Art World Influencers");
    expect(first.orderedSetDescription).to.beNil();
    // TODO: item type
});

describe(@"getting shows", ^{
    Fair *fair = [Fair modelFromDictionary:@{ @"fairID" : @"fair-id" }];

    beforeEach(^{
        [OHHTTPStubs
            stubJSONResponseAtPath:@"/api/v1/fair/fair-id/shows"
            withResponse:@{
                @"results": @[@{
                    @"id": @"thomas-solomon-gallery-thomas-solomon-gallery-at-art-los-angeles-contemporary-2014",
                    @"name": @"Thomas Solomon Gallery at Art Los Angeles Contemporary 2014",
                    @"_type": @"PartnerShow"
                }]
            }];
    });
    
    it(@"maintains its maps", ^{
        
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/fair/fair-id" withResponse:@{
            @"id" : @"fair-id",
            @"name" : @"The Fair Name",
            @"start_at" : @"1976-01-30T15:00:00+00:00",
            @"end_at" : @"1976-02-02T15:00:00+00:00"
        }];
        
        __block BOOL called = NO;
        fair.maps = [NSArray array];
        [fair updateFair:^{
            called = YES;
        }];
        
        expect(called).will.beTruthy();
        expect(fair.maps).willNot.beNil();
    });

    it(@"return a fair's shows", ^{
        __block NSArray *shows = nil;

        [fair onShowsUpdate:^(NSArray *result) {
                shows = result;
        } failure:^(NSError *error) { }];

        expect(shows).willNot.beNil();
        expect(shows).will.haveCountOf(1);
        expect([shows.firstObject name]).will.equal(@"Thomas Solomon Gallery at Art Los Angeles Contemporary 2014");
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

SpecEnd
