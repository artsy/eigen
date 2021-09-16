#import "ArtsyAPI.h"
#import "ArtsyAPI+Private.h"

SpecBegin(ArtsyAPIGraphQL);

__block NSURL *url;
__block NSURLRequest *request;
__block BOOL invoked;

beforeEach(^{
    url = [NSURL URLWithString:@"http://example.com/"];
    request = [NSURLRequest requestWithURL:url];
    invoked = NO;
});

it(@"invokes success block", ^{
    [OHHTTPStubs stubJSONResponseAtPath:@"/" withResponse:@{}];

    waitUntil(^(DoneCallback done) {
        [ArtsyAPI performGraphQLRequest:request success:^(id JSON) {
            invoked = YES;
            done();
        } failure:^(NSError *error) {
            failure(@"invoked error callback");
        }];
    });

    expect(invoked).to.beTruthy();
});

it(@"invokes failure callback on network error", ^{
    [OHHTTPStubs stubJSONResponseAtPath:@"/" withResponse:@{} andStatusCode: 503];

    waitUntil(^(DoneCallback done) {
        [ArtsyAPI performGraphQLRequest:request success:^(id JSON) {
            failure(@"invoked success callback");
        } failure:^(NSError *error) {
            invoked = YES;
            done();
        }];
    });

    expect(invoked).to.beTruthy();
});

it(@"invokes failure callback when GraphQL response contains errors key", ^{
    [OHHTTPStubs stubJSONResponseAtPath:@"/" withResponse:@{@"errors": @[]}];

    waitUntil(^(DoneCallback done) {
        [ArtsyAPI performGraphQLRequest:request success:^(id JSON) {
            failure(@"invoked success callback");
        } failure:^(NSError *error) {
            invoked = YES;
            done();
        }];
    });

    expect(invoked).to.beTruthy();
});

it(@"specifies to remove nulls", ^{
    id mock = [OCMockObject mockForClass:[ArtsyAPI class]];
    [[[mock expect] classMethod] performRequest:OCMOCK_ANY removeNullsFromResponse:YES success:OCMOCK_ANY failure:OCMOCK_ANY];

    [ArtsyAPI performGraphQLRequest:request success:^(id json) {
        failure(@"unexpected block invocation");
    } failure:^(NSError *error) {
        failure(@"unexpected block invocation");
    }];

    [mock verify];
    [mock stopMocking];
});

SpecEnd
