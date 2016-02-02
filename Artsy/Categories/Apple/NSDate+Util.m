#import "NSDate+Util.h"

#import "ARSystemTime.h"

@implementation NSDate (Util)

- (NSDate *)GMTDate
{
    NSTimeInterval timeZoneOffset = [[NSTimeZone defaultTimeZone] secondsFromGMT];
    NSTimeInterval gmtTimeInterval = [self timeIntervalSinceReferenceDate] - timeZoneOffset;
    return [NSDate dateWithTimeIntervalSinceReferenceDate:gmtTimeInterval];
}

// Adapted from http://digdog.tumblr.com/post/254073803/relative-date-for-nsdate
- (NSString *)relativeDate
{
    NSCalendar *calendar = [NSCalendar currentCalendar];

    NSUInteger unitFlags = NSCalendarUnitYear | NSCalendarUnitMonth | NSCalendarUnitWeekOfYear | NSCalendarUnitDay | NSCalendarUnitHour | NSCalendarUnitMinute | NSCalendarUnitSecond;

    NSDateComponents *components = [calendar components:unitFlags fromDate:self toDate:[ARSystemTime date] options:0];

    NSArray *selectorNames = [NSArray arrayWithObjects:@"year", @"month", @"week", @"day", @"hour", @"minute", @"second", nil];

    for (NSString *selectorName in selectorNames) {
        SEL currentSelector = NSSelectorFromString(selectorName);
        NSMethodSignature *currentSignature = [NSDateComponents instanceMethodSignatureForSelector:currentSelector];
        NSInvocation *currentInvocation = [NSInvocation invocationWithMethodSignature:currentSignature];

        [currentInvocation setTarget:components];
        [currentInvocation setSelector:currentSelector];
        [currentInvocation invoke];

        NSInteger relativeNumber;
        [currentInvocation getReturnValue:&relativeNumber];

        if (relativeNumber) {
            NSString *plural = relativeNumber > 1 ? @"s" : @"";
            return [NSString stringWithFormat:@"%@ %@%@ ago", @(relativeNumber), selectorName, plural];
        }
    }

    return @"Now";
}

@end
