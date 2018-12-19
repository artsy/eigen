//
//  ARMapContainerViewController.m
//  Emission
//
//  Created by Luc Succes on 12/19/18.
//

#import "ARMapContainerViewController.h"
#import "ARMapComponentViewController.h"
#import "Emission-Swift.h"

@interface ARMapContainerViewController ()

@property (nonatomic, readwrite) BottomSheetViewController *bottomSheetVC;
@property (nonatomic, readwrite) ARMapComponentViewController *mapVC;

@end

@implementation ARMapContainerViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.mapVC = [[ARMapComponentViewController alloc] init];

    self.bottomSheetVC = [[BottomSheetViewController alloc] initWithContentViewController:self.mapVC drawerViewController:[[UIViewController alloc] init]];
    [self.view addSubview:self.bottomSheetVC.view];
    self.bottomSheetVC.view.frame = self.view.bounds;
    [self addChildViewController:self.bottomSheetVC];
    [self.bottomSheetVC didMoveToParentViewController:self];

}

@end
