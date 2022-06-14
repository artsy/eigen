#import "UIViewController+InnermostTopViewController.h"

SpecBegin(UINavigationController_InnermostTopViewController);

it(@"returns the nil for empty navigation controllers", ^{
    expect([[[UINavigationController alloc] init] ar_innermostTopViewController]).to.beNil();
});

it(@"returns the direct top view controller if there is no nesting", ^{
    UIViewController *viewController = [[UIViewController alloc] init];

    UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController:viewController];

    expect(navigationController.ar_innermostTopViewController).to.equal(viewController);
});

it(@"returns the inner most top view controller if there is nesting", ^{
    UIViewController *viewController = [[UIViewController alloc] init];

    UINavigationController *childNavigationController = [[UINavigationController alloc] initWithRootViewController:viewController];

    UIViewController *childWrapperviewController = [[UIViewController alloc] init];
    [childWrapperviewController addChildViewController:childNavigationController];
    [childWrapperviewController.view addSubview:childNavigationController.view];

    UINavigationController *rootNavigationController = [[UINavigationController alloc] initWithRootViewController:childWrapperviewController];

    expect(rootNavigationController.ar_innermostTopViewController).to.equal(viewController);
});

it(@"returns the inner most top view controller if there is multiple levels of nesting", ^{
    UIViewController *viewController = [[UIViewController alloc] init];

    UINavigationController *childNavigationController = [[UINavigationController alloc] initWithRootViewController:viewController];

    UIViewController *childWrapperviewController1 = [[UIViewController alloc] init];
    [childWrapperviewController1 addChildViewController:childNavigationController];
    [childWrapperviewController1.view addSubview:childNavigationController.view];

    UIViewController *childWrapperviewController2 = [[UIViewController alloc] init];
    [childWrapperviewController2 addChildViewController:childWrapperviewController1];
    [childWrapperviewController2.view addSubview:childWrapperviewController1.view];

    UINavigationController *rootNavigationController = [[UINavigationController alloc] initWithRootViewController:childWrapperviewController2];

    expect(rootNavigationController.ar_innermostTopViewController).to.equal(viewController);
});

SpecEnd;
