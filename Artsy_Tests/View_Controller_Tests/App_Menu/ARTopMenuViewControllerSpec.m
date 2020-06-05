#import "ARTopMenuViewController.h"
#import "ARTopMenuViewController+Testing.h"
#import "ARTestTopMenuNavigationDataSource.h"
#import "ARTabContentView.h"
#import "ARTopMenuNavigationDataSource.h"
#import "ARUserManager+Stubs.h"
#import "AROnboardingViewController.h"
#import "ARStubbedBrowseNetworkModel.h"
#import "ARSwitchBoard.h"

#import <Emission/ARInboxComponentViewController.h>
#import <Emission/ARMapContainerViewController.h>
#import <Emission/ARFavoritesComponentViewController.h>
#import <Emission/ARHomeComponentViewController.h>
#import <Emission/ARSearchComponentViewController.h>
#import <Emission/ARMyProfileComponentViewController.h>

@interface ARTopMenuNavigationDataSource (Test)
@property (nonatomic, assign, readonly) NSUInteger *badgeCounts;

@end


@interface ARTopMenuViewController (ExposedForTesting) <ARTabViewDelegate>
@property (readwrite, nonatomic, strong) ARTopMenuNavigationDataSource *navigationDataSource;
@property (readwrite, nonatomic, assign) enum ARTopTabControllerIndex selectedTabIndex;
@end

SpecBegin(ARTopMenuViewController);

__block ARTopMenuViewController *sut;
__block ARTopMenuNavigationDataSource *dataSource;

dispatch_block_t sharedBefore = ^{
    sut = [[ARTopMenuViewController alloc] initWithStubbedViewControllers];
    sut.navigationDataSource = dataSource;
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
    __block NSInteger tabIndex;
    __block ARTopTabControllerTabType tabType;
    before(^{
        tabType = [data[@"tabType"] integerValue];
        tabIndex = [dataSource indexForTabType:tabType];

        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/xapp_token" withResponse:@{}];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/site_hero_units" withResponse:@[@{ @"heading": @"something" }]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/sets" withResponse:@{}];
    });

    it(@"is selectable when not selected", ^{
        expect([sut tabContentView:sut.tabContentView shouldChangeToIndex:tabIndex]).to.beTruthy();
    });

    describe(@"already selected", ^{
        before(^{
            [sut.tabContentView setCurrentViewIndex:tabIndex animated:NO];
        });

        it(@"is not selectable", ^{
            expect([sut tabContentView:sut.tabContentView shouldChangeToIndex:tabIndex]).to.beFalsy();
        });

        it(@"pops to root", ^{
            [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/collection/saved-artwork/artworks" withResponse:@{}];

            [sut pushViewController:[[UIViewController alloc] init] animated:NO];
            expect(sut.rootNavigationController.viewControllers.count).to.equal(2);

            [sut.tabContentView setCurrentViewIndex:tabIndex animated:NO];
            expect(sut.rootNavigationController.viewControllers.count).to.equal(1);
        });
    });

    describe(@"when presenting a root view controller", ^{
        __block id topMenuVCMock = nil;
        __block id navigationControllerMock = nil;
        __block id tabContentViewMock = nil;

        before(^{
            [sut pushViewController:[[UIViewController alloc] init] animated:NO];

            topMenuVCMock = [OCMockObject partialMockForObject:sut];

            navigationControllerMock = [OCMockObject partialMockForObject:sut.rootNavigationController];
            [[[topMenuVCMock expect] andReturn:navigationControllerMock] rootNavigationControllerAtTab:tabType];

            tabContentViewMock = [OCMockObject partialMockForObject:sut.tabContentView];
            [[[topMenuVCMock expect] andReturn:tabContentViewMock] tabContentView];
        });

        describe(@"when already on the selected tab", ^{
            before(^{
                [sut.tabContentView setCurrentViewIndex:tabIndex animated:NO];
            });

            it(@"animates popping", ^{
                [[navigationControllerMock expect] popToRootViewControllerAnimated:YES];
                [topMenuVCMock presentRootViewControllerInTab:tabType animated:YES];
                [navigationControllerMock verify];
            });

            it(@"does not change tab", ^{
                [[[tabContentViewMock reject] ignoringNonObjectArgs] setCurrentViewIndex:0 animated:0];
                [topMenuVCMock presentRootViewControllerInTab:tabType animated:YES];
                [tabContentViewMock verify];
            });
        });

        describe(@"when not on the selected tab", ^{
            before(^{
                NSInteger numberOfTabs = [sut.navigationDataSource numberOfViewControllersForTabContentView:sut.tabContentView];
                NSInteger otherTab = (tabIndex + 1) % numberOfTabs;
                [sut.tabContentView setCurrentViewIndex:otherTab animated:NO];
            });

            pending(@"does not animate popping", ^{
                [[navigationControllerMock expect] popToRootViewControllerAnimated:NO];
                [topMenuVCMock presentRootViewControllerInTab:tabType animated:NO];
                [navigationControllerMock verify];
            });

            it(@"changes tabs in an animated fashion", ^{
                [[tabContentViewMock expect] setCurrentViewIndex:tabIndex animated:YES];
                [topMenuVCMock presentRootViewControllerInTab:tabType animated:YES];
                [tabContentViewMock verify];
            });
        });
    });
});


describe(@"presenting modally", ^{
    it(@"returns true for a UINavigationController", ^{
        UIViewController *controller = [[UIViewController alloc] init];
        UINavigationController *nav = [[UINavigationController alloc] initWithRootViewController:controller];
        expect([ARTopMenuViewController shouldPresentViewControllerAsModal:nav]).to.beTruthy();
    });
    it(@"returns false for a UIViewController", ^{
        UIViewController *controller = [[UIViewController alloc] init];
        expect([ARTopMenuViewController shouldPresentViewControllerAsModal:controller]).to.beFalsy();
    });
});

describe(@"navigation", ^{
   __block NSInteger tabIndex;
   before(^{
       dataSource = [[ARStubbedTopMenuNavigationDataSource alloc] init];
       sharedBefore();
   });

   describe(@"home",  ^{
     before(^{
        // Select search tab because home is selected by default
        NSInteger searchIndex = [dataSource indexForTabType:ARSearchTab];
        [sut.tabContentView setCurrentViewIndex:searchIndex animated:NO];
     });

     itShouldBehaveLike(@"tab behavior", @{@"tabType" : @(ARHomeTab)});
   });

   describe(@"messaging", ^{
      itShouldBehaveLike(@"tab behavior", @{@"tabType" : @(ARMessagingTab)});
   });

   describe(@"cityGuide", ^{
    __block id switchboardMock;
    before(^{
        switchboardMock = [OCMockObject partialMockForObject:ARSwitchBoard.sharedInstance];
        [[[switchboardMock stub] andReturnValue:@(NO)] isFeatureEnabled:AROptionsEnableSales];
    });

    after(^{
        [switchboardMock stopMocking];
    });

    itShouldBehaveLike(@"tab behavior", @{@"tabType" : @(ARLocalDiscoveryTab)});
   });

   describe(@"sales", ^{
    __block id switchboardMock;

    before(^{
        switchboardMock = [OCMockObject partialMockForObject:ARSwitchBoard.sharedInstance];
        [[[switchboardMock stub] andReturnValue:@(YES)] isFeatureEnabled:AROptionsEnableSales];
    });

    after(^{
        [switchboardMock stopMocking];
    });

    itShouldBehaveLike(@"tab behavior", @{@"tabType" : @(ARSalesTab)});
   });

   describe(@"search", ^{
       itShouldBehaveLike(@"tab behavior", @{@"tabType" : @(ARSearchTab)});
   });

   describe(@"favorites", ^{
       before(^{
           tabIndex = [dataSource indexForTabType:ARFavoritesTab];
       });

       describe(@"logged in", ^{
           before(^{
               [ARUserManager stubAndLoginWithUsername];
           });
           after(^{
               [ARUserManager clearUserData];
           });
           itShouldBehaveLike(@"tab behavior", @{@"tabType" : @(ARFavoritesTab)});
       });
   });

    describe(@"routing", ^{
        before(^{
            [ARUserManager stubAndLoginWithUsername];
        });
        after(^{
            [ARUserManager clearUserData];
        });

        it(@"supports routing to paths", ^{
            NSDictionary *menuToPaths = @{
              @(ARHomeTab) : @"/",
              @(ARMessagingTab) : @"/inbox",
              @(ARSearchTab) : @"/search",
              @(ARFavoritesTab) : @"/favorites"
            };

            ARSwitchBoard *switchboard = [ARSwitchBoard sharedInstance];

            for (NSNumber *tabTypeNum in menuToPaths.keyEnumerator) {
                id viewController = [switchboard loadPath:menuToPaths[tabTypeNum]];

                // This will regenerate each time
                ARTopTabControllerTabType tabType = (ARTopTabControllerTabType) tabTypeNum.integerValue;
                if (tabType == ARFavoritesTab) {
                    expect(viewController).to.beAKindOf(ARFavoritesComponentViewController.class);

                // This will regenerate each time
                } else if (tabType == ARHomeTab) {
                    BOOL isHome = [viewController isKindOfClass:ARHomeComponentViewController.class];
                    expect(isHome).to.equal(YES);
                } else if (tabType == ARMessagingTab) {
                    BOOL isInbox = [viewController isKindOfClass:ARInboxComponentViewController.class];
                    expect(isInbox).to.equal(YES);
                } else if (tabType == ARSearchTab) {
                    BOOL isSearch = [viewController isKindOfClass:ARSearchComponentViewController.class];
                    expect(isSearch).to.equal(YES);
                } else if (tabType == ARLocalDiscoveryTab) {
                    BOOL isCityGuide = [viewController isKindOfClass:ARMapContainerViewController.class];
                    expect(isCityGuide).to.equal(YES);
                } else {
                    expect(viewController).to.equal([[ARTopMenuViewController sharedController] rootNavigationControllerAtTab:tabType].rootViewController);
                }
            }
        });
    });
});

SpecEnd;
