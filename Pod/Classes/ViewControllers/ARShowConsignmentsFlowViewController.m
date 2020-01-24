#import "ARShowConsignmentsFlowViewController.h"

@implementation ARShowConsignmentsFlowViewController

- (instancetype)init
{
    return [super initWithEmission:nil moduleName:@"Consignments" initialProperties:nil];
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
    return UIStatusBarStyleLightContent;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
}

@end
