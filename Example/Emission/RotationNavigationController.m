#import "RotationNavigationController.h"

@implementation RotationNavigationController

- (BOOL)shouldAutorotate;
{
    return self.topViewController.shouldAutorotate;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations;
{
    return self.topViewController.supportedInterfaceOrientations;
}

@end
