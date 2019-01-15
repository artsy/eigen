#import "ARMapContainerViewController.h"
#import "ARMapComponentViewController.h"
#import "ARCityComponentViewController.h"

#import "Emission-Swift.h"

@interface ARMapContainerViewController ()

@property (nonatomic, readwrite) BottomSheetViewController *bottomSheetVC;
@property (nonatomic, readwrite) ARMapComponentViewController *mapVC;
@property (nonatomic, readwrite) ARCityComponentViewController *cityVC;

@end

@implementation ARMapContainerViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.mapVC = [[ARMapComponentViewController alloc] init];
    self.cityVC = [[ARCityComponentViewController alloc] init];

    self.bottomSheetVC = [[BottomSheetViewController alloc] initWithContentViewController:self.mapVC drawerViewController:self.cityVC];

    [self.view addSubview:self.bottomSheetVC.view];
    self.bottomSheetVC.view.frame = self.view.bounds;
    [self addChildViewController:self.bottomSheetVC];
    [self.bottomSheetVC didMoveToParentViewController:self];
}

@end
