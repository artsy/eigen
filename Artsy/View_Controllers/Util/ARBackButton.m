#import "ARBackButton.h"

#import <Emission/AREmission.h>
#import <EDColor/EDColor.h>



@implementation ARBackButton

- (void)setup
{
    [super setup];

    UIColor *backgroundColor = [[[AREmission sharedInstance] stateStringForKey:[ARStateKey isDarkModeOn]] isEqualToString:@"true"]
    ? [UIColor colorWithHex:0x1D1D1D]
    : [UIColor whiteColor];
    UIColor *tintColor = [[[AREmission sharedInstance] stateStringForKey:[ARStateKey isDarkModeOn]] isEqualToString:@"true"]
    ? [UIColor whiteColor]
    : [UIColor blackColor];

    [self setBorderColor:[UIColor clearColor] forState:UIControlStateNormal animated:NO];
    [self setBackgroundColor:backgroundColor forState:UIControlStateNormal animated:NO];
    [self setTintColor:tintColor];
}

- (void)updateForDarkMode:(BOOL)turnOn
{
    UIColor *backgroundColor = turnOn ? [UIColor colorWithHex:0x1D1D1D] : [UIColor whiteColor];
    UIColor *tintColor = turnOn ? [UIColor whiteColor] : [UIColor blackColor];


    [self setBackgroundColor:backgroundColor forState:UIControlStateNormal animated:NO];
    [self setTintColor:tintColor];

    [self setNeedsLayout];
    [self setNeedsDisplay];
}

@end
