#import "ARFairFavoritesNetworkModel.h"
#import "ARUserManager+Stubs.h"
#import "ARUserManager.h"
#import "ArtsyAPI.h"
#import "ArtsyAPI+Fairs.h"

@interface Fair (Testing)

@property (nonatomic, copy) NSMutableSet *shows;

@end

SpecBegin(ARFairFavoritesNetworkModel)

__block Fair *fair;
beforeEach(^{
    [ARUserManager stubAndLoginWithUsername];
    fair = [Fair modelWithJSON:@{ @"id" : @"fair-id" }];
});

afterEach(^{
    [[ARUserManager sharedManager] logout];
    [OHHTTPStubs removeAllStubs];
});

it(@"ignores artworks without a partner", ^{
    waitUntil(^(DoneCallback done) {
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
        
        ARFairFavoritesNetworkModel *favoritesNetworkModel = [[ARFairFavoritesNetworkModel alloc] init];
        [favoritesNetworkModel getFavoritesForNavigationsButtonsForFair:fair artwork:^(NSArray *work) {
            expect(work.count).to.equal(2);
            done();
        } exhibitors:^(NSArray *exhibitors) {
        } artists:^(NSArray *artists) {
        } failure:nil];
    });
});

describe(@"when downloading exhibitor data", ^{
    __block PartnerShow *partnerShow;
    __block id apiMock;
    __block id fairMock;
    
    beforeEach(^{
        partnerShow = [PartnerShow modelWithJSON:@{
            @"id" : @"show-id",
            @"fair_location" : @{ @"display" : @"Pier 1, Booth 2, Section 3, Floor 5" },
            @"partner" : @{ @"id" : @"leila-heller", @"name" : @"Leila Heller Gallery in New York City" }
        }];

        apiMock = [OCMockObject mockForClass:[ArtsyAPI class]];
        fairMock = [OCMockObject partialMockForObject:fair];
        
        [[[fairMock stub] andDo:^(NSInvocation *invocation) {
            [fair willChangeValueForKey:@"shows"];
            fair.shows = [NSMutableSet setWithObject:partnerShow];
            [fair didChangeValueForKey:@"shows"];
            
        }] downloadShows];
    });
    
    afterEach(^{
        [apiMock stopMocking];
    });
    
    it(@"generates random exhibitors when no values are returned from API", ^{
        waitUntil(^(DoneCallback done) {

            [[apiMock stub] getProfileFollowsForFair:OCMOCK_ANY success:[OCMArg checkWithBlock:^BOOL(void (^block)(NSArray *)) {
                if (block) {
                    block(@[]);
                }
                return true;
            }] failure:OCMOCK_ANY];
            
            ARFairFavoritesNetworkModel *favoritesNetworkModel = [[ARFairFavoritesNetworkModel alloc] init];
            [favoritesNetworkModel getFavoritesForNavigationsButtonsForFair:fairMock artwork:^(NSArray *work) {
            } exhibitors:^(NSArray *exhibitors) {
                expect(exhibitors.count).to.equal(1);
                NSDictionary *button = exhibitors.firstObject;
                expect(button[@"ARNavigationButtonPropertiesKey"][@"title"]).to.equal(@"Leila Heller Gallery in New York City");
                expect(button[@"ARNavigationButtonPropertiesKey"][@"subtitle"]).to.equal(@"Pier 1, Booth 2, Section 3, Floor 5");
                done();
            } artists:^(NSArray *artists) {
            } failure:nil];
        });
    });
    
    it(@"returns correct exhibitors when values are returned from API", ^{
        waitUntil(^(DoneCallback done) {

            Partner *partner = [Partner modelWithJSON:@{
                @"id" : @"leila-heller", @"name" : @"Leila Heller Gallery in New York City"
            }];
            
            Profile *profile = [Profile modelWithJSON:@{
                @"id" : @"profile-id",
                @"owner_type" : @"FairOrganizer",
            }];
            
            id profileMock = [OCMockObject partialMockForObject:profile];
            [[[profileMock stub] andReturn:partner] profileOwner];
            
            id followMock = [OCMockObject mockForClass:[Follow class]];
            [[[followMock stub] andReturn:profileMock] profile];
            
            [[apiMock stub] getProfileFollowsForFair:OCMOCK_ANY success:[OCMArg checkWithBlock:^BOOL(void (^block)(NSArray *)) {
                if (block) {
                    block(@[followMock]);
                }
                return true;
            }] failure:OCMOCK_ANY];
            
            ARFairFavoritesNetworkModel *favoritesNetworkModel = [[ARFairFavoritesNetworkModel alloc] init];
            [favoritesNetworkModel getFavoritesForNavigationsButtonsForFair:fairMock artwork:^(NSArray *work) {
            } exhibitors:^(NSArray *exhibitors) {
                expect(exhibitors.count).to.equal(1);
                NSDictionary *button = exhibitors.firstObject;
                expect(button[@"ARNavigationButtonPropertiesKey"][@"title"]).to.equal(@"Leila Heller Gallery in New York City");
                expect(button[@"ARNavigationButtonPropertiesKey"][@"subtitle"]).to.equal(@"Pier 1, Booth 2, Section 3, Floor 5");
                done();
            } artists:^(NSArray *artists) {
            } failure:nil];
        });
    });
});

SpecEnd
