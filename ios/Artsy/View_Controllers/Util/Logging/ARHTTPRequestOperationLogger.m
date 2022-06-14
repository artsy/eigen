#import "ARHTTPRequestOperationLogger.h"

#import "ARLogger.h"

#import <objc/runtime.h>
#import <AFNetworking/AFHTTPRequestOperation.h>

@implementation ARHTTPRequestOperationLogger

- (id)init
{
    self = [super init];
    if (!self) {
        return nil;
    }

    self.level = httpLogLevel;

    return self;
}

- (void)HTTPOperationDidStart:(NSNotification *)notification
{
    AFHTTPRequestOperation *operation = (AFHTTPRequestOperation *)[notification object];

    if (![operation isKindOfClass:[AFHTTPRequestOperation class]]) {
        return;
    }

    objc_setAssociatedObject(operation, AFHTTPRequestOperationStartDate, [NSDate date], OBJC_ASSOCIATION_RETAIN_NONATOMIC);

    if (self.filterPredicate && [self.filterPredicate evaluateWithObject:operation]) {
        return;
    }

    switch (self.level) {
        case AFLoggerLevelDebug:
            [self logOperationStart:operation];
            break;
        default:
            break;
    }
}

- (void)logOperationStart:(AFHTTPRequestOperation *)operation
{
    if ([operation.request HTTPBody]) {
        NSLog(@"[Operation Start] %@ '%@': %@ %@",
              [operation.request HTTPMethod],
              [[operation.request URL] absoluteString],
              [operation.request allHTTPHeaderFields],
              [[NSString alloc] initWithData:[operation.request HTTPBody] encoding:NSUTF8StringEncoding]);
    }
}

static void *AFHTTPRequestOperationStartDate = &AFHTTPRequestOperationStartDate;

- (void)HTTPOperationDidFinish:(NSNotification *)notification
{
    AFHTTPRequestOperation *operation = (AFHTTPRequestOperation *)[notification object];

    if (![operation isKindOfClass:[AFHTTPRequestOperation class]]) {
        return;
    }

    if (self.filterPredicate && [self.filterPredicate evaluateWithObject:operation]) {
        return;
    }

    NSTimeInterval elapsedTime = [[NSDate date] timeIntervalSinceDate:objc_getAssociatedObject(operation, AFHTTPRequestOperationStartDate)];

    if (operation.error) {
        switch (self.level) {
            case AFLoggerLevelDebug:
            case AFLoggerLevelInfo:
            case AFLoggerLevelWarn:
            case AFLoggerLevelError:
                NSLog(@"[Error] %@ '%@' (%ld) [%.04f s]: %@", [operation.request HTTPMethod], [[operation.response URL] absoluteString], (long)[operation.response statusCode], elapsedTime, operation.error);
            default:
                break;
        }
    } else {
        switch (self.level) {
            case AFLoggerLevelDebug:
                NSLog(@"[Success] %ld '%@' [%.04f s]: %@ %@", (long)[operation.response statusCode], [[operation.response URL] absoluteString], elapsedTime, [operation.response allHeaderFields], operation.responseString);
                break;
            case AFLoggerLevelInfo:
                NSLog(@"[Success] %ld '%@' [%.04f s]", (long)[operation.response statusCode], [[operation.response URL] absoluteString], elapsedTime);
                break;
            default:
                break;
        }
    }
}


@end
