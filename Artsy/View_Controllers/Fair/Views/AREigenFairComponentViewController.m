#import "AREigenFairComponentViewController.h"

@interface AREigenFairComponentViewController () <ARMenuAwareViewController>
@end

@implementation AREigenFairComponentViewController

- (BOOL)hidesStatusBarBackground
{
    return YES;
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
    return UIStatusBarStyleLightContent;
}

@end
