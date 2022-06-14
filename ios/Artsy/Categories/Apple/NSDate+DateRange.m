#import "NSDate+DateRange.h"

#import "ARSystemTime.h"

static NSDateFormatter *ARMonthFormatter;


@implementation NSDate (DateRange)


- (NSString *)ausstellungsdauerToDate:(NSDate *)endDate
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        ARMonthFormatter = [[NSDateFormatter alloc] init];
        [ARMonthFormatter setDateFormat:@"MMM"];
    });

    // This function will return a string that shows the time that the show is/was open, e.g.  "July 2nd - 12th, 2011"
    // If you can figure a better name for the function, I'd love to hear it, no-one could come up with it on #irtsy
    // it turned out the word did exist in German. Thanks Leonard / Jessica ./

    NSString *dateString = nil;
    NSCalendar *gregorian = [[NSCalendar alloc] initWithCalendarIdentifier:NSCalendarIdentifierGregorian];
    NSInteger desiredComponents = (NSCalendarUnitDay | NSCalendarUnitMonth | NSCalendarUnitYear);
    NSDateComponents *startsComponents = [gregorian components:desiredComponents fromDate:self];
    NSDateComponents *endsComponents = [gregorian components:desiredComponents fromDate:endDate];

    NSInteger thisYear = [gregorian components:NSCalendarUnitYear fromDate:[ARSystemTime date]].year;
    BOOL shouldShowYear = endsComponents.year != thisYear;

    // Same month - "July 2nd - 12th, 2011"
    if (endsComponents.month == startsComponents.month && endsComponents.year == startsComponents.year) {
        dateString = [NSString stringWithFormat:@"%@ %@%@ - %@%@",
                                                [ARMonthFormatter stringFromDate:self],
                                                @(startsComponents.day),
                                                [self.class ordinalForDay:startsComponents.day],
                                                @(endsComponents.day),
                                                [self.class ordinalForDay:endsComponents.day]];

        if (shouldShowYear) {
            dateString = [NSString stringWithFormat:@"%@, %@", dateString, @(endsComponents.year)];
        }

        // Same year - "June 12th - August 20th, 2012"
    } else if (endsComponents.year == startsComponents.year) {
        dateString = [NSString stringWithFormat:@"%@ %@%@ - %@ %@%@",
                                                [ARMonthFormatter stringFromDate:self],
                                                @(startsComponents.day),
                                                [self.class ordinalForDay:startsComponents.day],
                                                [ARMonthFormatter stringFromDate:endDate],
                                                @(endsComponents.day),
                                                [self.class ordinalForDay:endsComponents.day]];
        if (shouldShowYear) {
            dateString = [NSString stringWithFormat:@"%@, %@", dateString, @(endsComponents.year)];
        }

        // Different year - "January 12th, 2011 - April 19th, 2014"
    } else {
        dateString = [NSString stringWithFormat:@"%@ %@, %@ - %@ %@, %@",
                                                [ARMonthFormatter stringFromDate:self],
                                                @(startsComponents.day),
                                                @(startsComponents.year),
                                                [ARMonthFormatter stringFromDate:endDate],
                                                @(endsComponents.day),
                                                @(endsComponents.year)];
    }

    return dateString;
}

// returns the bit after the number e.g. st, nd, th
+ (NSString *)ordinalForDay:(NSInteger)integer
{
    // This ended up better than my implementation
    // http://stackoverflow.com/questions/1283045/ordinal-month-day-suffix-option-for-nsdateformatter-setdateformat

    switch (integer) {
        case 1:
        case 21:
        case 31:
            return @"st";

        case 2:
        case 22:
            return @"nd";

        case 3:
        case 23:
            return @"rd";
        default:
            return @"th";
    }
}

@end
