#import "ARTopMenuViewController.h"
#import "ARTestTopMenuNavigationDataSource.h"
#import "ARTabContentView.h"
#import "ARTopMenuNavigationDataSource.h"
#import "ARFairViewController.h"
#import "ARUserManager+Stubs.h"
#import "ARTrialController.h"
#import "AROnboardingViewController.h"
#import "ARStubbedBrowseNetworkModel.h"
#import "ARBrowseViewController.h"
#import "ARBackButtonCallbackManager.h"

@interface ARTopMenuNavigationDataSource (Test)
@property (nonatomic, strong, readonly) ARBrowseViewController *browseViewController;
@end

@interface ARTrialController (Testing)
- (void)presentTrialWithContext:(enum ARTrialContext)context fromTarget:(id)target selector:(SEL)selector;
@end

@interface ARTopMenuViewController(Testing) <ARTabViewDelegate>
@property (readwrite, nonatomic, strong) ARTopMenuNavigationDataSource *navigationDataSource;
@end

SpecBegin(ARTopMenuViewController)

__block ARTopMenuViewController *sut;
__block ARTopMenuNavigationDataSource *dataSource;

dispatch_block_t sharedBefore = ^{
    sut = [[ARTopMenuViewController alloc] init];
    sut.navigationDataSource = dataSource;
    dataSource.browseViewController.networkModel = [[ARStubbedBrowseNetworkModel alloc] init];
    [sut ar_presentWithFrame:[UIScreen mainScreen].bounds];

    [sut beginAppearanceTransition:YES animated:NO];
    [sut endAppearanceTransition];
    [sut.view layoutIfNeeded];
};

itHasSnapshotsForDevicesWithName(@"selects 'home' by default", ^{
    dataSource = [[ARTestTopMenuNavigationDataSource alloc] init];
    sharedBefore();
    return sut;
});

itHasSnapshotsForDevicesWithName(@"should be able to hide", ^{
    dataSource = [[ARTestTopMenuNavigationDataSource alloc] init];
    sharedBefore();
    [sut hideToolbar:YES animated:NO];
    return sut;
});

sharedExamplesFor(@"tab behavior", ^(NSDictionary *data) {
    __block NSInteger tab;
    before(^{
        tab = [data[@"tab"] integerValue];
    });

    it(@"removes x-callback-url callbacks", ^{
        ARBackButtonCallbackManager *manager = [[ARBackButtonCallbackManager alloc] initWithViewController:[[UIViewController alloc] init] andBackBlock:^{}];

        [ARTopMenuViewController sharedController].backButtonCallbackManager = manager;

        [sut tabContentView:sut.tabContentView shouldChangeToIndex:tab];
        expect([ARTopMenuViewController sharedController].backButtonCallbackManager).to.beNil();

    });

    it(@"is selectable when not selected", ^{
        expect([sut tabContentView:sut.tabContentView shouldChangeToIndex:tab]).to.beTruthy();
    });

    describe(@"already selected", ^{
        before(^{
            [sut.tabContentView setCurrentViewIndex:tab animated:NO];
        });

        it(@"is not selectable", ^{
            expect([sut tabContentView:sut.tabContentView shouldChangeToIndex:tab]).to.beFalsy();
        });
        
        it(@"pops to root", ^{
            [sut pushViewController:[[ARFairViewController alloc] init] animated:NO];
            expect(sut.rootNavigationController.viewControllers.count).to.equal(2);

            [sut.tabContentView setCurrentViewIndex:tab animated:NO];
            expect(sut.rootNavigationController.viewControllers.count).to.equal(1);
        });
    });
});

describe(@"navigation", ^{
    __block NSInteger tabIndex;
    before(^{
        dataSource = [[ARTopMenuNavigationDataSource alloc] init];
        sharedBefore();
    });
    describe(@"search", ^{
        before(^{
            tabIndex = ARTopTabControllerIndexSearch;
        });

        itShouldBehaveLike(@"tab behavior", @{@"tab" : [NSNumber numberWithInt:ARTopTabControllerIndexSearch]});

        it(@"always begins at root of stack", ^{
            [sut.tabContentView setCurrentViewIndex:tabIndex animated:NO];
            [sut pushViewController:[[ARFairViewController alloc] init] animated:NO];
            expect(sut.rootNavigationController.viewControllers.count).to.equal(2);

            [sut.tabContentView setCurrentViewIndex:ARTopTabControllerIndexFeed animated:NO];
            [sut.tabContentView setCurrentViewIndex:tabIndex animated:NO];

            expect(sut.rootNavigationController.viewControllers.count).to.equal(1);
        });

        it(@"already at root returns to previous tab", ^{
            id mock = [OCMockObject partialMockForObject:sut];

            [sut.tabContentView setCurrentViewIndex:tabIndex animated:NO];
            [[mock expect] returnToPreviousTab];


            [sut.tabContentView setCurrentViewIndex:tabIndex animated:NO];

            [mock verify];
        });
    });

    describe(@"feed", ^{
        before(^{
            [sut.tabContentView setCurrentViewIndex:ARTopTabControllerIndexSearch animated:NO];
        });
        itShouldBehaveLike(@"tab behavior", @{@"tab" : [NSNumber numberWithInt:ARTopTabControllerIndexFeed]});
    });

    describe(@"browse", ^{
        itShouldBehaveLike(@"tab behavior", @{@"tab" : [NSNumber numberWithInt:ARTopTabControllerIndexBrowse]});
    });

    describe(@"favorites", ^{
        before(^{
            tabIndex = ARTopTabControllerIndexFavorites;
        });

        describe(@"logged out", ^{
            __block id userMock;
            before(^{
                userMock = [OCMockObject niceMockForClass:[User class]];
                [[[userMock stub] andReturnValue:@(YES)] isTrialUser];
            });

            after(^{
                [userMock stopMocking];
            });

            it(@"is not selectable", ^{
                expect([sut tabContentView:sut.tabContentView shouldChangeToIndex:tabIndex]).to.beFalsy();
            });

            it(@"invokes signup popover", ^{
                id mock = [OCMockObject niceMockForClass:[ARTrialController class]];
                [[mock expect] presentTrialWithContext:0 fromTarget:[OCMArg any] selector:[OCMArg anyPointer]] ;
            });
        });

        describe(@"logged in", ^{
            before(^{
                [ARUserManager stubAndLoginWithUsername];
            });
            after(^{
                [ARUserManager clearUserData];
            });
            itShouldBehaveLike(@"tab behavior", @{@"tab" : [NSNumber numberWithInt:ARTopTabControllerIndexFavorites]});
        });
    });
});

SpecEnd
