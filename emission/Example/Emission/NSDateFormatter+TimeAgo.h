#import <Foundation/Foundation.h>

// Based on an implmentation in 
// http://stackoverflow.com/questions/902950/iphone-convert-date-string-to-a-relative-time-stamp

@interface NSDateFormatter (Extras)

+ (NSString *)timeAgoFromDate:(NSDate *)date;

@end
