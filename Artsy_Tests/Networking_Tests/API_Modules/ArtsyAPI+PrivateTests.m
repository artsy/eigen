#import "ArtsyAPI.h"
#import "ArtsyOHHTTPAPI.h"
#import "ArtsyAPI+Private.h"
#import "MutableNSURLResponse.h"
#import "AFHTTPRequestOperation+JSON.h"

#import <Emission/AREmission.h>
#import <Emission/ARGraphQLQueryCache.h>

@interface ArtsyAPI (TestsPrivate)
+ (ArtsyAPI *)sharedAPI;

- (AFHTTPRequestOperation *)requestOperation:(NSURLRequest *)request removeNullsFromResponse:(BOOL)removeNulls success:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, id JSON))success failure:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON))failure;
- (AFHTTPRequestOperation *)performRequest:(NSURLRequest *)request removeNullsFromResponse:(BOOL)removeNulls success:(void (^)(id))success failure:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error))failure;
@end

SpecBegin(ArtsyAPIPrivate);

it(@"is always ArtsyOHHTTPAPI in tests", ^{
    expect([ArtsyAPI sharedAPI]).to.beKindOf(ArtsyOHHTTPAPI.class);
});

describe(@"handleXappTokenError", ^{

    it(@"doesn't reset XAPP token on non-401 errors", ^{
        [UICKeyChainStore setString:@"xapp token" forKey:ARXAppTokenKeychainKey];
        NSError *error = [[NSError alloc] initWithDomain:NSURLErrorDomain code:302 userInfo:@{}];
        [ArtsyAPI handleXappTokenError:error];
        expect([UICKeyChainStore stringForKey:ARXAppTokenKeychainKey]).to.equal(@"xapp token");
    });

    it(@"resets XAPP token on error", ^{
        [UICKeyChainStore setString:@"value" forKey:ARXAppTokenKeychainKey];
        id mock = [OCMockObject mockForClass:[ARRouter class]];
        [[mock expect] setXappToken:nil];

        NSString *errorJSON = @"{\"error\":\"Unauthorized\",\"text\":\"The XAPP token is invalid or has expired.\"}";
        NSError *error = [[NSError alloc] initWithDomain:NSURLErrorDomain code:401 userInfo:@{
            AFNetworkingOperationFailingURLResponseDataErrorKey: [errorJSON dataUsingEncoding:NSUnicodeStringEncoding],
            AFNetworkingOperationFailingURLResponseErrorKey: [[MutableNSURLResponse alloc] initWithStatusCode:401]
        }];

        [ArtsyAPI handleXappTokenError:error];
        [mock verify];
        [mock stopMocking];
        expect([UICKeyChainStore stringForKey:ARXAppTokenKeychainKey]).to.beNil();
    });
});

NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:@"http://example.com"]];

it(@"defaults to not removing null JSON values", ^{
    id mockRequest = [OCMockObject niceMockForClass:[AFHTTPRequestOperation class]];
    id mock = [OCMockObject mockForClass:[ArtsyAPI class]];
    [[[[mock expect] classMethod] andReturn:mockRequest] performRequest:OCMOCK_ANY removeNullsFromResponse:NO success:OCMOCK_ANY failure:OCMOCK_ANY];

    [ArtsyAPI performRequest:request success:^(id json) {
        failure(@"block unexepectedly invoked");
    } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error) {
        failure(@"block unexepectedly invoked");
    }];

    [mock verify];
    [mock stopMocking];
});

it(@"removes JSON nulls when specified to", ^{
    id apiMock = [OCMockObject mockForClass:[ArtsyAPI class]];
    [[[[apiMock stub] classMethod] andReturn:apiMock] sharedAPI];
    [[[apiMock expect] andReturn:[NSObject new]] performRequest:OCMOCK_ANY removeNullsFromResponse:YES success:OCMOCK_ANY failure:OCMOCK_ANY];

    [ArtsyAPI performRequest:request removeNullsFromResponse:YES success:^(id json) {
        failure(@"block unexepectedly invoked");
    } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error) {
        failure(@"block unexepectedly invoked");
    }];

    [apiMock verify];
    [apiMock stopMocking];
});

sharedExamplesFor(@"API writes", ^(NSDictionary *data) {
    it(@"clears the Relay cache", ^{
        NSMutableURLRequest *postRequest = [request mutableCopy];
        postRequest.HTTPMethod = data[@"method"];
        id apiMock = [OCMockObject partialMockForObject:ArtsyAPI.sharedAPI];
        [[[apiMock expect] andReturn:nil] requestOperation:OCMOCK_ANY removeNullsFromResponse:YES success:[OCMArg checkWithBlock:^BOOL(void (^callback)(NSURLRequest *request, NSHTTPURLResponse *response, id JSON)) {
            callback(postRequest, [[NSHTTPURLResponse alloc] init], @{});
            return YES;
        }] failure:OCMOCK_ANY];

        id mockCacheModule = [OCMockObject mockForClass:[ARGraphQLQueryCache class]];
        id emissionMock = [OCMockObject partialMockForObject:[AREmission sharedInstance]];
        [[[emissionMock stub] andReturn:mockCacheModule] graphQLQueryCacheModule];
        [[mockCacheModule expect] clearAll];

        [ArtsyAPI.sharedAPI performRequest:request removeNullsFromResponse:YES success:^(id json) {
            // Nop
        } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error) {
            failure(@"block unexepectedly invoked");
        }];

        [mockCacheModule verify];
        [emissionMock stopMocking];
        [apiMock verify];
        [apiMock stopMocking];
    });
});

itBehavesLike(@"API writes", @{@"method": @"POST"});
itBehavesLike(@"API writes", @{@"method": @"PUT"});
itBehavesLike(@"API writes", @{@"method": @"DELETE"});

it(@"does not clears the Relay cache on GET requests", ^{
    NSMutableURLRequest *postRequest = [request mutableCopy];
    postRequest.HTTPMethod = @"GET";
    id apiMock = [OCMockObject partialMockForObject:ArtsyAPI.sharedAPI];
    [[[apiMock expect] andReturn:nil] requestOperation:OCMOCK_ANY removeNullsFromResponse:YES success:[OCMArg checkWithBlock:^BOOL(void (^callback)(NSURLRequest *request, NSHTTPURLResponse *response, id JSON)) {
        callback(postRequest, [[NSHTTPURLResponse alloc] init], @{});
        return YES;
    }] failure:OCMOCK_ANY];

    id mockCacheModule = [OCMockObject mockForClass:[ARGraphQLQueryCache class]];
    id emissionMock = [OCMockObject partialMockForObject:[AREmission sharedInstance]];
    [[[emissionMock stub] andReturn:mockCacheModule] graphQLQueryCacheModule];
    [[mockCacheModule reject] clearAll];

    [ArtsyAPI.sharedAPI performRequest:request removeNullsFromResponse:YES success:^(id json) {
        // Nop
    } failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error) {
        failure(@"block unexepectedly invoked");
    }];

    [mockCacheModule verify];
    [emissionMock stopMocking];
    [apiMock verify];
    [apiMock stopMocking];
});

SpecEnd;
