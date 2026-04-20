#import "ARSystemTime.h"

@implementation ARSystemTime

+ (NSDate *)date
{
    @synchronized(self)
    {
        NSDate *now = [NSDate date];
        return now;
    }
}

@end
