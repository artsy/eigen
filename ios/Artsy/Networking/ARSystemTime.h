#import <Foundation/Foundation.h>


@interface ARSystemTime : NSObject

/**
 *  Legacy: Current server-side date and time based on a previously retrieved interval.
 *  TODO: This class previously was responsible for syncing server and client times, it has been broken a long while possibly can be removed entirely.
 *  @return Current date and time.
 */
+ (NSDate *)date;

@end
