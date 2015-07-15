#import "ARNavigationController.h"
#import "UIViewController+SimpleChildren.h"
#import "ARPendingOperationViewController.h"
#import "ARBackButtonCallbackManager.h"
#import "ARTopMenuViewController.h"
#import "ARAppSearchViewController.h"


@interface ARNavigationController (Testing)
- (IBAction)back:(id)sender;
@property (readwrite, nonatomic, strong) ARPendingOperationViewController *pendingOperationViewController;
@property (readwrite, nonatomic, strong) ARAppSearchViewController *searchViewController;
@end

SpecBegin(ARNavigationController);

__block ARNavigationController *navigationController;

before(^{
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

    describe(@"back", ^{
        it(@"pops the top view controller", ^{
            UIViewController *viewController2 = [[UIViewController alloc] init];
            [navigationController pushViewController:viewController2 animated:NO];

            expect(navigationController.childViewControllers.count).to.equal(2);

            OCMockObject *navMock = [OCMockObject partialMockForObject:navigationController];
            [[[navMock expect] ignoringNonObjectArgs] popViewControllerAnimated:NO] ;

            [navigationController back:nil];

            [navMock verify];
        });

        it(@"checks for backbutton x-callback-url callback", ^{
            UIViewController *viewController2 = [[UIViewController alloc] init];
            [navigationController pushViewController:viewController2 animated:NO];

            id managerStub = [OCMockObject niceMockForClass:[ARBackButtonCallbackManager class]];
            [[managerStub expect] handleBackForViewController:[OCMArg any]];

            [ARTopMenuViewController sharedController].backButtonCallbackManager = managerStub;

            [navigationController back:nil];

            [managerStub verify];
        });
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
    });

    it(@"presents the search VC", ^{
        [navigationController search:nil];
        // This is normally only called when on-screen
        [(id<UINavigationControllerDelegate>)navigationController navigationController:navigationController
                                                                 didShowViewController:navigationController.searchViewController
                                                                              animated:NO];
        expect(navigationController.topViewController).to.equal(navigationController.searchViewController);
    });

    it(@"removes the search VC from the stack after presenting another view controller on top of it", ^{
        [navigationController search:nil];
        UIViewController *other = [UIViewController new];
        [navigationController pushViewController:other animated:NO];
        // This is normally only called when on-screen
        [(id<UINavigationControllerDelegate>)navigationController navigationController:navigationController
                                                                 didShowViewController:other
                                                                              animated:NO];
        expect(navigationController.viewControllers).to.equal(@[navigationController.rootViewController, other]);
    });

    it(@"removes the search view controller from any other stack before showing it", ^{
        ARNavigationController *other = [[ARNavigationController alloc] initWithRootViewController:navigationController.searchViewController];
        [navigationController search:nil];
        expect(navigationController.searchViewController.navigationController).to.equal(navigationController);
        expect(other.viewControllers).to.beEmpty();
    });
});

SpecEnd
