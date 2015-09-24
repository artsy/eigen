#import "ArtsyAPI.h"
#import "ArtsyOHHTTPAPI.h"
#import "ArtsyAPI+Private.h"
#import "MutableNSURLResponse.h"


@interface ArtsyAPI (TestsPrivate)
+ (ArtsyAPI *)sharedAPI;
@end

SpecBegin(ArtsyAPIPrivate);

it(@"is always ArtsyOHHTTPAPI in tests", ^{
    expect([ArtsyAPI sharedAPI]).to.beKindOf(ArtsyOHHTTPAPI.class);
});

describe(@"handleXappTokenError", ^{

    it(@"doesn't reset XAPP token on non-401 errors", ^{
        [UICKeyChainStore setString:@"xapp token" forKey:ARXAppTokenDefault];
        NSError *error = [[NSError alloc] initWithDomain:NSURLErrorDomain code:302 userInfo:@{}];
        [ArtsyAPI handleXappTokenError:error];
        expect([UICKeyChainStore stringForKey:ARXAppTokenDefault]).to.equal(@"xapp token");
    });

    it(@"resets XAPP token on error", ^{
        [UICKeyChainStore setString:@"value" forKey:ARXAppTokenDefault];
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
        expect([UICKeyChainStore stringForKey:ARXAppTokenDefault]).to.beNil();
    });
});

SpecEnd;
