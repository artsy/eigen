@import OHHTTPStubs;
#import "ArtsyOHHTTPAPI.h"

#import "ARFilteredStackTrace.h"


@interface ArtsyAPI (Private)
- (AFHTTPRequestOperation *)requestOperation:(NSURLRequest *)request success:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, id JSON))success failure:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON))failure;
@end


@interface OHHTTPStubsDescriptor : NSObject <OHHTTPStubsDescriptor>
@property (atomic, copy) OHHTTPStubsTestBlock testBlock;
@property (atomic, copy) OHHTTPStubsResponseBlock responseBlock;
@end


@interface OHHTTPStubs (PrivateButIKnowTheCreatorAndItsAllOkay)
+ (instancetype)sharedInstance;
- (OHHTTPStubsDescriptor *)firstStubPassingTestForRequest:(NSURLRequest *)request;
@end


@interface OHHTTPStubsProtocol : NSURLProtocol
- (id)initWithRequest:(NSURLRequest *)request cachedResponse:(NSCachedURLResponse *)response client:(id<NSURLProtocolClient>)client;
@end


@interface ARFakeAFJSONOperation : NSBlockOperation
@property (nonatomic, assign) dispatch_queue_t successCallbackQueue;
@end


@implementation ARFakeAFJSONOperation
@end


@implementation ArtsyOHHTTPAPI

- (AFHTTPRequestOperation *)requestOperation:(NSURLRequest *)request success:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, id JSON))success failure:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON))failureCallback
{
    OHHTTPStubsDescriptor *stub = [[OHHTTPStubs sharedInstance] firstStubPassingTestForRequest:request];
    if (!stub) {
        id spectaExample = [[NSThread mainThread] threadDictionary][@"SPTCurrentSpec"];
        id expectaMatcher = [[NSThread mainThread] threadDictionary][@"EXP_currentMatcher"];

        if (spectaExample || expectaMatcher) {
            static NSArray *whiteList = nil;
            if (whiteList == nil) whiteList = @[ [NSBundle mainBundle], [NSBundle bundleForClass:ArtsyOHHTTPAPI.class] ];
            NSArray *stackTrace = ARFilteredStackTraceWithWhiteList(1, whiteList, ^BOOL(BOOL blockInvocation,
                                                                                        BOOL objcMethod,
                                                                                        BOOL classMethod,
                                                                                        NSString *className,
                                                                                        NSString *methodOrFunction) {
                return !(
                    ([className isEqualToString:@"ArtsyAPI"] && [methodOrFunction hasPrefix:@"getRequest:parseInto"])
                    || [methodOrFunction hasPrefix:@"ar_dispatch"]
                    || [methodOrFunction isEqualToString:@"main"]
                );
            });
            NSAssert(stackTrace.count > 0, @"Stack trace empty, might need omre white listing.");

            printf("\n\n\n[!] Unstubbed Request Found\n");
            printf("   Inside Test: %s\n", [spectaExample description].UTF8String);
            printf("       Matcher: %s\n", [expectaMatcher description].UTF8String);
            printf("Un-stubbed URL: %s\n", request.URL.absoluteString.UTF8String);
            printf("You should use: [OHHTTPStubs stubJSONResponseAtPath:@\"%s\" withResponse:@{}];\n", request.URL.path.UTF8String);
            printf("   Stack trace: %s\n\n\n\n", [stackTrace componentsJoinedByString:@"\n                "].UTF8String);
        }

        return [super requestOperation:request success:success failure:failureCallback];
    }

    return (id)[ARFakeAFJSONOperation blockOperationWithBlock:^{
        OHHTTPStubsResponse *response = stub.responseBlock(request);
        [response.inputStream open];
        NSError *error = nil;
        id json = @[];
        if (response.inputStream.hasBytesAvailable) {
            json = [NSJSONSerialization JSONObjectWithStream:response.inputStream options:NSJSONReadingAllowFragments error:&error];
        }

        NSHTTPURLResponse *URLresponse = [[NSHTTPURLResponse alloc] initWithURL:request.URL statusCode:response.statusCode HTTPVersion:@"1.0" headerFields:response.httpHeaders];

        if (response.statusCode >= 200 && response.statusCode < 205) {
            success(request, URLresponse, json);
        } else {
            failureCallback(request, URLresponse, response.error, json);
        }

    }];
}

@end
