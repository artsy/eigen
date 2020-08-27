#import "ArtsyAPI.h"
#import "ArtsyAPI+Artworks.h"

SpecBegin(ArtsyAPIArtworks);

describe(@"favourites", ^{
    __block BOOL invoked;

    beforeEach(^{
        invoked = NO;
    });

    afterEach(^{
        [OHHTTPStubs removeAllStubs];
    });

    it(@"fails on an empty response", ^{
        [OHHTTPStubs stubJSONResponseAtPath:@"/v2" withResponse:@{}];

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
        [OHHTTPStubs stubJSONResponseAtPath:@"/v2" withResponse:
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
        [OHHTTPStubs stubJSONResponseAtPath:@"/v2" withResponse:
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
        [OHHTTPStubs stubJSONResponseAtPath:@"/v2" withResponse:
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
        [OHHTTPStubs stubJSONResponseAtPath:@"/v2" withResponse:
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
        [OHHTTPStubs stubJSONResponseAtPath:@"/v2" withResponse:
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
        [OHHTTPStubs stubJSONResponseAtPath:@"/v2" withResponse:
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
        [OHHTTPStubs stubJSONResponseAtPath:@"/v2" withResponse:
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
        [OHHTTPStubs stubJSONResponseAtPath:@"/v2" withResponse:
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
        [OHHTTPStubs stubJSONResponseAtPath:@"/v2" withResponse:
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
