// http://stackoverflow.com/questions/1918972/camelcase-to-underscores-and-back-in-objective-c

#import "NSString+StringCase.h"


@implementation NSString (StringCase)

+ (NSString *)humanReadableStringFromClass:(Class)klass
{
    NSString *klassString = NSStringFromClass(klass);
    klassString = [klassString stringByReplacingOccurrencesOfString:@"AR" withString:@""];
    klassString = [klassString stringByReplacingOccurrencesOfString:@"ViewController" withString:@""];
    klassString = [klassString stringByReplacingOccurrencesOfString:@"Modern" withString:@""];

    // The function below doesn't deal with starting caps
    klassString = [klassString stringByReplacingCharactersInRange:NSMakeRange(0, 1)
                                                       withString:[[klassString substringToIndex:1] lowercaseString]];

    return [klassString fromCamelCaseToDashed];
}

- (NSString *)fromCamelCaseToDashed
{
    NSScanner *scanner = [NSScanner scannerWithString:self];
    scanner.caseSensitive = YES;

    NSString *builder = [NSString string];
    NSString *buffer = nil;
    NSUInteger lastScanLocation = 0;

    while ([scanner isAtEnd] == NO) {
        if ([scanner scanCharactersFromSet:[NSCharacterSet lowercaseLetterCharacterSet] intoString:&buffer]) {
            builder = [builder stringByAppendingString:buffer];

            if ([scanner scanCharactersFromSet:[NSCharacterSet uppercaseLetterCharacterSet] intoString:&buffer]) {
                builder = [builder stringByAppendingString:@"_"];
                builder = [builder stringByAppendingString:[buffer lowercaseString]];
            }
        }

        // If the scanner location has not moved, there's a problem somewhere.
        if (lastScanLocation == scanner.scanLocation) {
            return nil;
        }

        lastScanLocation = scanner.scanLocation;
    }

    return builder;
}

- (NSString *)fromCamelCaseToSentence
{
    NSScanner *scanner = [NSScanner scannerWithString:self];
    scanner.caseSensitive = YES;

    NSString *builder = [NSString string];
    NSString *buffer = nil;
    NSUInteger lastScanLocation = 0;

    while ([scanner isAtEnd] == NO) {
        if ([scanner scanCharactersFromSet:[NSCharacterSet lowercaseLetterCharacterSet] intoString:&buffer]) {
            builder = [builder stringByAppendingString:buffer];

            if ([scanner scanCharactersFromSet:[NSCharacterSet uppercaseLetterCharacterSet] intoString:&buffer]) {
                builder = [builder stringByAppendingString:@" "];
                builder = [builder stringByAppendingString:[buffer lowercaseString]];
            }
        }

        // If the scanner location has not moved, there's a problem somewhere.
        if (lastScanLocation == scanner.scanLocation) {
            return nil;
        }

        lastScanLocation = scanner.scanLocation;
    }

    return builder;
}


@end
