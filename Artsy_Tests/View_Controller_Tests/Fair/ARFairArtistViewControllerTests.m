#import "ARFairAwareObject.h"
#import "ARFairArtistViewController.h"
#import "ARFairArtistNetworkModel.h"

 @interface ARFairArtistViewController (Tests)
 @property (nonatomic, strong, readwrite) NSObject <FairArtistNeworkModel> *networkModel;
 @end

 SpecBegin(ARFairArtistViewController)

 void (^itlooksCorrectWithArtist)(Artist* artist, NSArray *maps) = ^void(Artist *artist, NSArray *mapsJSON) {

     Fair *fair = [Fair modelWithJSON:@{
         @"id" : @"fair-id",
         @"name" : @"The Armory Show",
         @"organizer" : @{ @"profile_id" : @"fair-profile-id" },
     }];

     ARStubbedFairNetworkModel *fairNetworkModel = [[ARStubbedFairNetworkModel alloc] init];
     fairNetworkModel.maps = [mapsJSON map:^Map*(NSDictionary *mapJSON) { return [Map modelWithJSON:mapJSON]; }];

     fair.networkModel = fairNetworkModel;

     [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/me/follow/artists" withResponse:@[]];
     [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/maps" withParams:@{ @"fair_id" : @"fair-id" } withResponse:mapsJSON];

     ARStubbedFairArtistNetworkModel *fairArtistNetworkModel = [[ARStubbedFairArtistNetworkModel alloc] init];
     fairArtistNetworkModel.artist = artist;
     fairArtistNetworkModel.shows = @[];

     ARFairArtistViewController *fairArtistVC = [[ARFairArtistViewController alloc] initWithArtistID:@"some-artist" fair:fair];
     fairArtistVC.networkModel = fairArtistNetworkModel;
     [fairArtistVC ar_presentWithFrame:CGRectMake(0, 0, 320, 480)];
     [fairArtistVC.view snapshotViewAfterScreenUpdates:YES];
     expect(fairArtistVC.view).will.haveValidSnapshot();

 };

 sharedExamples(@"looks correct", ^(NSDictionary *data) {
     __block NSArray *mapsJSON = data[@"mapsJSON"];

     it(@"show subtitle with a birthdate and a nationality", ^{
         Artist *artist = [Artist modelWithJSON:@{ @"id" : @"some-artist", @"name" : @"Some Artist", @"birthday" : @"1999", @"nationality" : @"Chinese"}];
         itlooksCorrectWithArtist(artist, mapsJSON);
     });

     it(@"hides subtitle without a birthdate", ^{
         Artist *artist = [Artist modelWithJSON:@{ @"id" : @"some-artist", @"name" : @"Some Artist", @"nationality" : @"Chinese"}];
         itlooksCorrectWithArtist(artist, mapsJSON);
     });

     it(@"hides subtitle without a nationality", ^{
         Artist *artist = [Artist modelWithJSON:@{ @"id" : @"some-artist", @"name" : @"Some Artist", @"birthday" : @"1999"}];
         itlooksCorrectWithArtist(artist, mapsJSON);
     });

 });

 describe(@"with maps", ^{
     itBehavesLike(@"looks correct", @{@"mapsJSON": @[@{ @"id" : @"map-id" }] });
 });

 describe(@"without maps", ^{
     itBehavesLike(@"looks correct", @{@"mapsJSON": @[] });
 });

 SpecEnd;
