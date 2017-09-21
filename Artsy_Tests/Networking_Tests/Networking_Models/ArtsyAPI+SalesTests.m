#import "ArtsyAPI.h"
#import "ArtsyAPI+Sales.h"

SpecBegin(ArtsyAPISales)

__block BOOL invoked;

beforeEach(^{
    invoked = NO;
});

afterEach(^{
    [OHHTTPStubs removeAllStubs];
});

it(@"it works in the success case", ^{
    [OHHTTPStubs stubJSONResponseAtPath:@"" withResponse:
     @{
       @"data": @{ @"sale": @{ @"sale_artworks": @[ @{ @"id": @"sale-artwork-id", @"artwork": @{ @"id": @"artwork-id" } } ] } }
       }];

    waitUntil(^(DoneCallback done) {
        [ArtsyAPI getArtworksForSale:@"sale-id" success:^(NSArray *artworks) {
            expect(artworks.count).to.equal(@1);
            invoked = true;
            done();
        } failure:^(NSError *error) {
            failure(@"failure block called");
        }];
    });

    expect(invoked).to.beTruthy();
});

it(@"fails on an empty response", ^{
    [OHHTTPStubs stubJSONResponseAtPath:@"" withResponse:@{}];

    waitUntil(^(DoneCallback done) {
        [ArtsyAPI getArtworksForSale:@"sale-id" success:^(NSArray *artworks) {
            failure(@"success block called");
        } failure:^(NSError *error) {
            invoked = true;
            done();
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
        [ArtsyAPI getArtworksForSale:@"sale-id" success:^(NSArray *artworks) {
            failure(@"success block called");
        } failure:^(NSError *error) {
            invoked = true;
            done();
        }];
    });

    expect(invoked).to.beTruthy();
});

it(@"doesn't crash with null JSON in the sale field", ^{
    [OHHTTPStubs stubJSONResponseAtPath:@"" withResponse:
     @{
       @"data": @{ @"sale": [NSNull null] }
       }];

    waitUntil(^(DoneCallback done) {
        [ArtsyAPI getArtworksForSale:@"sale-id" success:^(NSArray *artworks) {
            failure(@"success block called");
        } failure:^(NSError *error) {
            invoked = true;
            done();
        }];
    });

    expect(invoked).to.beTruthy();
});

it(@"doesn't crash with null JSON in the sale_artworks field", ^{
    [OHHTTPStubs stubJSONResponseAtPath:@"" withResponse:
     @{
       @"data": @{ @"sale": @{ @"sale_artworks": [NSNull null] } }
       }];

    waitUntil(^(DoneCallback done) {
        [ArtsyAPI getArtworksForSale:@"sale-id" success:^(NSArray *artworks) {
            failure(@"success block called");
        } failure:^(NSError *error) {
            invoked = true;
            done();
        }];
    });

    expect(invoked).to.beTruthy();
});

it(@"returns an empty array for an [NSNull] sale_artworks", ^{
    [OHHTTPStubs stubJSONResponseAtPath:@"" withResponse:
     @{
       @"data": @{ @"sale": @{ @"sale_artworks": @[ [NSNull null] ] } }
       }];

    waitUntil(^(DoneCallback done) {
        [ArtsyAPI getArtworksForSale:@"sale-id" success:^(NSArray *artworks) {
            expect(artworks).to.equal(@[]);
            invoked = true;
            done();
        } failure:^(NSError *error) {
            failure(@"failure block called");
        }];
    });

    expect(invoked).to.beTruthy();
});

it(@"returns an empty array for sale_artworks with NSNull artworks", ^{
    [OHHTTPStubs stubJSONResponseAtPath:@"" withResponse:
     @{
       @"data": @{ @"sale": @{ @"sale_artworks": @[ @{ @"id": @"sale-artwork-id", @"artwork": [NSNull null] } ] } }
       }];

    waitUntil(^(DoneCallback done) {
        [ArtsyAPI getArtworksForSale:@"sale-id" success:^(NSArray *artworks) {
            expect(artworks).to.equal(@[]);
            invoked = true;
            done();
        } failure:^(NSError *error) {
            failure(@"failure block called");
        }];
    });

    expect(invoked).to.beTruthy();
});

SpecEnd
