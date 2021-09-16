#import "ARCityComponentViewController.h"

@import Pulley;

@interface ARCityComponentViewController () <PulleyDrawerViewControllerDelegate>

@end

@implementation ARCityComponentViewController

- (instancetype)init
{
    return [super initWithEmission:nil moduleName:@"City" initialProperties:nil];
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
    return UIStatusBarStyleDefault;
}

- (CGFloat)partialRevealDrawerHeightWithBottomSafeArea:(CGFloat)bottomSafeArea
{
    return 244.0f;
}


@end
