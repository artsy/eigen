#import <Foundation/Foundation.h>

@interface AROHHTTPNoStubAssertionBot : NSObject

+ (BOOL)assertOnFailForGlobalOHHTTPStubs;
+ (BOOL)logOnFailForGlobalOHHTTPStubs;

@end