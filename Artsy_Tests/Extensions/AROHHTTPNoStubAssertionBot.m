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

    id spectaExample = [[NSThread mainThread] threadDictionary][@"SPTCurrentSpec"];
    id expectaMatcher = [[NSThread mainThread] threadDictionary][@"EXP_currentMatcher"];

    NSString *error = nil;
    if (spectaExample || expectaMatcher) {
        error = [NSString stringWithFormat:@"\n\n\n!!!! Unstubbed Request Found\n\n\n Inside Test: %@ \n\n Or Matcher: %@ \n\n Unstubbed URL: %@ \n\n\n\n Add a breakpoint  in AROHHTTPNoStubAssertionBot.m or look above for more info. \n\n\n", spectaExample, expectaMatcher, request.URL.absoluteString];
        ;
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


    fflush(stderr);
    fflush(stdout);
    NSLog(@"%@", error);

    fflush(stderr);
    fflush(stdout);

    exit(-1);

    return nil;
}

@end


@implementation AROHHTTPNoStubAssertionBot

+ (BOOL)assertOnFailForGlobalOHHTTPStubs
{
    //    id newClass = object_setClass([OHHTTPStubs sharedInstance], ARHTTPStubs.class);
    //    return newClass != nil;
    return NO;
}

@end
