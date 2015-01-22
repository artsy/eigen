#import "ARFairAwareObject.h"
#import "ARFairArtistViewController.h"

@interface ARFairArtistViewController (Tests)
@property (nonatomic, assign, readwrite) BOOL shouldAnimate;
@end

SpecBegin(ARFairArtistViewController)

__block ARFairArtistViewController *fairArtistVC = nil;
__block Fair *fair = nil;

beforeEach(^{
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/artist/some-artist" withResponse:@{ @"id" : @"some-artist", @"name" : @"Some Artist" }];
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/fair/fair-id/shows" withParams:@{@"artist" : @"some-artist"} withResponse:@[]];
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/me/follow/artists" withParams:@{@"artists[]" : @"some-artist"} withResponse:@[]];
    fair = [Fair modelWithJSON:@{ @"id" : @"fair-id", @"name" : @"The Armory Show", @"organizer" : @{ @"profile_id" : @"fair-profile-id" } }];
});

describe(@"without maps", ^{
    beforeEach(^{
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/maps" withParams:@{ @"fair_id" : @"fair-id" } withResponse:@[]];
        fairArtistVC = [[ARFairArtistViewController alloc] initWithArtistID:@"some-artist" fair:fair];
        [fairArtistVC ar_presentWithFrame:CGRectMake(0, 0, 320, 480)];
    });

    afterEach(^{
        [OHHTTPStubs removeAllStubs];
    });

    it(@"displays artist title", ^{
        expect(fairArtistVC.view).will.haveValidSnapshot();
    });
});

describe(@"with maps", ^{
    beforeEach(^{
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/maps" withParams:@{ @"fair_id" : @"fair-id" } withResponse:@[@{ @"id" : @"map-id" }]];
        fairArtistVC = [[ARFairArtistViewController alloc] initWithArtistID:@"some-artist" fair:fair];
        [fairArtistVC ar_presentWithFrame:CGRectMake(0, 0, 320, 480)];
    });

    afterEach(^{
        [OHHTTPStubs removeAllStubs];
    });
    
    it(@"displays artist title and map button", ^{
        expect(fairArtistVC.view).will.haveValidSnapshot();
    });
});

SpecEnd
