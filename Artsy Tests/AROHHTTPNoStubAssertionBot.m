#import "AROHHTTPNoStubAssertionBot.h"
#import <OHHTTPStubs/OHHTTPStubs.h>
#import <objc/runtime.h>

@interface AROHHTTPNoStubAssertionBot()
+ (void)logRequest:(NSURLRequest *)request verbose:(BOOL)verbose;
@end

@class OHHTTPStubsDescriptor;
@interface OHHTTPStubs(PrivateStuff)
+ (instancetype)sharedInstance;
- (OHHTTPStubsDescriptor*)firstStubPassingTestForRequest:(NSURLRequest*)request;
@end


/// A version of OHHTTPStubs that asserts when something is not recognised

@interface ARAssertHTTPStubs: OHHTTPStubs @end

@implementation ARAssertHTTPStubs

- (OHHTTPStubsDescriptor*)firstStubPassingTestForRequest:(NSURLRequest*)request
{
    id stub = [super firstStubPassingTestForRequest:request];
    if (stub) { return stub; }

    // Skip http://itunes.apple.com/US/lookup?bundleId=net.artsy.artsy.dev
    if ([request.URL.host hasSuffix:@"apple.com"]) {
        return nil;
    }

    [AROHHTTPNoStubAssertionBot logRequest:request verbose:YES];

    NSAssert(NO, @"BANG");
    return nil;
}

@end

/// A version of OHHTTPStubs that logs when something is not recognised

@interface ARLogHTTPStubs: OHHTTPStubs @end

@implementation ARLogHTTPStubs

- (OHHTTPStubsDescriptor*)firstStubPassingTestForRequest:(NSURLRequest*)request
{
    id stub = [super firstStubPassingTestForRequest:request];
    if (stub) { return stub; }

    // Skip http://itunes.apple.com/US/lookup?bundleId=net.artsy.artsy.dev
    if ([request.URL.host hasSuffix:@"apple.com"]) {
        return nil;
    }

    [AROHHTTPNoStubAssertionBot logRequest:request verbose:NO];

    return nil;
}

@end

@implementation AROHHTTPNoStubAssertionBot

+ (BOOL)assertOnFailForGlobalOHHTTPStubs
{
    id newClass = object_setClass([OHHTTPStubs sharedInstance], ARAssertHTTPStubs.class);
    return newClass != nil;
}

+ (BOOL)logOnFailForGlobalOHHTTPStubs
{
    id newClass = object_setClass([OHHTTPStubs sharedInstance], ARLogHTTPStubs.class);
    return newClass != nil;
}

+ (void)logRequest:(NSURLRequest *)request verbose:(BOOL)verbose
{
    if (verbose == NO) {
        NSLog(@"--- UNSTUBBED %@ - %@", request.HTTPMethod, request.URL.absoluteString);
    } else {
        NSLog(@"");
        NSLog(@"----------------- Found an unstubbed request");
        NSLog(@" - %@", request.HTTPMethod );
        NSLog(@" - %@", request.URL.absoluteString);

        if (request.allHTTPHeaderFields) {
            NSLog(@" - %@", request.allHTTPHeaderFields);
        }

        if (request.HTTPBody) {
            NSLog(@" - %@", [[NSString alloc] initWithData:request.HTTPBody encoding:NSASCIIStringEncoding]);
        }
        
        NSLog(@"----------------- ");
        NSLog(@"");
    }
}

@end


