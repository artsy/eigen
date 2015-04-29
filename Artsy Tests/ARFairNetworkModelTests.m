#import "ARPostFeedItem.h"
#import "ARPartnerShowFeedItem.h"

SpecBegin (ARFairNetworkModel)

__block ARFairNetworkModel *networkModel;
__block Fair *fair;
before(^{
    fair = [Fair modelWithJSON:@{ @"id" : @"fair-id", @"name" : @"The Armory Show", @"organizer" : @{ @"profile_id" : @"fair-profile-id" } }];
    networkModel = [[ARFairNetworkModel alloc] init];
});

describe(@"getFairInfo", ^{
    before(^{
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/fair/fair-id" withResponse:@{
            @"id" : @"fair-id",
            @"name" : @"The Fair Name",
            @"start_at" : @"1976-01-30T15:00:00+00:00",
            @"end_at" : @"1976-02-02T15:00:00+00:00"
        }];
    });

    it(@"updates original fair instance", ^{
        __block BOOL called = NO;
        __block Fair *testFair;

        [networkModel getFairInfo:fair success:^(Fair *fair) {
            testFair = fair;
            called = YES;
        } failure:nil];

        expect(called).will.beTruthy();
        expect(testFair).to.equal(fair);
        expect(fair.name).to.equal(@"The Fair Name");
    });

    it(@"maintains its maps", ^{
        __block BOOL called = NO;
        [networkModel getFairInfo:fair success:^(Fair *fair) {
            called = YES;
        } failure:nil];

        expect(called).will.beTruthy();

        fair.maps = [NSArray array];
        expect(fair.maps).willNot.beNil();
    }); 
});

describe(@"getFairInfoWith ID", ^{
    before(^{
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/fair/fair-id" withResponse:@{
            @"id" : @"fair-id",
            @"name" : @"The Fair Name",
            @"start_at" : @"1976-01-30T15:00:00+00:00",
            @"end_at" : @"1976-02-02T15:00:00+00:00"
        }];
    });

    it(@"fetches and returns fair", ^{
        __block BOOL called = NO;
        __block Fair *testFair;
        
        [networkModel getFairInfoWithID:@"fair-id" success:^(Fair *returnedFair) {
            testFair = returnedFair;
            called = YES;
        } failure:nil];
        
        expect(called).will.beTruthy();
        expect(testFair.name).to.equal(@"The Fair Name");
    });
});

describe(@"getShowFeedItems", ^{
    before(^{
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/fair/fair-id/shows" withResponse:@{
            @"next" : @"some cursor",
            @"results" : @[ @{ @"id": @"show-id", @"name": @"Show Title", @"_type" : @"PartnerShow" } ]
        }];
    });

    it(@"gets items", ^{
        ARFairShowFeed *feed = [[ARFairShowFeed alloc] initWithFair:fair];
        __block NSOrderedSet *testOrderedSet;
        
        [networkModel getShowFeedItems:feed success:^(NSOrderedSet *orderedSet) {
            testOrderedSet = orderedSet;
        } failure:nil];

        expect(testOrderedSet.count).will.equal(1);
        expect(testOrderedSet[0]).will.beKindOf([ARPartnerShowFeedItem class]);
        ARPartnerShowFeedItem *item = testOrderedSet[0];
        expect(item.show.name).will.equal(@"Show Title");
    });
});


it(@"getPosts", ^{
    before(^{
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/profile/art-los-angeles-contemporary-profile/posts" withResponse:@{
            @"cursor" : @"some cursor",
            @"results" : @[ @{ @"id": @"post-id", @"title": @"Post Title", @"_type" : @"Post" } ]
        }];
    });

    it(@"returns feed timeline", ^{
        __block ARFeedTimeline * testFeedTimeline = nil;

        [networkModel getPostsForFair:fair success:^(ARFeedTimeline *feedTimeline) {
            testFeedTimeline = feedTimeline;
        }];

        expect(testFeedTimeline).willNot.beNil();
        expect([testFeedTimeline numberOfItems]).to.equal(1);
        ARPostFeedItem *item = (ARPostFeedItem *) [testFeedTimeline itemAtIndex:0];
        expect(item).toNot.beNil();
        expect([item feedItemID]).to.equal(@"post-id");
    });
});

describe(@"getOrderedSets", ^{
    before(^{
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/sets" withResponse:@[
            @{ @"id": @"52ded6edc9dc24bccc0000a4", @"key": @"curator", @"name" : @"Highlights from Art World Influencers", @"item_type" : @"FeaturedLink" },
            @{ @"id": @"52ded6edc9dc24bccc0000a5", @"key": @"curator", @"name" : @"Other Highlights", @"item_type" : @"FeaturedLink" },
            @{ @"id": @"52ded6edc9dc24bccc0000b5", @"key": @"something else", @"name" : @"Something Else", @"item_type" : @"FeaturedLink" }
        ]];

    });

    it(@"returns ordered sets by key", ^{
        __block NSMutableDictionary *testOrderedSets = nil;

        [networkModel getOrderedSetsForFair:fair success:^(NSMutableDictionary *orderedSets) {
            testOrderedSets = orderedSets;
        } failure:nil];

        expect(testOrderedSets).willNot.beNil();
        expect(testOrderedSets.count).to.equal(2);

        NSArray *curatorOrderedSets = testOrderedSets[@"curator"];
        expect(curatorOrderedSets).toNot.beNil();
        expect(curatorOrderedSets.count).to.equal(2);

        OrderedSet *first = (OrderedSet *) curatorOrderedSets[0];
        expect(first).toNot.beNil();
        expect(first.orderedSetID).to.equal(@"52ded6edc9dc24bccc0000a4");
        expect(first.name).to.equal(@"Highlights from Art World Influencers");
        expect(first.orderedSetDescription).to.beNil();
        // TODO: item type
    });
});

describe(@"getMapInfo", ^{
    before(^{
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/maps" withParams:@{@"fair_id" : @"fair-id" } withResponse:@[@{@"_id" : @"map-id"}]];
    });

    it(@"returns maps for fair", ^{
        __block NSArray *testMaps;
        [networkModel getMapInfoForFair:fair success:^(NSArray *maps) {
            testMaps = maps;
        } failure:nil];
        expect(fair.maps).will.equal(testMaps);
        expect(testMaps.count).will.equal(1);
    });
});


SpecEnd