@import OHHTTPStubs;
#import "ArtsyOHHTTPAPI.h"


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

- (AFJSONRequestOperation *)requestOperation:(NSURLRequest *)request success:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, id JSON))success failure:(void (^)(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON))failure
{
    OHHTTPStubsDescriptor *stub = [[OHHTTPStubs sharedInstance] firstStubPassingTestForRequest:request];
    if (!stub) {
        id spectaExample = [[NSThread mainThread] threadDictionary][@"SPTCurrentSpec"];
        id expectaMatcher = [[NSThread mainThread] threadDictionary][@"EXP_currentMatcher"];

        NSString *error = nil;
        if (spectaExample || expectaMatcher) {
            error = [NSString stringWithFormat:@"\n\n\n!!!! Unstubbed Request Found\n\n\n Inside Test: %@ \n\n Or Matcher: %@ \n\n Unstubbed URL: %@ \n\n\n\n Add a breakpoint  in AROHHTTPNoStubAssertionBot.m or look above for more info. \n\n\n", spectaExample, expectaMatcher, request.URL.absoluteString];
            ;
        }

        return [AFJSONRequestOperation JSONRequestOperationWithRequest:request success:success failure:failure];
    }


    return (id)[ARFakeAFJSONOperation blockOperationWithBlock:^{
        OHHTTPStubsResponse *response = stub.responseBlock(request);
        NSError *error = nil;
        id json = @[];
        if (response.inputStream.hasBytesAvailable) {
            json = [NSJSONSerialization JSONObjectWithStream:response.inputStream options:nil error:&error];
        }

        success(request, nil, json);
    }];
}

@end
