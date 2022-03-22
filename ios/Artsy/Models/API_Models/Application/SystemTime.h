#import <Mantle/Mantle.h>


@interface SystemTime : MTLModel <MTLJSONSerializing>
/**
 *  System (server-side) date.
 *
 *  @return Returns the server-side date.
 */
- (NSDate *)date;

/**
 *  Time difference since date.
 *
 *  @param date Date to compare.
 *
 *  @return A time interval.
 */
- (NSTimeInterval)timeIntervalSinceDate:(NSDate *)date;

@end
