#import "AROHHTTPNoStubAssertionBot.h"
#import <OHHTTPStubs/OHHTTPStubs.h>
#import <objc/runtime.h>

@class OHHTTPStubsDescriptor;


@interface OHHTTPStubs (PrivateStuff)
+ (instancetype)sharedInstance;
- (OHHTTPStubsDescriptor *)firstStubPassingTestForRequest:(NSURLRequest *)request;
@end


@interface ARHTTPStubs : OHHTTPStubs
@end


@implementation ARHTTPStubs

- (OHHTTPStubsDescriptor *)firstStubPassingTestForRequest:(NSURLRequest *)request
{
    id stub = [super firstStubPassingTestForRequest:request];
    if (stub) {
        return stub;
    }

    // Skip http://itunes.apple.com/US/lookup?bundleId=net.artsy.artsy.dev
    if ([request.URL.host hasSuffix:@"apple.com"]) {
        return nil;
    }

    NSLog(@"\n\n\n\n\n\n\n");

    NSLog(@"----------------- Found an unstubbed request");
    NSLog(@" - %@", request.HTTPMethod);
    NSLog(@" - %@", request.URL.absoluteString);

    if (request.allHTTPHeaderFields) {
        NSLog(@" - %@", request.allHTTPHeaderFields);
    }

    if (request.HTTPBody) {
        NSLog(@" - %@", [[NSString alloc] initWithData:request.HTTPBody encoding:NSASCIIStringEncoding]);
    }

    NSLog(@"----------------- ");
    NSLog(@"");


#if __has_include(<Specta/Specta.h>)
    fflush(stderr);
    fflush(stdout);
    id compiledExample = [[NSThread mainThread] threadDictionary][@"SPTCurrentSpec"];

    NSLog(@"\n\n\n!!!! Unstubbed Request Found\n\n\n Inside Test: %@ \n\n Unstubbed URL: %@ \n\n\n\n Add a breakpoint  in AROHHTTPNoStubAssertionBot.m or look above for more info. \n\n\n", compiledExample, request.URL.absoluteString);

    fflush(stderr);
    fflush(stdout);

    exit(-1);
#else
    NSAssert(NO, @"Bang");
#endif

    return nil;
}

@end


@implementation AROHHTTPNoStubAssertionBot

+ (BOOL)assertOnFailForGlobalOHHTTPStubs
{
    id newClass = object_setClass([OHHTTPStubs sharedInstance], ARHTTPStubs.class);
    return newClass != nil;
}

@end
