#import "ARNavigationController.h"
#import "UIViewController+SimpleChildren.h"
#import "ARTopMenuViewController.h"


@interface ARTestingHidesBackButtonViewController : UIViewController <ARMenuAwareViewController>
@property (readwrite, nonatomic, assign) BOOL hidesBackButton;
@end


@interface ARTestingHidesNavigationButtonsViewController : UIViewController <ARMenuAwareViewController>
@property (readwrite, nonatomic, assign) BOOL hidesNavigationButtons;
@end


@implementation ARTestingHidesNavigationButtonsViewController
@end


@implementation ARTestingHidesBackButtonViewController
@end


@interface ARNavigationController (Testing)
- (IBAction)back:(id)sender;
@end


@implementation ARNavigationController (PrivateTesting)

- (void)callDidShowVCDelegateMethod
{
    // For some reason, this is not called during tests unless the actual view hierarchy is rendered.
    [(id<UINavigationControllerDelegate>)self navigationController:self
                                             didShowViewController:self.topViewController
                                                          animated:NO];
}

@end

SpecBegin(ARNavigationController);

__block ARNavigationController *navigationController;

beforeEach(^{
    UIViewController *viewController = [[UIViewController alloc] init];
    navigationController = [[ARNavigationController alloc] initWithRootViewController:viewController];
});

describe(@"visuals", ^{

    it(@"should be empty for a rootVC", ^{
        expect(navigationController).to.haveValidSnapshot();
    });

    it(@"should be show a back button with 2 view controllers", ^{
        UIViewController *viewController2 = [[UIViewController alloc] init];
        [navigationController pushViewController:viewController2 animated:NO];
        expect(navigationController).to.haveValidSnapshot();
    });
});

describe(@"stack manipulation", ^{
    it(@"removes a view controller from anywhere in the stack", ^{
        UIViewController *viewController2 = [[UIViewController alloc] init];
        [navigationController pushViewController:viewController2 animated:NO];
        [navigationController removeViewControllerFromStack:navigationController.rootViewController];
        expect(navigationController.viewControllers).to.equal(@[viewController2]);
    });
});

describe(@"back button", ^{
    it(@"should hide back", ^{
        ARTestingHidesBackButtonViewController *viewController = [[ARTestingHidesBackButtonViewController alloc] init];
        viewController.hidesBackButton = YES;
        [navigationController pushViewController:viewController animated:NO];

        [navigationController callDidShowVCDelegateMethod];

        viewController.hidesBackButton = NO;
        expect(navigationController.backButton.layer.opacity).to.equal(1);
    });

    it(@"should show back", ^{
        ARTestingHidesBackButtonViewController *viewController = [[ARTestingHidesBackButtonViewController alloc] init];
        viewController.hidesBackButton = NO;
        [navigationController pushViewController:viewController animated:NO];

        [navigationController callDidShowVCDelegateMethod];

        viewController.hidesBackButton = YES;
        expect(navigationController.backButton.layer.opacity).to.equal(0);
    });

    describe(@"hidesBackButton not implemented", ^{
        it(@"falls back to hidesNavigationButtons to show back button ", ^{
            ARTestingHidesNavigationButtonsViewController *viewController = [[ARTestingHidesNavigationButtonsViewController alloc] init];
            viewController.hidesNavigationButtons = NO;
            [navigationController pushViewController:viewController animated:NO];

            [navigationController callDidShowVCDelegateMethod];

            viewController.hidesNavigationButtons = YES;
            expect(navigationController.backButton.layer.opacity).to.equal(0);
        });

        it(@"falls back to hidesNavigationButtons to hide back button ", ^{
            ARTestingHidesNavigationButtonsViewController *viewController = [[ARTestingHidesNavigationButtonsViewController alloc] init];
            viewController.hidesNavigationButtons = YES;
            [navigationController pushViewController:viewController animated:NO];

            [navigationController callDidShowVCDelegateMethod];

            viewController.hidesNavigationButtons = NO;
            expect(navigationController.backButton.layer.opacity).to.equal(1);
        });
    });
});

SpecEnd;
