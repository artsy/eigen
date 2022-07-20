#import "UIColor+ArtsyColors.h"
#import "AREmission.h"


@implementation UIColor (ArtsyColors)

+ (UIColor *)ar_colorWithHex:(UInt32)hex
{
    int r = (hex >> 16) & 0xFF;
    int g = (hex >> 8) & 0xFF;
    int b = (hex) & 0xFF;

    return [UIColor colorWithRed:r / 255.0f
                           green:g / 255.0f
                            blue:b / 255.0f
                           alpha:1];
}

+ (UIColor *)artsyGrayMedium
{
    return [UIColor ar_colorWithHex:0xcccccc];
}

+ (UIColor *)artsyGraySemibold
{
    return [UIColor ar_colorWithHex:0x666666];
}

+ (UIColor *)artsyGrayBold
{
    return [UIColor ar_colorWithHex:0x333333];
}

+ (UIColor *)artsyColorFor:(NSString *)name
{
    return [[AREmission sharedInstance] artsyColorFor:name];
}

@end
