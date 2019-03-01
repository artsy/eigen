#import "ARMapContainerViewController.h"
#import "ARMapComponentViewController.h"
#import "ARCityComponentViewController.h"
#import "ARCityPickerComponentViewController.h"
#import "ARComponentViewController.h"
#import "ARCity.h"

#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

@import Pulley;
@import CoreLocation;

@interface ARMapContainerViewController () <PulleyDelegate, PulleyDrawerViewControllerDelegate, CLLocationManagerDelegate>

@property (nonatomic, readwrite) PulleyViewController *bottomSheetVC;
@property (nonatomic, readwrite) ARMapComponentViewController *mapVC;
@property (nonatomic, readwrite) ARCityComponentViewController *cityVC;
@property (nonatomic, strong) CLLocationManager *locationManager;

@end

/*
This is the top-level Local Discovery component, and should therefore be responsible for checking a user's location and
displaying appropriate UI (did they accept the permissions prompt? are they need a city?). There are two cases:
- Show the city picker (they didn't accept the prompt, or they're far away from a city).
- Show the mapVC and cityVC with the appropriate city.
We'll need to have an affordance for a user opening the city pciker UI, too. Maybe an NSNotification or something.
*/

@implementation ARMapContainerViewController

- (void)viewDidLoad
{
    [super viewDidLoad];

    self.locationManager = [[CLLocationManager alloc] init];
    self.locationManager.delegate = self;
    self.locationManager.desiredAccuracy = kCLLocationAccuracyThreeKilometers;
    [self.locationManager requestWhenInUseAuthorization];

    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [self showCityPicker];
    });

    __weak typeof(self) sself = self;
    [[NSNotificationCenter defaultCenter] addObserverForName:@"ARLocalDiscoveryUserSelectedCity" object:nil queue:nil usingBlock:^(NSNotification * _Nonnull note) {
        NSInteger cityIndex = [note.userInfo[@"cityIndex"] integerValue];
        [sself userSelectedCityAtIndex:cityIndex];
    }];

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

- (void)userSuppliedLocation:(CLLocation *)userLocation
{
    const NSInteger CITY_RADIUS_M = 100 * 1000; // 100km
    
    ARCity *closestCity = [[[ARCity cities] sortedArrayUsingComparator:^NSComparisonResult(ARCity *_Nonnull lhs, ARCity *_Nonnull rhs) {
        CLLocation *lhsLocation = [[CLLocation alloc] initWithLatitude:lhs.epicenter.latitude longitude:lhs.epicenter.longitude];
        CLLocation *rhsLocation = [[CLLocation alloc] initWithLatitude:rhs.epicenter.latitude longitude:rhs.epicenter.longitude];
        if ([lhsLocation distanceFromLocation:userLocation] < [rhsLocation distanceFromLocation:userLocation]) {
            return NSOrderedAscending;
        } else {
            return NSOrderedDescending;
        }
    }] firstObject];
    
    CLLocation *closestCityLocation = [[CLLocation alloc] initWithLatitude:closestCity.epicenter.latitude longitude:closestCity.epicenter.longitude];
    if ([closestCityLocation distanceFromLocation:userLocation] < CITY_RADIUS_M) {
        // User is within radius to city.
        [self.mapVC setProperty:@{ @"lat": @(closestCity.epicenter.latitude), @"lng": @(closestCity.epicenter.longitude) }
                         forKey:@"coordinates"];
    } else {
        // User is too far away from any city.
        [self showCityPicker];
    }
}

- (void)showCityPicker
{
    // TODO: Present city picker component in a better way.
    UIViewController *viewController = [[ARCityPickerComponentViewController alloc] init];
    
    [self addChildViewController:viewController];
    [self.view addSubview:viewController.view];
    
    viewController.view.frame = CGRectMake(20, 20, self.view.frame.size.width - 40, self.view.frame.size.height - 40);
    viewController.view.layer.cornerRadius = 10;
    viewController.view.clipsToBounds = YES;
}

- (void)userSelectedCityAtIndex:(NSInteger)cityIndex
{
    ARCity *city = [[ARCity cities] objectAtIndex:cityIndex];
    [self.mapVC setProperty:@{ @"lat": @(city.epicenter.latitude), @"lng": @(city.epicenter.longitude) }
                     forKey:@"coordinates"];
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

- (BOOL)fullBleed
{
    return YES;
}

#pragma mark - CLLocationManagerDelegate

- (void)locationManager:(CLLocationManager *)manager didChangeAuthorizationStatus:(CLAuthorizationStatus)status
{
    if (status == kCLAuthorizationStatusAuthorizedWhenInUse) {
        [manager startUpdatingLocation];
    } else {
        [self showCityPicker];
    }
}

- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray<CLLocation *> *)locations
{
    [self userSuppliedLocation:locations.lastObject];
    [manager stopUpdatingLocation];
}

@end
