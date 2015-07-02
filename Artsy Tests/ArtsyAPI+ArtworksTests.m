#import "ArtsyAPI.h"
#import "ArtsyAPI+Artworks.h"

SpecBegin(ArtsyAPIArtworks);

describe(@"relatedFairs", ^{
    it(@"filters out fairs that do not have an organizer or profile", ^{
        __block NSArray *results;
        Artwork *artwork = [Artwork modelWithJSON:@{@"id": @"artworkartwork"}];
        
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/fairs"
            withParams:@{@"artwork": @[@"artworkartwork"]}
            withResponse:@[
            @{
                @"organizer": [NSNull null],
                @"id": @"no-organizer",
                @"name": @"Fair Without Organizer"
            },
            @{
                @"organizer": @{
                    @"default_fair_id": @"no-profile",
                    @"profile_id": [NSNull null],
                    @"id": @"no-profile",
                    @"name": @"no-profile"
                },
                @"id": @"no-profile",
                @"name": @"Fair Without Profile"
            },
            @{
                @"organizer": @{
                    @"default_fair_id": @"organizer-and-profile",
                    @"profile_id": @"organizer-and-profile",
                    @"id": @"organizer-and-profile",
                    @"name": @"organizer-and-profile"
                },
                @"id": @"organizer-and-profile",
                @"name": @"Fair With Organizer With Profile"
            }]
        ];

        [ArtsyAPI getFairsForArtwork:artwork success:^(NSArray *fairs) {
            results = fairs.copy;
        } failure:nil];
        [Expecta setAsynchronousTestTimeout:2];
        expect(results.count).will.equal(2);
        expect([(Fair *)results[1] fairID]).will.equal(@"organizer-and-profile");

        [OHHTTPStubs removeAllStubs];
    });
});

SpecEnd
