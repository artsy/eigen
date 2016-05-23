#import "RotationNavigationController.h"

@implementation RotationNavigationController

- (BOOL)shouldAutorotate;
{
    return self.visibleViewController.shouldAutorotate;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations;
{
    return self.visibleViewController.supportedInterfaceOrientations;
}

@end
