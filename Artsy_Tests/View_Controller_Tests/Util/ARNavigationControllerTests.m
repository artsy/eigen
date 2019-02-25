#import "ARNavigationController.h"
#import "UIViewController+SimpleChildren.h"
#import "ARPendingOperationViewController.h"
#import "ARTopMenuViewController.h"
#import "ARAppSearchViewController.h"


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
@property (readwrite, nonatomic, strong) ARPendingOperationViewController *pendingOperationViewController;
@property (readwrite, nonatomic, strong) ARAppSearchViewController *searchViewController;
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

describe(@"presenting pending operation layover", ^{
    
    it(@"should animate layover transitions", ^{
        expect(navigationController.animatesLayoverChanges).to.beTruthy();
    });
    
    it(@"should call through to nil when the message isn't included", ^{
        id mock = [OCMockObject partialMockForObject:navigationController];
        [[mock expect] presentPendingOperationLayoverWithMessage:[OCMArg isNil]];
        
        [mock presentPendingOperationLayover];
        
        [mock verify];
    });
    
    describe(@"without animations", ^{
        beforeEach(^{
            navigationController.animatesLayoverChanges = NO;
        });
        
        it(@"should present the new view controller", ^{
            id mock = [OCMockObject partialMockForObject:navigationController];
            [[mock expect] ar_addModernChildViewController:[OCMArg checkForClass:[ARPendingOperationViewController class]]];
            
            [mock presentPendingOperationLayover];
            
            [mock verify];
        });
        
        it(@"should dismiss the view controller once the command's execution is completed", ^{
            id mock = [OCMockObject partialMockForObject:navigationController];
            [[mock expect] ar_removeChildViewController:[OCMArg checkForClass:[ARPendingOperationViewController class]]];
            
            RACCommand *command = [mock presentPendingOperationLayover];
            [command execute:nil];
            
            [mock verify];
        });
        
        describe(@"with a message", ^{
            it(@"should present the new view controller", ^{
                NSString *message = @"Hello fine sir or madam";
                
                id mock = [OCMockObject partialMockForObject:navigationController];
                [[mock expect] ar_addModernChildViewController:[OCMArg checkWithBlock:^BOOL(ARPendingOperationViewController *obj) {
                    return [obj.message isEqualToString:message];
                }]];
                
                [mock presentPendingOperationLayoverWithMessage:message];
                
                [mock verify];
            });
        });
    });
});

describe(@"search", ^{
    before(^{
        navigationController.searchViewController = [ARAppSearchViewController new];
        id mockTopViewController = [OCMockObject partialMockForObject:[ARTopMenuViewController sharedController]];
        [[[mockTopViewController stub] andReturn:navigationController] rootNavigationController];
    });

    it(@"presents the search VC", ^{
        [navigationController showSearch];
        [navigationController callDidShowVCDelegateMethod];
        expect(navigationController.topViewController).to.equal(navigationController.searchViewController);
    });

    it(@"removes the search VC from the stack after presenting another view controller on top of it", ^{
        [navigationController showSearch];
        UIViewController *other = [UIViewController new];
        [navigationController pushViewController:other animated:NO];
        [navigationController callDidShowVCDelegateMethod];
        expect(navigationController.viewControllers).to.equal(@[navigationController.rootViewController, other]);
    });

    it(@"removes the search view controller from any other stack before showing it", ^{
        ARNavigationController *other = [[ARNavigationController alloc] initWithRootViewController:navigationController.searchViewController];
        [navigationController showSearch];
        expect(navigationController.searchViewController.navigationController).to.equal(navigationController);
        expect(other.viewControllers).to.beEmpty();
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
