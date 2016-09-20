#import <Foundation/Foundation.h>


@interface NSDate (Util)

/// Ensures we're always using GMT instead of the user's timezone
- (NSDate *)GMTDate;

@end
