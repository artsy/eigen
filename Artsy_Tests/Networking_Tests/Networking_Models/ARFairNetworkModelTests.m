#import "ARPostFeedItem.h"
#import "ARPartnerShowFeedItem.h"


SpecBegin(ARFairNetworkModel);

__block BOOL gotFairInfo = false;

beforeEach(^{
    gotFairInfo = false;
});

describe(@"getFairInfo", ^{
    before(^{
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/fair/fair-id-1" withResponse:@{
        @"id" : @"fair-id-1",
        @"name" : @"The Fair Name",
        @"start_at" : @"1976-01-30T15:00:00+00:00",
        @"end_at" : @"1976-02-02T15:00:00+00:00"
    }];

    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/layer/synthetic/main/artworks" withResponse:@[]];
    });

    it(@"updates original fair instance", ^{
        Fair *fair = [Fair modelWithJSON:@{ @"id" : @"fair-id-1", @"name" : @"The Armory Show", @"organizer" : @{ @"profile_id" : @"fair-profile-id" } }];
        ARFairNetworkModel *networkModel = [[ARFairNetworkModel alloc] init];

        [networkModel getFairInfo:fair success:^(Fair *returnedFair) {
            gotFairInfo = true;
            expect(returnedFair).to.equal(fair);
            expect(fair.name).to.equal(@"The Fair Name");

        } failure:nil];

        expect(gotFairInfo).to.equal(true);
    });

    it(@"maintains its maps", ^{
        Fair *fair = [Fair modelWithJSON:@{ @"id" : @"fair-id-1", @"name" : @"The Armory Show", @"organizer" : @{ @"profile_id" : @"fair-profile-id" } }];
        fair.maps = @[[[Map alloc] init]];

        ARFairNetworkModel *networkModel = [[ARFairNetworkModel alloc] init];

        [networkModel getFairInfo:fair success:^(Fair *returnedFair) {
            gotFairInfo = true;

            expect(returnedFair).to.equal(fair);
            expect(fair.name).to.equal(@"The Fair Name");
            expect(fair.maps.count).to.equal(1);
        } failure:nil];

        expect(gotFairInfo).to.equal(true);
    });
});

describe(@"getFairInfoWith ID", ^{
    before(^{
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/fair/fair-id-2" withResponse:@{
            @"id" : @"fair-id",
            @"name" : @"The Fair Name",
            @"start_at" : @"1976-01-30T15:00:00+00:00",
            @"end_at" : @"1976-02-02T15:00:00+00:00"
        }];
    });

    it(@"fetches and returns fair", ^{
         ARFairNetworkModel *networkModel = [[ARFairNetworkModel alloc] init];

        [networkModel getFairInfoWithID:@"fair-id-2" success:^(Fair *returnedFair) {

            expect(returnedFair.name).to.equal(@"The Fair Name");
            gotFairInfo = true;

        } failure:nil];

        expect(gotFairInfo).to.equal(true);
    });
});

describe(@"getShowFeedItems", ^{

    it(@"gets items", ^{
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/fair/fair-id-3/shows" withResponse:@{
            @"next" : @"some cursor",
            @"results" : @[ @{ @"id": @"show-id", @"name": @"Show Title", @"_type" : @"PartnerShow" } ]
        }];

        Fair *fair = [Fair modelWithJSON:@{ @"id" : @"fair-id-3", @"name" : @"The Armory Show", @"organizer" : @{ @"profile_id" : @"fair-profile-id" } }];

        // Keep the feed out here so that it doesn't become nil when weakified during the request.
        __block ARFairShowFeed *feed = [[ARFairShowFeed alloc] initWithFair:fair];

        ARFairNetworkModel *networkModel = [[ARFairNetworkModel alloc] init];

        [networkModel getShowFeedItems:feed success:^(NSOrderedSet *orderedSet) {

            expect(orderedSet.count).to.equal(1);
            expect(orderedSet[0]).to.beKindOf([ARPartnerShowFeedItem class]);

            ARPartnerShowFeedItem *item = orderedSet[0];
            expect(item.show.name).to.equal(@"Show Title");
            gotFairInfo = true;

        } failure:^(NSError *error) {

        }];

        expect(gotFairInfo).to.equal(true);
    });
});


it(@"getPosts", ^{
    before(^{
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/profile/fair-profile-id/posts" withResponse:@{
            @"cursor" : @"some cursor",
            @"results" : @[ @{ @"id": @"post-id", @"title": @"Post Title", @"_type" : @"Post" } ]
        }];
    });

    it(@"returns feed timeline", ^{
        Fair *fair = [Fair modelWithJSON:@{ @"id" : @"fair-id-4", @"name" : @"The Armory Show", @"organizer" : @{ @"profile_id" : @"fair-profile-id" } }];
        ARFairNetworkModel *networkModel = [[ARFairNetworkModel alloc] init];

        [networkModel getPostsForFair:fair success:^(ARFeedTimeline *feedTimeline) {

            expect([feedTimeline numberOfItems]).to.equal(1);

            ARPostFeedItem *item = (ARPostFeedItem *) [feedTimeline itemAtIndex:0];
            expect(item).toNot.beNil();
            expect([item feedItemID]).to.equal(@"post-id");

            gotFairInfo = true;
        }];

        expect(gotFairInfo).to.equal(true);
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

        Fair *fair = [Fair modelWithJSON:@{ @"id" : @"fair-id-5", @"name" : @"The Armory Show", @"organizer" : @{ @"profile_id" : @"fair-profile-id" } }];
        ARFairNetworkModel *networkModel = [[ARFairNetworkModel alloc] init];

        [networkModel getOrderedSetsForFair:fair success:^(NSMutableDictionary *orderedSets) {
            expect(orderedSets.count).to.equal(2);

            NSArray *curatorOrderedSets = orderedSets[@"curator"];
            expect(curatorOrderedSets).toNot.beNil();
            expect(curatorOrderedSets.count).to.equal(2);

            OrderedSet *first = (OrderedSet *) curatorOrderedSets[0];
            expect(first).toNot.beNil();
            expect(first.orderedSetID).to.equal(@"52ded6edc9dc24bccc0000a4");
            expect(first.name).to.equal(@"Highlights from Art World Influencers");
            expect(first.orderedSetDescription).to.beNil();

            // TODO: item type
            gotFairInfo = true;


        } failure:^(NSError *error) {

        }];

        expect(gotFairInfo).to.beTruthy();
    });
});

describe(@"getMapInfo", ^{
    before(^{
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/maps" withParams:@{@"fair_id" : @"fair-id-6" } withResponse:@[@{@"_id" : @"map-id"}]];
    });

    it(@"returns maps for fair", ^{
        Fair *fair = [Fair modelWithJSON:@{ @"id" : @"fair-id-6", @"name" : @"The Armory Show", @"organizer" : @{ @"profile_id" : @"fair-profile-id" } }];
        ARFairNetworkModel *networkModel = [[ARFairNetworkModel alloc] init];

        [networkModel getMapInfoForFair:fair success:^(NSArray *maps) {
            gotFairInfo = true;

            expect(fair.maps).to.equal(maps);
            expect(maps.count).to.equal(1);

        } failure:^(NSError *error) {
            failure(@"Should not fail");
        }];

        expect(gotFairInfo).to.beTruthy();
    });
});


SpecEnd;
