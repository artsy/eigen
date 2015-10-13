#import "ARSystemTime.h"

#import "ArtsyAPI+SystemTime.h"
#import "SystemTime.h"
#import "ARLogger.h"


@implementation ARSystemTime

static NSTimeInterval ARSystemTimeInterval = NSTimeIntervalSince1970;

+ (void)sync
{
    [ArtsyAPI getSystemTime:^(SystemTime *systemTime) {
        @synchronized(self) {
            ARSystemTimeInterval = [[NSDate date] timeIntervalSinceDate:systemTime.date];
            ARActionLog(@"Synchronized clock with server, local time is %.2f second(s) %@", ABS(ARSystemTimeInterval), ARSystemTimeInterval > 0 ? @"ahead" : @"behind");
        }
    } failure:^(NSError *error) {
        ARErrorLog(@"Error retrieving system time, %@", error.localizedDescription);
        [self performSelector:_cmd withObject:nil afterDelay:3];
    }];
}

+ (BOOL)inSync
{
    return ARSystemTimeInterval != NSTimeIntervalSince1970;
}

+ (NSDate *)date
{
    @synchronized(self)
    {
        NSDate *now = [NSDate date];
        return ARSystemTime.inSync ? [now dateByAddingTimeInterval:-ARSystemTimeInterval] : now;
    }
}

+ (void)reset
{
    @synchronized(self)
    {
        ARSystemTimeInterval = NSTimeIntervalSince1970;
    }
}

@end
