#import "ARMapContainerViewController.h"
#import "ARMapComponentViewController.h"
#import "ARCityComponentViewController.h"
#import "ARCityPickerComponentViewController.h"
#import "ARComponentViewController.h"
#import "ARCity.h"
#import "ARCity+GeospatialAdditions.h"

#import <FLKAutoLayout/UIView+FLKAutoLayout.h>

@import Pulley;
@import CoreLocation;

NSString * const __nonnull SelectedCityNameKey = @"SelectedCityName";

@interface ARMapContainerViewController () <PulleyDelegate, PulleyDrawerViewControllerDelegate, CLLocationManagerDelegate>

@property (nonatomic, readwrite) PulleyViewController *bottomSheetVC;
@property (nonatomic, readwrite) ARMapComponentViewController *mapVC;
@property (nonatomic, readwrite) ARCityComponentViewController *cityVC;
@property (nonatomic, strong) CLLocationManager *locationManager;

@property (nonatomic, strong) ARCityPickerComponentViewController *cityPickerController;
@property (nonatomic, strong) UIView *cityPickerContainerView; // Need a view to have its own shadow.

@property (nonatomic, weak) UIScrollView *rnScrollView;

@property (nonatomic, assign) BOOL initialDataIsLoaded;

@end

static UIScrollView *
FindFirstVerticalScrollView(UIView *view)
{
    for (UIView *subview in view.subviews) {
        if ([subview isKindOfClass:UIScrollView.class] && ([(UIScrollView *)subview contentSize].height > subview.frame.size.height)) {
            return (UIScrollView *)subview;
        }
    }
    for (UIView *subview in view.subviews) {
        UIScrollView *result = FindFirstVerticalScrollView(subview);
        if (result) return result;
    }
    return nil;
}

/*
This is the top-level Local Discovery component, and should therefore be responsible for checking a user's location and
displaying appropriate UI (did they accept the permissions prompt? are they need a city?). There are two cases:
- Show the city picker (they didn't accept the prompt, or they're far away from a city).
- Show the mapVC and cityVC with the appropriate city.
Since this controller already has to do the above logic, having it handle the CityPicker interactions makes sense.
*/

@implementation ARMapContainerViewController

- (void)viewDidLoad
{
    [super viewDidLoad];

    __weak typeof(self) wself = self;
    [[NSNotificationCenter defaultCenter] addObserverForName:@"ARLocalDiscoveryOpenCityPicker" object:nil queue:nil usingBlock:^(NSNotification * _Nonnull note) {
        [wself showCityPicker];
    }];
    [[NSNotificationCenter defaultCenter] addObserverForName:@"ARLocalDiscoveryUserSelectedCity" object:nil queue:nil usingBlock:^(NSNotification * _Nonnull note) {
        NSInteger cityIndex = [note.userInfo[@"cityIndex"] integerValue];
        [wself userSelectedCityAtIndex:cityIndex];
    }];
    [[NSNotificationCenter defaultCenter] addObserverForName:@"ARLocalDiscoveryUpdateDrawerPosition" object:nil queue:nil usingBlock:^(NSNotification * _Nonnull note) {
        NSString *positionString = note.userInfo[@"position"];
        [wself updateDrawerPosition:positionString];
    }];
    [[NSNotificationCenter defaultCenter] addObserverForName:@"ARLocalDiscoveryQueryResponseReceived" object:nil queue:nil usingBlock:^(NSNotification * _Nonnull note) {
        if (wself.initialDataIsLoaded) {
            return;
        }
        [wself.bottomSheetVC setDrawerPositionWithPosition:[PulleyPosition partiallyRevealed] animated:YES completion:nil];
        wself.initialDataIsLoaded = YES;
    }];
    [[NSNotificationCenter defaultCenter] addObserverForName:@"ARLocalDiscoveryCityGotScrollView" object:nil queue:nil usingBlock:^(NSNotification * _Nonnull note) {
            if (!wself.rnScrollView) {
                UIScrollView *foundScrollView = FindFirstVerticalScrollView(wself.cityVC.view);
                wself.rnScrollView = foundScrollView;
                wself.rnScrollView.scrollEnabled = NO;
                if (foundScrollView) {
                    [wself.bottomSheetVC.drawerPanGestureRecognizer requireGestureRecognizerToFail:foundScrollView.panGestureRecognizer];
                }
            }
    }];

    NSString *previouslySelectedCityName = [[NSUserDefaults standardUserDefaults] stringForKey:SelectedCityNameKey];
    ARCity *previouslySelectedCity = [[[ARCity cities] filteredArrayUsingPredicate:[NSPredicate predicateWithBlock:^BOOL(id  _Nullable evaluatedObject, NSDictionary<NSString *,id> * _Nullable bindings) {
        return [[evaluatedObject name] isEqualToString:previouslySelectedCityName];
    }]] firstObject];
    
    self.mapVC = [[ARMapComponentViewController alloc] init];
    self.cityVC = [[ARCityComponentViewController alloc] init];

    if (previouslySelectedCity) {
        // Do this here, before we add to our view hierarchy, so that these are the _initial_ propertyies we do our first render with.
        [self.mapVC setProperty:previouslySelectedCity.slug forKey:@"citySlug"];
        [self.cityVC setProperty:previouslySelectedCity.slug forKey:@"citySlug"];
        [self.mapVC setProperty:@{ @"lat": @(previouslySelectedCity.epicenter.coordinate.latitude), @"lng": @(previouslySelectedCity.epicenter.coordinate.longitude) } forKey:@"initialCoordinates"];
    } else {
        // The user has no previously selected city, so let's try to determine their location.
        self.locationManager = [[CLLocationManager alloc] init];
        self.locationManager.delegate = self;
        self.locationManager.desiredAccuracy = kCLLocationAccuracyThreeKilometers;
        [self.locationManager requestWhenInUseAuthorization];
    }

    self.bottomSheetVC = [[PulleyViewController alloc] initWithContentViewController:self.mapVC drawerViewController:self.cityVC];
    self.bottomSheetVC.animationDuration = 0.35;
    self.bottomSheetVC.initialDrawerPosition = [PulleyPosition closed];
    self.bottomSheetVC.delegate = self;

    self.bottomSheetVC.view.frame = self.view.bounds;
    [self.view addSubview:self.bottomSheetVC.view];
    [self.bottomSheetVC willMoveToParentViewController:self];
    [self addChildViewController:self.bottomSheetVC];
    [self.bottomSheetVC didMoveToParentViewController:self];
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
    return UIStatusBarStyleDefault;
}

- (void)userSuppliedLocation:(CLLocation *)userLocation
{
    ARCity *closestCity = [ARCity cityNearLocation:userLocation];
    if (closestCity) {
        // User is within radius to city.
        [self.mapVC setProperty:closestCity.slug forKey:@"citySlug"];
        [self.cityVC setProperty:closestCity.slug forKey:@"citySlug"];
        [self.mapVC setProperty:@{ @"lat": @(closestCity.epicenter.coordinate.latitude), @"lng": @(closestCity.epicenter.coordinate.longitude) } forKey:@"initialCoordinates"];

        // Technically, the user hasn't selected this city. But we're going to remember it for them.
        // Also, setting this affects showCityPicker's ability to pass the correct props in.
        [[NSUserDefaults standardUserDefaults] setObject:closestCity.name forKey:SelectedCityNameKey];
    } else {
        // User is too far away from any city.
        [self showCityPicker];
    }
}

- (void)showCityPicker
{
    [self.mapVC setProperty:@(YES) forKey:@"hideMapButtons"];

    const CGFloat MARGIN = 20;
    CGFloat topLayoutMargin = self.topLayoutGuide.length;

    self.cityPickerContainerView = [[UIView alloc] initWithFrame:CGRectMake(MARGIN, MARGIN + topLayoutMargin, self.view.frame.size.width - MARGIN*2, self.view.frame.size.height - MARGIN*2 - topLayoutMargin)];
    [self.view addSubview:self.cityPickerContainerView];
    self.cityPickerContainerView.alpha = 0;
    self.cityPickerContainerView.transform = CGAffineTransformMakeScale(0.8, 0.8);

    NSString *previouslySelectedCity = [[NSUserDefaults standardUserDefaults] stringForKey:SelectedCityNameKey];

    self.cityPickerController = [[ARCityPickerComponentViewController alloc] initWithSelectedCityName:previouslySelectedCity];
    [self addChildViewController:self.cityPickerController];
    [self.cityPickerContainerView addSubview:self.cityPickerController.view];
    self.cityPickerController.view.frame = self.cityPickerContainerView.bounds;
    self.cityPickerController.view.clipsToBounds = YES;
    self.cityPickerController.view.layer.cornerRadius = 20;

    CALayer *layer = self.cityPickerContainerView.layer;
    layer.masksToBounds = NO;
    layer.shadowColor = UIColor.blackColor.CGColor;
    layer.shadowRadius = 10;
    layer.shadowOpacity = 0.3;

    [self.bottomSheetVC setDrawerPositionWithPosition:[PulleyPosition closed] animated:YES completion:nil];

    [UIView animateWithDuration:0.35 animations:^{
        self.cityPickerContainerView.alpha = 1;
        self.cityPickerContainerView.transform = CGAffineTransformIdentity;
    }];
}

- (void)userSelectedCityAtIndex:(NSInteger)cityIndex
{
    ARCity *city = [[ARCity cities] objectAtIndex:cityIndex];

    NSString *previouslySelectedCityName = [[NSUserDefaults standardUserDefaults] stringForKey:SelectedCityNameKey];
    if ([previouslySelectedCityName isEqualToString:city.name]) {
        [self.bottomSheetVC setDrawerPositionWithPosition:[PulleyPosition partiallyRevealed] animated:YES completion:nil];
    } else {
        [self.mapVC setProperty:city.slug forKey:@"citySlug"];
        [self.mapVC setProperty:@{ @"lat": @(city.epicenter.coordinate.latitude), @"lng": @(city.epicenter.coordinate.longitude) } forKey:@"initialCoordinates"];
        self.initialDataIsLoaded = NO;
    }

    [[NSUserDefaults standardUserDefaults] setObject:city.name forKey:SelectedCityNameKey];

    [self.mapVC setProperty:@(NO) forKey:@"hideMapButtons"];

    [UIView animateWithDuration:0.35 animations:^{
        self.cityPickerContainerView.alpha = 0;
    } completion:^(BOOL finished) {
        [self.cityPickerController removeFromParentViewController];
        [self.cityPickerContainerView removeFromSuperview];
        self.cityPickerController = nil;
        self.cityPickerContainerView = nil;
    }];
}

- (void)updateDrawerPosition:(NSString *)positionString
{
    PulleyPosition *position = nil;

    if ([positionString isEqualToString:@"closed"]) {
        position = [PulleyPosition closed];
    } else if ([positionString isEqualToString:@"open"]) {
        position = [PulleyPosition open];
    } else if ([positionString isEqualToString:@"partiallyRevealed"]) {
        position = [PulleyPosition partiallyRevealed];
    } else if ([positionString isEqualToString:@"collapsed"]) {
        position = [PulleyPosition collapsed];
    }

    [self.bottomSheetVC setDrawerPositionWithPosition:position animated:YES completion:nil];
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

- (void)drawerChangedDistanceFromBottomWithDrawer:(PulleyViewController *)drawer distance:(CGFloat)distance bottomSafeArea:(CGFloat)bottomSafeArea
{
    CGFloat drawerAbovePartialHeight = [drawer partialRevealDrawerHeightWithBottomSafeArea:bottomSafeArea];

    BOOL isDrawerOpen = [drawer.drawerPosition isEqualToPosition:PulleyPosition.open];
    self.rnScrollView.scrollEnabled = isDrawerOpen;

    BOOL shouldHideButtons = distance > drawerAbovePartialHeight;
    if (!self.cityPickerController) {
        // We don't want to unhide buttons if the city picker is on screen.
        [self.mapVC setProperty:@(shouldHideButtons) forKey:@"hideMapButtons"];
    }
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
    } else if (status == kCLAuthorizationStatusNotDetermined) {
        // nop, don't show city picker.
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
