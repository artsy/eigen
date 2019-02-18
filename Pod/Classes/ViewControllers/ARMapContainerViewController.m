#import "ARMapContainerViewController.h"
#import "ARMapComponentViewController.h"
#import "ARCityComponentViewController.h"

#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

@import Pulley;

@interface ARMapContainerViewController () <PulleyDelegate, PulleyDrawerViewControllerDelegate>

@property (nonatomic, readwrite) PulleyViewController *bottomSheetVC;
@property (nonatomic, readwrite) ARMapComponentViewController *mapVC;
@property (nonatomic, readwrite) ARCityComponentViewController *cityVC;

@end

@implementation ARMapContainerViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.mapVC = [[ARMapComponentViewController alloc] init];
    self.cityVC = [[ARCityComponentViewController alloc] init];

    self.bottomSheetVC = [[PulleyViewController alloc] initWithContentViewController:self.mapVC drawerViewController:self.cityVC];
    self.bottomSheetVC.delegate = self;

    [self.view addSubview:self.bottomSheetVC.view];
    self.bottomSheetVC.view.frame = self.view.bounds;
    [self addChildViewController:self.bottomSheetVC];
    [self.bottomSheetVC didMoveToParentViewController:self];
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
    return UIStatusBarStyleDefault;
}

# pragma mark - PulleyDelegate Methods

- (void)drawerPositionDidChangeWithDrawer:(PulleyViewController *)drawer bottomSafeArea:(CGFloat)bottomSafeArea
{
    // Pulley doesn't have an easy way for us to find out how much bottom content inset that our CityView scroll view
    // needs. If we take the top inset (the area that the drawer doesn't take up) and the bottom safe area (for iPhone X
    // home indicators), we'll have the visual height not take up by the drawer. Then we can add the scrollview's y
    // position and we'll have the area unavailable for the scrollview, and we'll set it to the bottom content insets.
    CGFloat bottomInset = drawer.drawerTopInset + bottomSafeArea;
    [self.cityVC setProperty:@(bottomInset) forKey:@"verticalMargin"];
    BOOL isDrawerOpen = [drawer.drawerPosition isEqualToPosition:PulleyPosition.open];
    [self.cityVC setProperty:@(isDrawerOpen) forKey:@"isDrawerOpen"];
}

@end
