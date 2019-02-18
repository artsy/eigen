#import "ARMapComponentViewController.h"

@implementation ARMapComponentViewController

- (instancetype)init
{
    return [super initWithEmission:nil moduleName:@"Map" initialProperties:nil];
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    [self.view addConstraints:@[
                                [NSLayoutConstraint constraintWithItem:self.rootView
                                                             attribute:NSLayoutAttributeTop
                                                             relatedBy:NSLayoutRelationEqual
                                                                toItem:self.view
                                                             attribute:NSLayoutAttributeTop
                                                            multiplier:1
                                                              constant:0]
                                ]];
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
    return UIStatusBarStyleDefault;
}

@end
