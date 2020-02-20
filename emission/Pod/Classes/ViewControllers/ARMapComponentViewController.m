#import "ARMapComponentViewController.h"
#import <react-native-mapbox-gl/RCTMGLMapView.h>

@implementation ARMapComponentViewController

+ (void)initialize {
    UIColor *purple100 = [UIColor colorWithRed:110.0f/255.0f green:30.0f/255.0f blue:255.0f/255.0f alpha:1.0f];
    [[RCTMGLMapView appearanceWhenContainedInInstancesOfClasses:@[self]] setTintColor:purple100];
}

- (instancetype)init
{
    return [super initWithEmission:nil moduleName:@"Map" initialProperties:nil];
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
    return UIStatusBarStyleDefault;
}

- (BOOL)fullBleed
{
   return YES;
}

- (BOOL)shouldInjectSafeAreaInsets
{
    return YES;
}

@end
