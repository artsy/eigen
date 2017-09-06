#import "ARArtworkFavoritesNetworkModel.h"
#import "ARUserManager+Stubs.h"
#import "ArtsyAPI.h"
#import "Artwork+Extensions.h"
#import "ARFavoritesNetworkModel+Private.h"

@interface ARFavoritesNetworkModel (Tests)
@property (nonatomic, copy) NSString *nextPageCursor;
- (AFHTTPRequestOperation *)requestOperationAfterCursor:(NSString *)cursor withSuccess:(void (^)(NSString *nextPageCursor, NSArray *artists))success failure:(void (^)(NSError *error))failure;
@end

SpecBegin(ARArtworkFavoritesNetworkModel);
__block ARArtworkFavoritesNetworkModel *networkModel;

beforeEach(^{
    networkModel = [[ARArtworkFavoritesNetworkModel alloc] init];
});

beforeAll(^{
    [ARUserManager stubAndLoginWithUsername];
});

afterAll(^{
    [ARUserManager clearUserData];
});

describe(@"init", ^{
    it(@"sets currentPage to 1", ^{
        expect(networkModel.currentPage).to.equal(1);
    });
});


describe(@"getFavorites", ^{
    it(@"does not make request if another request is in progress", ^{
        [OHHTTPStubs stubJSONResponseAtPath:@"" withResponse:@{}];

        id mock = [OCMockObject partialMockForObject:networkModel];
        networkModel.currentRequest = (id)[OHHTTPStubs stubRequestsPassingTest:nil withStubResponse:nil];
        [[[mock reject] ignoringNonObjectArgs] requestOperationAfterCursor:OCMOCK_ANY withSuccess:OCMOCK_ANY failure:OCMOCK_ANY];
        [mock getFavorites:nil failure:nil];
        [mock verify];
    });

    it(@"makes request if no request is in progress", ^{
        [OHHTTPStubs stubJSONResponseAtPath:@"" withResponse:@{}];

        id mock = [OCMockObject partialMockForObject:networkModel];
        [[[mock expect]  ignoringNonObjectArgs] requestOperationAfterCursor:OCMOCK_ANY withSuccess:OCMOCK_ANY failure:OCMOCK_ANY];
        [networkModel getFavorites:nil failure:nil];
        [networkModel getFavorites:nil failure:nil];
        [mock verify];
    });
    
    describe(@"success with artworks", ^{
        beforeEach(^{
            [OHHTTPStubs stubJSONResponseAtPath:@"" withResponse:@{
                @"data": @{
                    @"me": @{
                        @"saved_artworks": @{
                            @"artworks_connection": @{
                                @"pageInfo": @{
                                    @"endCursor": @"some-cursor",
                                    @"hasNextPage": @(NO)
                                },
                                @"edges": @[
                                    @{ @"node": [Artwork stubbedArtworkJSON] },
                                    @{ @"node": [Artwork stubbedArtworkJSON] }
                                ]
                            }
                        }
                    }
                }
            }];
        });

        it(@"sets page cursor", ^{
            [networkModel getFavorites:nil failure:nil];
            expect(networkModel.nextPageCursor).will.equal(@"some-cursor");
        });

        it(@"sets allDownloaded", ^{
            [networkModel getFavorites:nil failure:nil];
            expect(networkModel.allDownloaded).will.beTruthy();
        });
    });

    describe(@"failure", ^{
        before(^{
            [OHHTTPStubs stubRequestsPassingTest:^BOOL(NSURLRequest *request) {
                return [[request.URL path] isEqualToString:@""];
            } withStubResponse:^OHHTTPStubsResponse *(NSURLRequest *request) {
                return [OHHTTPStubsResponse responseWithError:[NSError errorWithDomain:NSURLErrorDomain code:404 userInfo:nil]];
            }];
        });

        it(@"sets allDownloaded", ^{
            [networkModel getFavorites:nil failure:nil];
            expect(networkModel.allDownloaded).will.beTruthy();
        });
    });
});


SpecEnd;
