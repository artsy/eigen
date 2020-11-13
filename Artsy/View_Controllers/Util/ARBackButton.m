#import "ARBackButton.h"

#import <Emission/AREmission.h>


@implementation ARBackButton

- (void)setup
{
    [super setup];

    UIColor *backgroundColor = [[[AREmission sharedInstance] stateStringForKey:[ARStateKey isDarkModeOn]] isEqualToString:@"true"]
        ? [UIColor redColor]
        : [UIColor blueColor];


    [self setBorderColor:[UIColor clearColor] forState:UIControlStateNormal animated:NO];
    [self setBackgroundColor:backgroundColor forState:UIControlStateNormal animated:NO];
}

@end
