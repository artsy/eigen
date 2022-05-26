#import "NSNumberFormatter+ARCurrency.h"

@implementation NSNumberFormatter (ARCurrency)

+ (NSNumberFormatter *)dollarsFormatterWithCurrentLocale;
{
    static dispatch_once_t onceToken = 0;
    static NSNumberFormatter *formatter = nil;
    dispatch_once(&onceToken, ^{
        formatter = [self dollarsFormatterWithLocale:[NSLocale currentLocale]];
    });
    return formatter;
}

+ (NSNumberFormatter *)dollarsFormatterWithLocale:(NSLocale *)locale;
{
    NSNumberFormatter *formatter = [[NSNumberFormatter alloc] init];
    formatter.locale = locale;
    formatter.currencyCode = @"USD";
    formatter.numberStyle = NSNumberFormatterCurrencyStyle;
    formatter.maximumFractionDigits = 0;
    formatter.alwaysShowsDecimalSeparator = NO;
    return formatter;
}

- (NSString *)stringFromCentsNumber:(NSNumber *)centsNumber;
{
    return [self stringFromNumber:[NSDecimalNumber decimalNumberWithMantissa:centsNumber.intValue exponent:-2 isNegative:NO]];
}

+ (NSString *)currencyStringForCents:(NSNumber *)cents
{
    return [[self dollarsFormatterWithCurrentLocale] stringFromCentsNumber:cents];
}

+ (NSString *)currencyStringForDollarCents:(NSNumber *)cents;
{
    return [[self dollarsFormatterWithCurrentLocale] stringFromCentsNumber:cents];
}

+ (NSString *)currencyStringForDollars:(NSNumber *)dollarsNumber
{
    return [[self dollarsFormatterWithCurrentLocale] stringFromNumber:dollarsNumber];
}

@end
