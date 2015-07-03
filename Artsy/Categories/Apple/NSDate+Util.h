#import <Foundation/Foundation.h>

// TODO: Util is a bad name category name, plus this is in the networking stack so can it be dealt with another way?


@interface NSDate (Util)
- (NSDate *)GMTDate;
- (NSString *)relativeDate;
@end
