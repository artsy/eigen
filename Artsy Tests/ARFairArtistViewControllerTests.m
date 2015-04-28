#import "ARFairAwareObject.h"
#import "ARFairArtistViewController.h"
#import "ARFairArtistNetworkModel.h"

@interface ARFairArtistViewController (Tests)
@property (nonatomic, assign, readwrite) BOOL shouldAnimate;
@property (nonatomic, strong, readwrite) NSObject <FairArtistNeworkModel> *networkModel;
@end

SpecBegin(ARFairArtistViewController)

void (^itlooksCorrectWithArtist)(Artist* artist) = ^void(Artist *artist) {

    ARStubbedFairArtistNetworkModel *model = [[ARStubbedFairArtistNetworkModel alloc] init];
    model.artist = artist;
    model.shows = @[];

    Fair *fair = [Fair modelWithJSON:@{ @"id" : @"fair-id", @"name" : @"The Armory Show", @"organizer" : @{ @"profile_id" : @"fair-profile-id" } }];
    ARFairArtistViewController *fairArtistVC = [[ARFairArtistViewController alloc] initWithArtistID:@"some-artist" fair:fair];
    fairArtistVC.networkModel = model;
    [fairArtistVC ar_presentWithFrame:CGRectMake(0, 0, 320, 480)];
    expect(fairArtistVC.view).will.recordSnapshot();

};

describe(@"with maps", ^{
    beforeEach(^{
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/maps" withParams:@{ @"fair_id" : @"fair-id" } withResponse:@[@{ @"id" : @"map-id" }]];
    });

    it(@"show subtitle with a birthdate and a nationality", ^{
        Artist *artist = [Artist modelWithJSON:@{ @"id" : @"some-artist", @"name" : @"Some Artist", @"birthday" : @"1999", @"nationality" : @"Chinese"}];
        itlooksCorrectWithArtist(artist);
    });

    it(@"hides subtitle without a birthdate", ^{
        Artist *artist = [Artist modelWithJSON:@{ @"id" : @"some-artist", @"name" : @"Some Artist", @"nationality" : @"Chinese"}];
        itlooksCorrectWithArtist(artist);
    });

    it(@"hides subtitle without a nationality", ^{
        Artist *artist = [Artist modelWithJSON:@{ @"id" : @"some-artist", @"name" : @"Some Artist", @"birthday" : @"1999"}];
        itlooksCorrectWithArtist(artist);
    });
});

describe(@"without maps", ^{
    beforeEach(^{
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/maps" withParams:@{ @"fair_id" : @"fair-id" } withResponse:@[]];
    });

    it(@"show subtitle with a birthdate and a nationality", ^{
        Artist *artist = [Artist modelWithJSON:@{ @"id" : @"some-artist", @"name" : @"Some Artist", @"birthday" : @"1999", @"nationality" : @"Chinese"}];
        itlooksCorrectWithArtist(artist);
    });

    it(@"hides subtitle without a birthdate", ^{
        Artist *artist = [Artist modelWithJSON:@{ @"id" : @"some-artist", @"name" : @"Some Artist", @"nationality" : @"Chinese"}];
        itlooksCorrectWithArtist(artist);
    });

    it(@"hides subtitle without a nationality", ^{
        Artist *artist = [Artist modelWithJSON:@{ @"id" : @"some-artist", @"name" : @"Some Artist", @"birthday" : @"1999",}];
        itlooksCorrectWithArtist(artist);
    });
});

SpecEnd
