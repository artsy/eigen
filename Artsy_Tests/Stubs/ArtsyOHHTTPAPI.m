#import <OHHTTPStubs/OHHTTPStubs.h>
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

/// Pretends to be an AFNetworking operation, but really, it just calls a block
/// thanks Obj-C runtime.


@interface ARFakeAFJSONOperation : NSBlockOperation
@property (nonatomic, assign) dispatch_queue_t completionQueue;
@property (nonatomic, strong) dispatch_group_t completionGroup;
@property (nonatomic, strong) NSURLRequest *request;
@property (nonatomic, strong) id responseObject;
@property (nonatomic, strong) NSError *error;
@end


@implementation ARFakeAFJSONOperation
@end


@implementation ArtsyOHHTTPAPI

- (void)getXappTokenWithCompletion:(void (^)(NSString *xappToken, NSDate *expirationDate))callback failure:(void (^)(NSError *error))failure
{
    callback(@"xapp token", [NSDate distantFuture]);
}

- (AFHTTPRequestOperation *)requestOperation:(NSURLRequest *)request success:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, id JSON))success failure:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON))failureCallback
{
    OHHTTPStubsDescriptor *stub = [[OHHTTPStubs sharedInstance] firstStubPassingTestForRequest:request];
    if (!stub) {
        printf("\n\n\n[!] Unstubbed Request Found\n");

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
        NSAssert(stackTrace.count > 0, @"Stack trace empty, might need more white-listing.");


        NSDictionary *mainThreadDictionary = [[NSThread mainThread] threadDictionary];
        id spectaExample = mainThreadDictionary[@"SPTCurrentSpec"] ?: mainThreadDictionary[@"NimbleEnvironment"];
        id expectaMatcher = [[NSThread mainThread] threadDictionary][@"EXP_currentMatcher"];
        if (spectaExample || expectaMatcher) {
            printf("   Inside Test: %s\n", [spectaExample description].UTF8String);
            printf("       Matcher: %s\n", [expectaMatcher description].UTF8String);
        }

        printf("Un-stubbed URL: %s\n", request.URL.absoluteString.UTF8String);
        printf("You should use: [OHHTTPStubs stubJSONResponseAtPath:@\"%s\" withResponse:@{}];\n", request.URL.path.UTF8String);
        printf("   Stack trace: %s\n\n\n\n", [stackTrace componentsJoinedByString:@"\n                "].UTF8String);

        NSAssert(NO, @"Raising an exception which will fail the test, please handle this. Route: %@", request.URL.path);

        return [super requestOperation:request success:success failure:failureCallback];
    }

    OHHTTPStubsResponse *response = stub.responseBlock(request);
    [response.inputStream open];
    NSError *error = nil;

    id json = @[];
    if (response.inputStream.hasBytesAvailable) {
        json = [NSJSONSerialization JSONObjectWithStream:response.inputStream options:NSJSONReadingAllowFragments error:&error];
    }

    ARFakeAFJSONOperation *fakeOp = [ARFakeAFJSONOperation blockOperationWithBlock:^{
        NSHTTPURLResponse *URLresponse = [[NSHTTPURLResponse alloc] initWithURL:request.URL statusCode:response.statusCode HTTPVersion:@"1.0" headerFields:response.httpHeaders];

        if (response.statusCode >= 200 && response.statusCode < 205) {
            if (success) { success(request, URLresponse, json); }
        } else {
            if (failureCallback) { failureCallback(request, URLresponse, response.error, json); }
        }
    }];

    fakeOp.responseObject = json;
    fakeOp.request = request;
    return (id)fakeOp;
}

- (void)getRequests:(NSArray *)requests success:(void (^)(NSArray *operations))completed
{
    NSArray *operations = [requests map:^id(NSURLRequest *request) {
        return [self requestOperation:request success:nil failure:nil];
    }];
    for (NSBlockOperation *blockOp in operations) {
        [blockOp start];
    }
    completed(operations);
}

@end
