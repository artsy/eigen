#import <Foundation/Foundation.h>

/// TODO: When iOS8 only remove and replace with improved NSDateFormatter


@interface NSDate (DateRange)

/// Returns a date range string between two dates. e.g. July 2nd - 12th, 2011
- (NSString *)ausstellungsdauerToDate:(NSDate *)endDate;

/// returns the bit after the number e.g. st, nd, th
+ (NSString *)ordinalForDay:(NSInteger)integer;

@end
