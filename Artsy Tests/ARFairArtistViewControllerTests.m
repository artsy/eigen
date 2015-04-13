#import "ARFairAwareObject.h"
#import "ARFairArtistViewController.h"
#import "ARFairArtistNetworkModel.h"

@interface ARFairArtistViewController (Tests)
@property (nonatomic, assign, readwrite) BOOL shouldAnimate;
@property (nonatomic, strong, readwrite) NSObject <FairArtistNeworkModel> *networkModel;
@end

SpecBegin(ARFairArtistViewController)

__block ARFairArtistViewController *fairArtistVC = nil;
__block Fair *fair = nil;
__block Artist *artist  = nil;
__block NSArray *fairShows = nil;
__block ARStubbedFairArtistNetworkModel *model = nil;

beforeEach(^{
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/me/follow/artists" withParams:@{@"artists[]" : @"some-artist"} withResponse:@[]];
    fair = [Fair modelWithJSON:@{ @"id" : @"fair-id", @"name" : @"The Armory Show", @"organizer" : @{ @"profile_id" : @"fair-profile-id" } }];
    model = [[ARStubbedFairArtistNetworkModel alloc] init];
    model.artist = [Artist modelWithJSON:@{ @"id" : @"some-artist", @"name" : @"Some Artist", @"birthday" : @"1999", @"nationality" : @"Chinese"}];
    model.shows = @[];
});

afterEach(^{
  [OHHTTPStubs removeAllStubs];
});

describe(@"with subtitle", ^{

  describe(@"without maps", ^{
      beforeEach(^{
          [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/maps" withParams:@{ @"fair_id" : @"fair-id" } withResponse:@[]];
          fairArtistVC = [[ARFairArtistViewController alloc] initWithArtistID:@"some-artist" fair:fair];

          fairArtistVC.networkModel = model;

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
          fairArtistVC.networkModel = model;

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
      fairArtistVC = [[ARFairArtistViewController alloc] initWithArtistID:@"some-artist" fair:fair];
      fairArtistVC.networkModel = model;

      [fairArtistVC ar_presentWithFrame:CGRectMake(0, 0, 320, 480)];
      [fairArtistVC.view snapshotViewAfterScreenUpdates:YES];
      expect(fairArtistVC.view).will.haveValidSnapshot();
  });

  it(@"displays artist title and map button without birthday", ^{
      fairArtistVC = [[ARFairArtistViewController alloc] initWithArtistID:@"some-artist" fair:fair];
      fairArtistVC.networkModel = model;

      [fairArtistVC ar_presentWithFrame:CGRectMake(0, 0, 320, 480)];
      [fairArtistVC.view snapshotViewAfterScreenUpdates:YES];
      expect(fairArtistVC.view).will.haveValidSnapshot();
  });
});

SpecEnd
