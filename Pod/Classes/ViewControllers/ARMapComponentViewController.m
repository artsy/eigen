#import "ARMapComponentViewController.h"

@implementation ARMapComponentViewController

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

@end
