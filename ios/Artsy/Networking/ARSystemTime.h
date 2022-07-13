#import <Foundation/Foundation.h>


@interface ARSystemTime : NSObject

/**
 *  Current server-side date and time based on a previously retrieved interval.
 *
 *  @return Server-side date and time.
 */
+ (NSDate *)date;

@end
