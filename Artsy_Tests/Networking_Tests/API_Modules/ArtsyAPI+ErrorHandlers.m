#import "ArtsyAPI.h"
#import "MutableNSURLResponse.h"

SpecBegin(ArtsyAPIErrorHandlers);

describe(@"handleHTTPError", ^{
    it(@"nil error", ^{
        waitUntil(^(DoneCallback done) {
            [ArtsyAPI handleHTTPError:nil statusCode:400 errorMessage:nil success:^(NSError *error) {
                expect(false).to.beTruthy();
                done();
            } failure:^(NSError *error) {
                done();
            }];
        });
    });

    it(@"plain NSError", ^{
        waitUntil(^(DoneCallback done) {
            NSError *error = [[NSError alloc] init];
            [ArtsyAPI handleHTTPError:error statusCode:400 errorMessage:nil success:^(NSError *error) {
                expect(false).to.beTruthy();
                done();
            } failure:^(NSError *error) {
                done();
            }];
        });
    });

    it(@"wrong status code", ^{
        waitUntil(^(DoneCallback done) {
            NSError *error = [[NSError alloc] initWithDomain:NSURLErrorDomain code:302 userInfo:@{}];
            [ArtsyAPI handleHTTPError:error statusCode:404 errorMessage:nil success:^(NSError *error) {
                expect(false).to.beTruthy();
                done();
            } failure:^(NSError *error) {
                done();
            }];
        });
    });

    it(@"correct status code and any error message", ^{
        waitUntil(^(DoneCallback done) {
            NSError *error = [[NSError alloc] initWithDomain:NSURLErrorDomain code:401 userInfo:@{
                NSLocalizedRecoverySuggestionErrorKey: @"{\"error\":\"Unauthorized\",\"text\":\"The XAPP token is invalid or has expired.\"}",
                AFNetworkingOperationFailingURLResponseErrorKey: [[MutableNSURLResponse alloc] initWithStatusCode:401]
            }];
            [ArtsyAPI handleHTTPError:error statusCode:401 errorMessage:nil success:^(NSError *error) {
                done();
            } failure:^(NSError *error) {
                expect(false).to.beTruthy();
                done();
            }];
        });
    });

    it(@"correct status code and wrong error message", ^{
            waitUntil(^(DoneCallback done) {
            NSError *error = [[NSError alloc] initWithDomain:NSURLErrorDomain code:401 userInfo:@{
                NSLocalizedRecoverySuggestionErrorKey: @"{\"error\":\"Unauthorized\",\"text\":\"The XAPP token is invalid or has expired.\"}",
                AFNetworkingOperationFailingURLResponseErrorKey: [[MutableNSURLResponse alloc] initWithStatusCode:401]
            }];
            [ArtsyAPI handleHTTPError:error statusCode:401 errorMessage:@"Unexpected" success:^(NSError *error) {
                expect(false).to.beTruthy();
                done();
            } failure:^(NSError *error) {
                done();
            }];

        });
    });

    it(@"correct status code and correct error message", ^{
        waitUntil(^(DoneCallback done) {
            NSError *error = [[NSError alloc] initWithDomain:NSURLErrorDomain code:401 userInfo:@{
                NSLocalizedRecoverySuggestionErrorKey: @"{\"error\":\"Unauthorized\",\"text\":\"The XAPP token is invalid or has expired.\"}",
                AFNetworkingOperationFailingURLResponseErrorKey: [[MutableNSURLResponse alloc] initWithStatusCode:401]
            }];
            [ArtsyAPI handleHTTPError:error statusCode:401 errorMessage:@"Unauthorized" success:^(NSError *error) {
                done();
            } failure:^(NSError *error) {
                expect(false).to.beTruthy();
                done();
            }];
        });
    });
});

describe(@"handleHTTPErrors", ^{
    it(@"correct status code and one correct error message", ^{
        waitUntil(^(DoneCallback done) {
            NSError *error = [[NSError alloc] initWithDomain:NSURLErrorDomain code:401 userInfo:@{
                NSLocalizedRecoverySuggestionErrorKey: @"{\"error\":\"Unauthorized\",\"text\":\"The XAPP token is invalid or has expired.\"}",
                AFNetworkingOperationFailingURLResponseErrorKey: [[MutableNSURLResponse alloc] initWithStatusCode:401]
            }];
            [ArtsyAPI handleHTTPError:error statusCode:401 errorMessages:@[@"Foo", @"Unauthorized"] success:^(NSError *error) {
                done();
            } failure:^(NSError *error) {
                expect(false).to.beTruthy();
                done();
            }];
        });
    });
});

SpecEnd;
