#import "ARArtworkFavoritesNetworkModel.h"
#import "ARUserManager+Stubs.h"
#import "ArtsyAPI.h"
#import "Artwork+Extensions.h"


@interface ARFavoritesNetworkModel (Tests)
@property (readwrite, nonatomic, assign) NSInteger currentPage;
@property (readwrite, nonatomic, assign) BOOL downloadLock;
- (void)performNetworkRequestAtPage:(NSInteger)page withSuccess:(void (^)(NSArray *artists))success failure:(void (^)(NSError *error))failure;
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
        id mock = [OCMockObject partialMockForObject:networkModel];
        networkModel.downloadLock = YES;
        [[[mock reject] ignoringNonObjectArgs] performNetworkRequestAtPage:0 withSuccess:OCMOCK_ANY failure:OCMOCK_ANY];
        [mock getFavorites:nil failure:nil];
        [mock verify];
    });

    it(@"makes request if no request is in progress", ^{
        id mock = [OCMockObject partialMockForObject:networkModel];
        networkModel.downloadLock = NO;
        [[[mock expect]  ignoringNonObjectArgs] performNetworkRequestAtPage:0 withSuccess:OCMOCK_ANY failure:OCMOCK_ANY];
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

    describe(@"useSampleFavorites", ^{
        it(@"uses sample user id if YES", ^{
            id mock = [OCMockObject mockForClass:[ArtsyAPI class]];
            [[[mock expect] classMethod] getArtworkFromUserFavorites:@"502d15746e721400020006fa" page:1 success:OCMOCK_ANY failure:OCMOCK_ANY];
            networkModel.useSampleFavorites = YES;
            [networkModel getFavorites:nil failure:nil];
            [mock verify];
            [mock stopMocking];
        });

        it(@"uses current user id by default", ^{
            id mock = [OCMockObject mockForClass:[ArtsyAPI class]];
            [[[mock expect] classMethod] getArtworkFromUserFavorites:[User currentUser].userID page:1 success:OCMOCK_ANY failure:OCMOCK_ANY];
            [networkModel getFavorites:nil failure:nil];
            [mock verify];
            [mock stopMocking];
        });
    });
});


SpecEnd
