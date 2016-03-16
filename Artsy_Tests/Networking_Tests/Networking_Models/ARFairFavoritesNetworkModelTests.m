#import "ARFairFavoritesNetworkModel.h"
#import "ARUserManager+Stubs.h"
#import "ARUserManager.h"
#import "ArtsyAPI.h"
#import "ArtsyAPI+Fairs.h"


@interface Fair (Testing)

@property (nonatomic, copy) NSMutableSet *shows;

@end

SpecBegin(ARFairFavoritesNetworkModel);

beforeEach(^{
    [ARUserManager stubAndLoginWithUsername];
});

afterEach(^{
    [ARUserManager clearUserData];
    [OHHTTPStubs removeAllStubs];
});

it(@"ignores artworks without a partner", ^{
    waitUntil(^(DoneCallback done) {
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/sets" withResponse:@{}];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/collection/saved-artwork/artworks"
                                 withParams:@{ @"fair_id" : @"fair-id",
                                               @"user_id" : [ARUserManager sharedManager].currentUser.userID,
                                               @"private" : @YES }
                               withResponse:@[ @{ @"id": @"one", @"partner" : @{ @"id" : @"partner-id" } },
                                               @{ @"id": @"two" } ]
        ];

        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/me/follow/profiles"
                                 withParams:@{ @"fair_id" : @"fair-id" }
                               withResponse:@[]
        ];

        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/me/follow/artists"
                                 withParams:@{ @"fair_id" : @"fair-id" }
                               withResponse:@[]
        ];

        Fair *fair = [Fair modelWithJSON:@{ @"id" : @"fair-id" }];

        ARFairFavoritesNetworkModel *favoritesNetworkModel = [[ARFairFavoritesNetworkModel alloc] init];
        [favoritesNetworkModel getFavoritesForNavigationsButtonsForFair:fair artworks:^(NSArray *work) {
            expect(work.count).to.equal(2);
            done();
        } artworksByArtists:nil exhibitors:nil artists:nil failure:nil];
    });
});

describe(@"when downloading exhibitor data", ^{
    __block PartnerShow *partnerShow;
    __block id fairMock;
    
    beforeEach(^{
        partnerShow = [PartnerShow modelWithJSON:@{
            @"id" : @"show-id",
            @"fair_location" : @{ @"display" : @"Pier 1, Booth 2, Section 3, Floor 5" },
            @"partner" : @{ @"id" : @"leila-heller", @"name" : @"Leila Heller Gallery in New York City" }
        }];
    });
    
    it(@"generates random exhibitors when no values are returned from API", ^{
        Fair *fair = [Fair modelWithJSON:@{ @"id" : @"fair-id-1" }];

        fairMock = [OCMockObject partialMockForObject:fair];

        [[[fairMock stub] andDo:^(NSInvocation *invocation) {
            [fair willChangeValueForKey:@"shows"];
            fair.shows = [NSMutableSet setWithObject:partnerShow];
            [fair didChangeValueForKey:@"shows"];

        }] downloadShows];

        __block NSArray *testExhibitors;

        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/me/follow/profiles" withParams:@{@"fair_id" : @"fair-id-1"} withResponse:@[]];

        ARFairFavoritesNetworkModel *favoritesNetworkModel = [[ARFairFavoritesNetworkModel alloc] init];
        [favoritesNetworkModel getFavoritesForNavigationsButtonsForFair:fairMock artworks:nil artworksByArtists:nil exhibitors:^(NSArray *exhibitors) {
            testExhibitors = exhibitors;
        } artists:nil failure:nil];

        expect(testExhibitors.count).will.equal(1);
        NSDictionary *button = testExhibitors.firstObject;
        expect(button[@"ARNavigationButtonPropertiesKey"][@"title"]).will.equal(@"Leila Heller Gallery in New York City");
        expect(button[@"ARNavigationButtonPropertiesKey"][@"subtitle"]).will.equal(@"Pier 1, Booth 2, Section 3, Floor 5");
    });

    it(@"returns correct exhibitors when values are returned from API", ^{
        Fair *fair = [Fair modelWithJSON:@{ @"id" : @"fair-id-2" }];

        fairMock = [OCMockObject partialMockForObject:fair];

        [[[fairMock stub] andDo:^(NSInvocation *invocation) {
            [fair willChangeValueForKey:@"shows"];
            fair.shows = [NSMutableSet setWithObject:partnerShow];
            [fair didChangeValueForKey:@"shows"];

        }] downloadShows];

        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/me/follow/profiles" withParams:@{@"fair_id": @"fair-id-2"} withResponse:@[
        @{
            @"id" : @"follow-id",
            @"profile" : @{
                @"id" : @"profile-id",
                @"owner_type" : @"PartnerGallery",
                @"owner": @{
                    @"id" : @"leila-heller",
                    @"name" : @"Leila Heller Gallery in New York City"
                }
            }
        }]];

        __block NSArray *testExhibitors;


        ARFairFavoritesNetworkModel *favoritesNetworkModel = [[ARFairFavoritesNetworkModel alloc] init];
        [favoritesNetworkModel getFavoritesForNavigationsButtonsForFair:fairMock artworks:nil artworksByArtists:nil exhibitors:^(NSArray *exhibitors) {
            testExhibitors = exhibitors;
        } artists:nil failure:nil];

        expect(testExhibitors.count).will.equal(1);
        NSDictionary *button = testExhibitors.firstObject;
        expect(button[@"ARNavigationButtonPropertiesKey"][@"title"]).will.equal(@"Leila Heller Gallery in New York City");
        expect(button[@"ARNavigationButtonPropertiesKey"][@"subtitle"]).will.equal(@"Pier 1, Booth 2, Section 3, Floor 5");
    });
});

SpecEnd;
