#import "ARArtworkFavoritesNetworkModel.h"
#import "ARUserManager+Stubs.h"
#import "ArtsyAPI.h"
#import "Artwork+Extensions.h"


@interface ARFavoritesNetworkModel (Tests)
@property (readwrite, nonatomic, assign) NSInteger currentPage;
@property (atomic, weak) AFHTTPRequestOperation *currentRequest;
- (AFHTTPRequestOperation *)requestOperationAtPage:(NSInteger)page withSuccess:(void (^)(NSArray *artists))success failure:(void (^)(NSError *error))failure;
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
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/collection/saved-artwork/artworks" withResponse:@{}];

        id mock = [OCMockObject partialMockForObject:networkModel];
        networkModel.currentRequest = (id)[OHHTTPStubs stubRequestsPassingTest:nil withStubResponse:nil];
        [[[mock reject] ignoringNonObjectArgs] requestOperationAtPage:0 withSuccess:OCMOCK_ANY failure:OCMOCK_ANY];
        [mock getFavorites:nil failure:nil];
        [mock verify];
    });

    it(@"makes request if no request is in progress", ^{
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/collection/saved-artwork/artworks" withResponse:@{}];

        id mock = [OCMockObject partialMockForObject:networkModel];
        [[[mock expect]  ignoringNonObjectArgs] requestOperationAtPage:0 withSuccess:OCMOCK_ANY failure:OCMOCK_ANY];
        [networkModel getFavorites:nil failure:nil];
        [networkModel getFavorites:nil failure:nil];
        [mock verify];
    });
    
    describe(@"success with artworks", ^{
        beforeEach(^{
            [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/collection/saved-artwork/artworks" withResponse:@[[Artwork stubbedArtworkJSON], [Artwork stubbedArtworkJSON]]];
        });

        it(@"increments currentPage", ^{
            [networkModel getFavorites:nil failure:nil];
            expect(networkModel.currentPage).will.equal(2);
        });

        it(@"does not set allDownloaded", ^{
            [networkModel getFavorites:nil failure:nil];
            expect(networkModel.allDownloaded).will.beFalsy();
        });
    });

//    describe(@"success without artworks", ^{
//        beforeEach(^{
//            [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/collection/saved-artwork/artworks" withResponse:@[]];
//        });
//
//        it(@"does not increment currentPage", ^{
//            [networkModel getFavorites:nil failure:nil];
//            expect(networkModel.currentPage).will.equal(1);
//        });
//
//        it(@"sets allDownloaded", ^{
//            [networkModel getFavorites:nil failure:nil];
//            expect(networkModel.allDownloaded).will.beTruthy();
//        });
//    });

    describe(@"failure", ^{
        before(^{
            [OHHTTPStubs stubRequestsPassingTest:^BOOL(NSURLRequest *request) {
                return [[request.URL path] isEqualToString:@"/api/v1/collection/saved-artwork/artworks"];
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
