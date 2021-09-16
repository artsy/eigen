#import <Foundation/Foundation.h>


@interface NSString (StringBetweenStrings)

/// on a string "hello world" with arguments "e" and "d"
/// will return "llo world" or nil if it can't find the start or end.

- (NSString *)substringBetween:(NSString *)start and:(NSString *)end;
@end
