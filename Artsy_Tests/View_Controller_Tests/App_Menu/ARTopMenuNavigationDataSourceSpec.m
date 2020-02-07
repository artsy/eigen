#import "ARTopMenuNavigationDataSource.h"
#import "ARNavigationController.h"

#import "ArtsyAPI.h"
#import "ArtsyAPI+Artworks.h"

#import <Emission/ARHomeComponentViewController.h>
#import <Emission/ARFavoritesComponentViewController.h>

@interface ARTopMenuNavigationDataSource (Testing)
@property (readonly, nonatomic, strong) ARNavigationController *feedNavigationController;
@end


SpecBegin(ARTopMenuNavigationDataSource);

__block ARTopMenuNavigationDataSource *navDataSource;

before(^{
    navDataSource = [[ARTopMenuNavigationDataSource alloc] init];
});

it(@"uses the same home feed vc", ^{
    ARNavigationController *navigationController = [navDataSource feedNavigationController];
    UIViewController *rootVC = [[navigationController viewControllers] objectAtIndex:0];
    expect(rootVC).to.beKindOf(ARHomeComponentViewController.class);

    ARNavigationController *newNavigationController = [navDataSource feedNavigationController];
    UIViewController *newRootVC = [[newNavigationController viewControllers] objectAtIndex:0];
    expect(newNavigationController).to.equal(navigationController);
    expect(newRootVC).to.equal(rootVC);
});

it(@"uses a single profile vc", ^{
    ARNavigationController *navigationController = [navDataSource profileNavigationController];
    UIViewController *rootVC = [[navigationController viewControllers] objectAtIndex:0];
    expect(rootVC).to.beKindOf(ARComponentViewController.class);

    ARNavigationController *newNavigationController = [navDataSource profileNavigationController];
    UIViewController *newRootVC = [[newNavigationController viewControllers] objectAtIndex:0];
    expect(newNavigationController).to.equal(navigationController);
    expect(newRootVC).to.equal(rootVC);
});

it(@"generates favorites vc each time", ^{
    ARNavigationController *navigationController = [navDataSource favoritesNavigationController];
    UIViewController *rootVC = [[navigationController viewControllers] objectAtIndex:0];
    expect(rootVC).to.beKindOf([ARFavoritesComponentViewController class]);

    ARNavigationController *newNavigationController = [navDataSource favoritesNavigationController];
    UIViewController *newRootVC = [[newNavigationController viewControllers] objectAtIndex:0];
    expect(newNavigationController).notTo.equal(navigationController);
    expect(newRootVC).notTo.equal(rootVC);
});

// TODO: Nav Notifications
//
//describe(@"notifications", ^{
//    it(@"sets the app icon badge to the total amount of available notifications", ^{
//        id appMock = [OCMockObject partialMockForObject:[UIApplication sharedApplication]];
//        [[appMock expect] setApplicationIconBadgeNumber:2];
//        [navDataSource setNotificationCount:1 forControllerAtIndex:ARTopTabControllerIndexFeed];
//        [navDataSource setNotificationCount:1 forControllerAtIndex:ARTopTabControllerIndexNotifications];
//        [appMock verify];
//    });
//    
//    it(@"resets the app icon badge if there are 0 notifications", ^{
//        id appMock = [OCMockObject partialMockForObject:[UIApplication sharedApplication]];
//        [[appMock expect] setApplicationIconBadgeNumber:0];
//        [[UIApplication sharedApplication] setApplicationIconBadgeNumber:42];
//        [navDataSource setNotificationCount:0 forControllerAtIndex:ARTopTabControllerIndexNotifications];
//        [appMock verify];
//    });
//});

SpecEnd;
