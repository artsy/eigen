#import "ArtsyAPI.h"
#import "ArtsyAPI+Private.h"
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

    describe(@"with full network stubbs", ^{
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

        it(@"connects applicable sale artwork", ^{
            [OHHTTPStubs stubJSONResponseAtPath:@"" withResponse:
             @{ @"data":
                    @{ @"me":
                           @{ @"saved_artworks":
                                  @{ @"artworks_connection":
                                         @{ @"edges":
                                                @[ @{ @"node": @{ @"id": @"some-artwork-id", @"sale_artwork": @{ @"id": @"some-lot-id" } } } ]
                                            }
                                     }
                              }
                       }
                }];

            waitUntil(^(DoneCallback done) {
                [ArtsyAPI getArtworkFromUserFavorites:@"cursor" success:^(NSString *nextPageCursor, BOOL hasNextPage, NSArray *artworks) {
                    expect(artworks.count).to.equal(@1);
                    expect([[artworks.first saleArtwork] saleArtworkID]).to.equal(@"some-lot-id");
                    invoked = true;
                    done();
                } failure:^(NSError *error) {
                    failure(@"failure block called");
                }];
            });

            expect(invoked).to.beTruthy();
        });

        it(@"removes NSNull values from the artworks JSON", ^{
            [OHHTTPStubs stubJSONResponseAtPath:@"" withResponse:
             @{ @"data":
                    @{ @"me":
                           @{ @"saved_artworks":
                                  @{ @"artworks_connection":
                                         @{ @"edges":
                                                @[ @{ @"node": [NSNull null] } ]
                                            }
                                     }
                              }
                       }
                }];

            waitUntil(^(DoneCallback done) {
                [ArtsyAPI getArtworkFromUserFavorites:@"cursor" success:^(NSString *nextPageCursor, BOOL hasNextPage, NSArray *artworks) {
                    expect(artworks).to.equal(@[]);
                    invoked = true;
                    done();
                } failure:^(NSError *error) {
                    failure(@"failure block called");
                }];
            });

            expect(invoked).to.beTruthy();
        });

        it(@"skips missing sale artworks", ^{
            [OHHTTPStubs stubJSONResponseAtPath:@"" withResponse:
             @{ @"data":
                    @{ @"me":
                           @{ @"saved_artworks":
                                  @{ @"artworks_connection":
                                         @{ @"edges":
                                                @[ @{ @"node": @{ @"id": @"some-artwork-id" } } ]
                                            }
                                     }
                              }
                       }
                }];

            waitUntil(^(DoneCallback done) {
                [ArtsyAPI getArtworkFromUserFavorites:@"cursor" success:^(NSString *nextPageCursor, BOOL hasNextPage, NSArray *artworks) {
                    expect(artworks.count).to.equal(@1);
                    expect([[artworks.first saleArtwork] saleArtworkID]).to.beNil();
                    invoked = true;
                    done();
                } failure:^(NSError *error) {
                    failure(@"failure block called");
                }];
            });

            expect(invoked).to.beTruthy();
        });
    });

    it(@"creates a request properly", ^{
        id mock = [OCMockObject mockForClass:[ArtsyAPI class]];
        id routerMock = [OCMockObject mockForClass:[ARRouter class]];
        id request = [NSURLRequest requestWithURL:[NSURL URLWithString:@"http://example.com"]];
        [[[routerMock expect] andReturn:request] newArtworksFromUsersFavoritesRequestWithCursor:@"cursor"];
        [[mock expect] performGraphQLRequest:OCMOCK_ANY success:OCMOCK_ANY failure:OCMOCK_ANY];

        [ArtsyAPI getArtworkFromUserFavorites:@"cursor" success:^(NSString *nextPageCursor, BOOL hasNextPage, NSArray *artworks) {
            failure(@"not expecting to be invoked");
        } failure:^(NSError *error) {
            failure(@"not expecting to be invoked");
        }];

        [routerMock verify];
        [mock stopMocking];
        [routerMock stopMocking];
    });
    
    it(@"calls GraphQL request handler", ^{
        id mock = [OCMockObject mockForClass:[ArtsyAPI class]];
        [[mock expect] performGraphQLRequest:OCMOCK_ANY success:OCMOCK_ANY failure:OCMOCK_ANY];

        [ArtsyAPI getArtworkFromUserFavorites:@"cursor" success:^(NSString *nextPageCursor, BOOL hasNextPage, NSArray *artworks) {
            failure(@"not expecting to be invoked");
        } failure:^(NSError *error) {
            failure(@"not expecting to be invoked");
        }];

        [mock verify];
        [mock stopMocking];
    });
});

SpecEnd;
