#import "NSDate+Util.h"

#import "ARSystemTime.h"

@implementation NSDate (Util)

- (NSDate *)GMTDate
{
    NSTimeInterval timeZoneOffset = [[NSTimeZone defaultTimeZone] secondsFromGMT];
    NSTimeInterval gmtTimeInterval = [self timeIntervalSinceReferenceDate] - timeZoneOffset;
    return [NSDate dateWithTimeIntervalSinceReferenceDate:gmtTimeInterval];
}

@end
