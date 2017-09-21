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

describe(@"favourites", ^{
    __block BOOL invoked;

    beforeEach(^{
        invoked = NO;
    });

    afterEach(^{
        [OHHTTPStubs removeAllStubs];
    });

    it(@"fails on an empty response", ^{
        [OHHTTPStubs stubJSONResponseAtPath:@"" withResponse:@{}];

        waitUntil(^(DoneCallback done) {
            [ArtsyAPI getArtworkFromUserFavorites:@"cursor" success:^(NSString *nextPageCursor, BOOL hasNextPage, NSArray *artworks) {
                failure(@"success block called");
            } failure:^(NSError *error) {
                invoked = true;
                done();
            }];
        });

        expect(invoked).to.beTruthy();
    });

    it(@"it works in the success case", ^{
        [OHHTTPStubs stubJSONResponseAtPath:@"" withResponse:
         @{ @"data":
                @{ @"me":
                       @{ @"saved_artworks":
                              @{ @"artworks_connection":
                                     @{ @"edges":
                                            @[ @{ @"node": @{ @"id": @"some-artwork-id" }  } ]
                                        }
                                 }
                          }
                   }
            }];

        waitUntil(^(DoneCallback done) {
            [ArtsyAPI getArtworkFromUserFavorites:@"cursor" success:^(NSString *nextPageCursor, BOOL hasNextPage, NSArray *artworks) {
                expect(artworks.count).to.equal(@1);
                expect([artworks.first artworkID]).to.equal(@"some-artwork-id");
                invoked = true;
                done();
            } failure:^(NSError *error) {
                failure(@"failure block called");
            }];
        });

        expect(invoked).to.beTruthy();
    });

    it(@"doesn't crash with null JSON in the data field", ^{
        [OHHTTPStubs stubJSONResponseAtPath:@"" withResponse:
         @{
           @"data": [NSNull null]
           }];

        waitUntil(^(DoneCallback done) {
            [ArtsyAPI getArtworkFromUserFavorites:@"cursor" success:^(NSString *nextPageCursor, BOOL hasNextPage, NSArray *artworks) {
                failure(@"success block called");
            } failure:^(NSError *error) {
                invoked = true;
                done();
            }];
        });

        expect(invoked).to.beTruthy();
    });

    it(@"doesn't crash with null JSON in the me field", ^{
        [OHHTTPStubs stubJSONResponseAtPath:@"" withResponse:
         @{
           @"data": @{ @"me": [NSNull null] }
           }];

        waitUntil(^(DoneCallback done) {
            [ArtsyAPI getArtworkFromUserFavorites:@"cursor" success:^(NSString *nextPageCursor, BOOL hasNextPage, NSArray *artworks) {
                failure(@"success block called");
            } failure:^(NSError *error) {
                invoked = true;
                done();
            }];
        });

        expect(invoked).to.beTruthy();
    });

    it(@"doesn't crash with null JSON in the saved_artworks field", ^{
        [OHHTTPStubs stubJSONResponseAtPath:@"" withResponse:
         @{
           @"data": @{ @"me": @{ @"saved_artworks": [NSNull null] } }
           }];

        waitUntil(^(DoneCallback done) {
            [ArtsyAPI getArtworkFromUserFavorites:@"cursor" success:^(NSString *nextPageCursor, BOOL hasNextPage, NSArray *artworks) {
                failure(@"success block called");
            } failure:^(NSError *error) {
                invoked = true;
                done();
            }];
        });

        expect(invoked).to.beTruthy();
    });

    it(@"doesn't crash with null JSON in the artworks_connection field", ^{
        [OHHTTPStubs stubJSONResponseAtPath:@"" withResponse:
         @{
           @"data": @{ @"me": @{ @"saved_artworks": @{ @"artworks_connection": [NSNull null] } } }
           }];

        waitUntil(^(DoneCallback done) {
            [ArtsyAPI getArtworkFromUserFavorites:@"cursor" success:^(NSString *nextPageCursor, BOOL hasNextPage, NSArray *artworks) {
                failure(@"success block called");
            } failure:^(NSError *error) {
                invoked = true;
                done();
            }];
        });

        expect(invoked).to.beTruthy();
    });

    it(@"doesn't crash with null JSON in the pageInfo field", ^{
        [OHHTTPStubs stubJSONResponseAtPath:@"" withResponse:
         @{
           @"data": @{ @"me": @{ @"saved_artworks": @{ @"artworks_connection": @{ @"pageInfo": [NSNull null] } } } }
           }];

        waitUntil(^(DoneCallback done) {
            [ArtsyAPI getArtworkFromUserFavorites:@"cursor" success:^(NSString *nextPageCursor, BOOL hasNextPage, NSArray *artworks) {
                failure(@"success block called");
            } failure:^(NSError *error) {
                invoked = true;
                done();
            }];
        });

        expect(invoked).to.beTruthy();
    });

    it(@"doesn't crash with null JSON in the edges field", ^{
        [OHHTTPStubs stubJSONResponseAtPath:@"" withResponse:
         @{
           @"data": @{ @"me": @{ @"saved_artworks": @{ @"artworks_connection": @{ @"edges": [NSNull null] } } } }
           }];

        waitUntil(^(DoneCallback done) {
            [ArtsyAPI getArtworkFromUserFavorites:@"cursor" success:^(NSString *nextPageCursor, BOOL hasNextPage, NSArray *artworks) {
                failure(@"success block called");
            } failure:^(NSError *error) {
                invoked = true;
                done();
            }];
        });

        expect(invoked).to.beTruthy();
    });

    it(@"doesn't crash with null edges", ^{
        [OHHTTPStubs stubJSONResponseAtPath:@"" withResponse:
         @{
           @"data":
               @{ @"me":
                      @{ @"saved_artworks":
                             @{ @"artworks_connection":
                                    @{ @"edges":
                                           @[ [NSNull null] ]
                                       }
                                }
                         }
                  }
           }];

        waitUntil(^(DoneCallback done) {
            [ArtsyAPI getArtworkFromUserFavorites:@"cursor" success:^(NSString *nextPageCursor, BOOL hasNextPage, NSArray *artworks) {
                // Note: we expect an empty array of artists in this case.
                expect(artworks).toNot.beNil();
                expect(artworks.count).to.equal(@0);
                invoked = true;
                done();
            } failure:^(NSError *error) {
                failure(@"failure block called");
            }];
        });
        expect(invoked).to.beTruthy();
    });

    it(@"doesn't crash with null cursor info", ^{
        [OHHTTPStubs stubJSONResponseAtPath:@"" withResponse:
         @{
           @"data": @{ @"me": @{ @"saved_artworks": @{ @"artworks_connection": @{ @"pageInfo": @{ @"endCursor": [NSNull null] } } } } }
           }];

        waitUntil(^(DoneCallback done) {
            [ArtsyAPI getArtworkFromUserFavorites:@"cursor" success:^(NSString *nextPageCursor, BOOL hasNextPage, NSArray *artworks) {
                failure(@"success block called");
            } failure:^(NSError *error) {
                invoked = true;
                done();
            }];
        });

        expect(invoked).to.beTruthy();
    });
});

SpecEnd;
