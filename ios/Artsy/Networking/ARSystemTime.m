#import "ARSystemTime.h"

#import "ArtsyAPI+SystemTime.h"
#import "SystemTime.h"
#import "ARLogger.h"


@implementation ARSystemTime

static NSTimeInterval ARSystemTimeInterval = NSTimeIntervalSince1970;

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

@end
