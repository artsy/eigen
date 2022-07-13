#import "UIColor+ArtsyColors.h"

// See: https://github.com/artsy/elan

@implementation UIColor (ArtsyColors)

+ (UIColor *)ar_colorWithHex:(UInt32)hex
{
    return [self ar_colorWithHex:hex andAlpha:1];
}

+ (UIColor *)ar_colorWithHex:(UInt32)hex andAlpha:(CGFloat)alpha
{
    int r = (hex >> 16) & 0xFF;
    int g = (hex >> 8) & 0xFF;
    int b = (hex) & 0xFF;

    return [UIColor colorWithRed:r / 255.0f
                           green:g / 255.0f
                            blue:b / 255.0f
                           alpha:alpha];
}

+ (UIColor *)artsyGrayLight
{
    return [UIColor ar_colorWithHex:0xf8f8f8];
}

+ (UIColor *)artsyGrayRegular
{
    return [UIColor ar_colorWithHex:0xe5e5e5];
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

+ (UIColor *)artsyPurpleLight
{
    return [UIColor ar_colorWithHex:0xe2d2ff];
}

+ (UIColor *)artsyPurpleRegular
{
    return [UIColor ar_colorWithHex:0x6e1fff];
}

+ (UIColor *)artsyRedRegular
{
    return [UIColor ar_colorWithHex:0xf7625a];
}

+ (UIColor *)artsyYellowRegular
{
    return [UIColor ar_colorWithHex:0xfdefd1];
}

+ (UIColor *)artsyGreenRegular
{
    return [UIColor ar_colorWithHex:0x0eda83];
}

@end
