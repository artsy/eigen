#import <Foundation/Foundation.h>


@interface ARSystemTime : NSObject

/**
 *  Retrieve server-side date and time and store for future time adjustments.
 */
+ (void)sync;

/**
 *  Reset server-side date and time, require a new sync.
 */
+ (void)reset;

/**
 *  Returns YES if the server-side date and time have been retrieved.
 *
 *  @return Whether the server-side date and time have been retrieved.
 */
+ (BOOL)inSync;

/**
 *  Current server-side date and time based on a previously retrieved interval.
 *
 *  @return Server-side date and time.
 */
+ (NSDate *)date;

@end
