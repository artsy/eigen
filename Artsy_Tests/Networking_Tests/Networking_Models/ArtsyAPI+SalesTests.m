#import "ArtsyAPI.h"
#import "ArtsyAPI+Private.h"
#import "ArtsyAPI+Sales.h"
#import "ARRouter.h"

SpecBegin(ArtsyAPISales)

__block BOOL invoked;

beforeEach(^{
    invoked = NO;
});

describe(@"with full network stubbing", ^{
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
});

it(@"creates a request properly", ^{
    id mock = [OCMockObject mockForClass:[ArtsyAPI class]];
    id routerMock = [OCMockObject mockForClass:[ARRouter class]];
    id request = [NSURLRequest requestWithURL:[NSURL URLWithString:@"http://example.com"]];
    [[[routerMock expect] andReturn:request] artworksForSaleRequest:@"sale-id"];
    [[mock expect] performGraphQLRequest:OCMOCK_ANY success:OCMOCK_ANY failure:OCMOCK_ANY];

    [ArtsyAPI getArtworksForSale:@"sale-id" success:^(NSArray * _Nonnull artworks) {
        failure(@"not expecting to be invoked");
    } failure:^(NSError * _Nonnull error) {
        failure(@"not expecting to be invoked");
    }];

    [routerMock verify];
    [mock stopMocking];
    [routerMock stopMocking];
});

it(@"calls GraphQL request handler", ^{
    id mock = [OCMockObject mockForClass:[ArtsyAPI class]];
    [[mock expect] performGraphQLRequest:OCMOCK_ANY success:OCMOCK_ANY failure:OCMOCK_ANY];

    [ArtsyAPI getArtworksForSale:@"sale-id" success:^(NSArray * _Nonnull artworks) {
        failure(@"not expecting to be invoked");
    } failure:^(NSError * _Nonnull error) {
        failure(@"not expecting to be invoked");
    }];

    [mock verify];
    [mock stopMocking];
});

describe(@"with GraphQL request handling stubbed", ^{
    __block id mock;

    it(@"removes lots with missing artworks", ^{
        // We'll be using OCMArg checkWithBlock: to stub the invocation of the success block.
        mock = [OCMockObject mockForClass:[ArtsyAPI class]];
        [[mock expect] performGraphQLRequest:OCMOCK_ANY success:[OCMArg checkWithBlock:^BOOL(void (^block)(id)) {
            block(@{
                    @"data": @{
                            @"sale": @{
                                    @"sale_artworks": @[
                                            @{ @"id": @"some-lot-id",
                                                @"artwork": [NSNull null] }]
                                    }
                            }
                    });
            return YES;
        }] failure:OCMOCK_ANY];

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
        [mock verify];
        [mock stopMocking];
    });
});

SpecEnd
