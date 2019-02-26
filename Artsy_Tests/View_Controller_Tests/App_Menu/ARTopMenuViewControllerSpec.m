#import "ARTopMenuViewController.h"
#import "ARTopMenuViewController+Testing.h"
#import "ARTestTopMenuNavigationDataSource.h"
#import "ARTabContentView.h"
#import "ARTopMenuNavigationDataSource.h"
#import "ARUserManager+Stubs.h"
#import "AROnboardingViewController.h"
#import "ARStubbedBrowseNetworkModel.h"
#import "ARBrowseViewController.h"
#import "ARSwitchBoard.h"

#import <Emission/ARWorksForYouComponentViewController.h>
#import <Emission/ARInboxComponentViewController.h>
#import <Emission/ARMapContainerViewController.h>
#import <Emission/ARFavoritesComponentViewController.h>


@interface ARTopMenuNavigationDataSource (Test)
@property (nonatomic, strong, readonly) ARBrowseViewController *browseViewController;
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
    __block NSInteger tab;
    before(^{
        tab = [data[@"tab"] integerValue];

        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/xapp_token" withResponse:@{}];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/site_hero_units" withResponse:@[@{ @"heading": @"something" }]];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/sets" withResponse:@{}];
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
            [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/collection/saved-artwork/artworks" withResponse:@{}];

            [sut pushViewController:[[UIViewController alloc] init] animated:NO];
            expect(sut.rootNavigationController.viewControllers.count).to.equal(2);

            [sut.tabContentView setCurrentViewIndex:tab animated:NO];
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
            [[[topMenuVCMock expect] andReturn:navigationControllerMock] rootNavigationControllerAtIndex:tab];

            tabContentViewMock = [OCMockObject partialMockForObject:sut.tabContentView];
            [[[topMenuVCMock expect] andReturn:tabContentViewMock] tabContentView];
        });

        describe(@"when already on the selected tab", ^{
            before(^{
                [sut.tabContentView setCurrentViewIndex:tab animated:NO];
            });

            it(@"animates popping", ^{
                [[navigationControllerMock expect] popToRootViewControllerAnimated:YES];
                [topMenuVCMock presentRootViewControllerAtIndex:tab animated:YES];
                [navigationControllerMock verify];
            });

            it(@"does not change tab", ^{
                [[[tabContentViewMock reject] ignoringNonObjectArgs] setCurrentViewIndex:0 animated:0];
                [topMenuVCMock presentRootViewControllerAtIndex:tab animated:YES];
                [tabContentViewMock verify];
            });
        });

        describe(@"when not on the selected tab", ^{
            before(^{
                NSInteger numberOfTabs = [sut.navigationDataSource numberOfViewControllersForTabContentView:sut.tabContentView];
                NSInteger otherTab = (tab + 1) % numberOfTabs;
                [sut.tabContentView setCurrentViewIndex:otherTab animated:NO];
            });

            pending(@"does not animate popping", ^{
                [[navigationControllerMock expect] popToRootViewControllerAnimated:NO];
                [topMenuVCMock presentRootViewControllerAtIndex:tab animated:NO];
                [navigationControllerMock verify];
            });

            it(@"changes tabs in an animated fashion", ^{
                [[tabContentViewMock expect] setCurrentViewIndex:tab animated:YES];
                [topMenuVCMock presentRootViewControllerAtIndex:tab animated:YES];
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

   describe(@"messaging", ^{
       itShouldBehaveLike(@"tab behavior", @{@"tab" : [NSNumber numberWithInt:ARTopTabControllerIndexMessaging]});
   });

//   describe(@"profile", ^{
//       itShouldBehaveLike(@"tab behavior", @{@"tab" : [NSNumber numberWithInt:ARTopTabControllerIndexProfile]});
//   });

   describe(@"favorites", ^{
       before(^{
           tabIndex = ARTopTabControllerIndexFavorites;
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

    describe(@"routing", ^{
        before(^{
            [ARUserManager stubAndLoginWithUsername];
        });
        after(^{
            [ARUserManager clearUserData];
        });

        it(@"supports routing to paths", ^{
            NSDictionary *menuToPaths = @{
              @(ARTopTabControllerIndexHome) : @"/",
              @(ARTopTabControllerIndexMessaging) : @"/inbox",
              @(ARTopTabControllerIndexFavorites) : @"/favorites",
              @(ARTopTabControllerIndexProfile) : @"/ios-settings",
            };

            ARSwitchBoard *switchboard = [ARSwitchBoard sharedInstance];
            for (NSNumber *tabIndex in menuToPaths.keyEnumerator) {
                id viewcontroller = [switchboard loadPath:menuToPaths[tabIndex]];

                // This will regenerate each time
                if (tabIndex.integerValue == ARTopTabControllerIndexFavorites) {
                    expect(viewcontroller).to.beAKindOf(ARFavoritesComponentViewController.class);

                // This will regenerate each time
                } else if (tabIndex.integerValue == ARTopTabControllerIndexMessaging) {

                    // This gets pushed aside for the new navigation
                    if (![AROptions boolForOption:AROptionsLocalDiscovery]) {
                        expect(viewcontroller).to.beAKindOf(ARFavoritesComponentViewController.class);
                    }

                    if ([AROptions boolForOption:AROptionsLocalDiscovery]) {
                        expect(viewcontroller).to.beAKindOf(ARInboxComponentViewController.class);
                    }

                } else {
                    expect(viewcontroller).to.equal([[ARTopMenuViewController sharedController] rootNavigationControllerAtIndex:tabIndex.integerValue].rootViewController);
                }
            }
        });
    });
});

SpecEnd;
