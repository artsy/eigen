#import "ARWorksForYouNetworkModel.h"
#import "ARUserManager+Stubs.h"
#import "ArtsyAPI+Artworks.h"
#import "Artwork+Extensions.h"


@interface ARWorksForYouNetworkModel (Tests)
@property (readwrite, nonatomic, assign) NSInteger currentPage;
@property (atomic, weak) AFHTTPRequestOperation *currentRequest;
- (void)performWorksForYouRequest:(void (^_Nonnull)(NSArray<Artwork *> *_Nonnull))success failure:(void (^_Nullable)(NSError *_Nullable))failure;
@end

SpecBegin(ARWorksForYouNetworkModel);
__block ARWorksForYouNetworkModel *networkModel;

beforeEach(^{
    networkModel = [[ARWorksForYouNetworkModel alloc] init];
});

beforeAll(^{
    [ARUserManager stubAndLoginWithUsername];
});

afterAll(^{
    [ARUserManager clearUserData];
});

describe(@"init", ^{
    it(@"sets the currentPage to 1", ^{
        expect(networkModel.currentPage).to.equal(1);
    });
});

describe(@"getArtworks", ^{
    it(@"does not make a request if another request is in progress", ^{
        id mock = [OCMockObject partialMockForObject:networkModel];
        networkModel.currentRequest = (id)[OHHTTPStubs stubRequestsPassingTest:nil withStubResponse:nil];
        [mock getWorksForYou:^(NSArray<ARWorksForYouNotificationItem *> *items) {} failure:nil];
        [[[mock reject] ignoringNonObjectArgs] performWorksForYouRequest:OCMOCK_ANY failure:OCMOCK_ANY];
        [mock verify];
    });
    
    it(@"makes request if no request is in progress", ^{
        id mock = [OCMockObject partialMockForObject:networkModel];
        [[[mock expect] ignoringNonObjectArgs] performWorksForYouRequest:OCMOCK_ANY failure:OCMOCK_ANY];
        [networkModel getWorksForYou:OCMOCK_ANY failure:OCMOCK_ANY];
        [mock verify];
    });
});

describe(@"success", ^{
    beforeEach(^{
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/me/follow/artists/artworks" withResponse:@[[Artwork stubbedArtworkJSON], [Artwork stubbedArtworkJSON]]];
    });
    
    it(@"increments currentPage", ^{
        [networkModel getWorksForYou:^(NSArray<ARWorksForYouNotificationItem *> *items) {} failure:nil];
        [networkModel getWorksForYou:^(NSArray<ARWorksForYouNotificationItem *> *items) {} failure:nil];
        expect(networkModel.currentPage).will.equal(2);
    });
    
    it(@"does not set allDownloaded if artworks count is not 0", ^{
        [networkModel getWorksForYou:^(NSArray<ARWorksForYouNotificationItem *> *items) {} failure:nil];
        expect(networkModel.allDownloaded).will.beFalsy();
    });
    
    it(@"sets allDownloaded if artworks count is 0", ^{
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/me/follow/artists/artworks" withResponse:@[]];
        [networkModel getWorksForYou:^(NSArray<ARWorksForYouNotificationItem *> *items) {} failure:nil];
        expect(networkModel.allDownloaded).will.beTruthy();
    });
});

describe(@"handling failures", ^{
    beforeEach(^{
        [OHHTTPStubs stubRequestsPassingTest:^BOOL(NSURLRequest *request) {
            return [request.URL.path isEqualToString:@"/api/v1/me/follow/artists/artworks"];
        } withStubResponse:^OHHTTPStubsResponse *(NSURLRequest *request) {
            return [OHHTTPStubsResponse responseWithError:[NSError errorWithDomain:NSURLErrorDomain code:404 userInfo:nil]];
        }];

    });

    it(@"sets networkingDidFail to YES if on first page", ^{
        [networkModel getWorksForYou:^(NSArray<ARWorksForYouNotificationItem *> *items) {} failure:nil];
        expect(networkModel.networkingDidFail).to.beTruthy();
    });

    it(@"does not set networkingDidFail if not on first page", ^{
        networkModel.currentPage = 2;
        [networkModel getWorksForYou:^(NSArray<ARWorksForYouNotificationItem *> *items) {} failure:nil];
        expect(networkModel.networkingDidFail).to.beFalsy();
    });
});

SpecEnd;
