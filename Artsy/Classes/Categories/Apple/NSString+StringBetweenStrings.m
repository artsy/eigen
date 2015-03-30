#import "NSString+StringBetweenStrings.h"

@implementation NSString (StringBetweenStrings)

- (NSString *)substringBetween:(NSString *)start and:(NSString *)end {
    NSRange startingRange = [self rangeOfString:start];
    NSRange endingRange = [self rangeOfString:end];

    if (startingRange.location == NSNotFound || endingRange.location == NSNotFound) {
        return nil;
    }

    NSInteger length = endingRange.location - startingRange.location - startingRange.length;
    if (length < 0) {
        NSLog(@"length is below zero, you need a more specific end result");
        return nil;
    }

    NSInteger location = startingRange.location + startingRange.length;

    if (length + location > self.length || location < 0) {
        return nil;
    }

    return [self substringWithRange:NSMakeRange(location, length)];
}

@end
