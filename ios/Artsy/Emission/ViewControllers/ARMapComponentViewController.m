#import "ARMapComponentViewController.h"
@import MapboxMaps;

@implementation ARMapComponentViewController

+ (void)initialize {
    UIColor *blue100 = [UIColor colorWithRed:16.0f/255.0f green:35.0f/255.0f blue:215.0f/255.0f alpha:1.0f];
    [[MapView appearanceWhenContainedInInstancesOfClasses:@[self]] setTintColor:blue100];
}

- (instancetype)init
{
    return [super initWithEmission:nil moduleName:@"Map" initialProperties:nil];
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
    return UIStatusBarStyleDefault;
}

@end
