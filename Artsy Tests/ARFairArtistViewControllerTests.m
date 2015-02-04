#import "ARFairAwareObject.h"
#import "ARFairArtistViewController.h"

@interface ARFairArtistViewController (Tests)
@property (nonatomic, assign, readwrite) BOOL shouldAnimate;
@end

SpecBegin(ARFairArtistViewController)

__block ARFairArtistViewController *fairArtistVC = nil;
__block Fair *fair = nil;

beforeEach(^{
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/fair/fair-id/shows" withParams:@{@"artist" : @"some-artist"} withResponse:@[]];
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/me/follow/artists" withParams:@{@"artists[]" : @"some-artist"} withResponse:@[]];
    fair = [Fair modelWithJSON:@{ @"id" : @"fair-id", @"name" : @"The Armory Show", @"organizer" : @{ @"profile_id" : @"fair-profile-id" } }];
});

afterEach(^{
  [OHHTTPStubs removeAllStubs];
});

describe(@"with subtitle", ^{
  beforeEach(^{
      [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/artist/some-artist" withResponse:@{ @"id" : @"some-artist", @"name" : @"Some Artist", @"birthday" : @"1999", @"nationality" : @"Chinese" }];
  });

  describe(@"without maps", ^{
      beforeEach(^{
          [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/maps" withParams:@{ @"fair_id" : @"fair-id" } withResponse:@[]];
          fairArtistVC = [[ARFairArtistViewController alloc] initWithArtistID:@"some-artist" fair:fair];
          [fairArtistVC ar_presentWithFrame:CGRectMake(0, 0, 320, 480)];
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

      it(@"displays artist title and map button", ^{
          expect(fairArtistVC.view).will.haveValidSnapshot();
      });
  });
});

describe(@"without subtitle", ^{
  beforeEach(^{
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/maps" withParams:@{ @"fair_id" : @"fair-id" } withResponse:@[@{ @"id" : @"map-id" }]];
  });
  
  it(@"displays artist title and map button without nationality", ^{
      [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/artist/some-artist" withResponse:@{ @"id" : @"some-artist", @"name" : @"Some Artist", @"birthday" : @"1999" }];
      fairArtistVC = [[ARFairArtistViewController alloc] initWithArtistID:@"some-artist" fair:fair];
      [fairArtistVC ar_presentWithFrame:CGRectMake(0, 0, 320, 480)];
      expect(fairArtistVC.view).will.haveValidSnapshot();
  });

  it(@"displays artist title and map button without birthday", ^{
      [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/artist/some-artist" withResponse:@{ @"id" : @"some-artist", @"name" : @"Some Artist", @"nationality" : @"Chinese" }];
      fairArtistVC = [[ARFairArtistViewController alloc] initWithArtistID:@"some-artist" fair:fair];
      [fairArtistVC ar_presentWithFrame:CGRectMake(0, 0, 320, 480)];
      expect(fairArtistVC.view).will.haveValidSnapshot();
  });
});

SpecEnd
