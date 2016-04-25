#import "UIViewController+TopMenuViewController.h"
#import "ARTopMenuViewController+Testing.h"

SpecBegin(UIViewController_TopMenuViewController);

it(@"returns the nil for view controllers that are not in a heirarchy with a ARTopMenuVC", ^{
    expect([[[UIViewController alloc] init] ar_TopMenuViewController]).to.beNil();
});

it(@"returns a TopMenuVC for view controllers that are directly in a heirarchy with a ARTopMenuVC", ^{
    UIViewController *viewController = [[UIViewController alloc] init];

    ARTopMenuViewController *topVC = [[ARTopMenuViewController alloc] initWithStubbedNetworking];
    [topVC ar_presentWithFrame:CGRectMake(0, 0, 320, 200)];
    [topVC pushViewController:viewController animated:NO];

    expect(viewController.ar_TopMenuViewController).to.equal(topVC);
});


it(@"returns a TopMenuVC for view controllers that are deeper in a heirarchy with a ARTopMenuVC", ^{

    UIViewController *viewController = [[UIViewController alloc] init];
    UINavigationController *navController = [[UINavigationController alloc] initWithRootViewController:viewController];

    UIViewController *viewControllerTwo = [[UIViewController alloc] init];
    [viewControllerTwo ar_addModernChildViewController:navController];

    ARTopMenuViewController *topVC = [[ARTopMenuViewController alloc] initWithStubbedNetworking];
    [topVC ar_presentWithFrame:CGRectMake(0, 0, 320, 200)];

    [topVC pushViewController:viewControllerTwo animated:NO];

    expect(viewController.ar_TopMenuViewController).to.equal(topVC);
});

SpecEnd;
