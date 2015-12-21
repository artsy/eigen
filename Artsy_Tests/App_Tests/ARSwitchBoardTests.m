#import "ARSwitchBoard.h"
#import "AROptions.h"
#import "ARRouter.h"
#import "ArtsyAPI.h"
#import "ArtsyAPI+Profiles.h"
#import "ARTopMenuViewController.h"
#import "ARFavoritesViewController.h"
#import "ARProfileViewController.h"
#import "ARArtistViewController.h"
#import "ARBrowseCategoriesViewController.h"
#import "ARArtworkSetViewController.h"
#import "ARExternalWebBrowserViewController.h"
#import "ARGeneViewController.h"
#import "ARInternalMobileWebViewController.h"
#import "ARProfileViewController.h"
#import "ARShowViewController.h"
#import "ARFairViewController.h"
#import "ARFairArtistViewController.h"
#import "ARFairGuideContainerViewController.h"
#import "ARTopMenuNavigationDataSource.h"


@interface ARSwitchBoard (Tests)
- (NSURL *)resolveRelativeUrl:(NSString *)path;
- (id)routeInternalURL:(NSURL *)url fair:(Fair *)fair;
- (void)openURLInExternalService:(NSURL *)url;
@end


@interface ARProfileViewController (Tests)
- (void)showViewController:(UIViewController *)viewController;
@end


@interface ARTopMenuViewController (Tests)
@property (nonatomic, readonly) ARTopMenuNavigationDataSource *navigationDataSource;
@end


@interface ARTopMenuNavigationDataSource (Tests)
@property (nonatomic, readonly) ARNavigationController *notificationsNavigationController;
@end

SpecBegin(ARSwitchBoard);

__block ARSwitchBoard *switchboard;

describe(@"ARSwitchboard", ^{

    beforeEach(^{
        switchboard = [[ARSwitchBoard alloc] init];
    });

    describe(@"resolveRelativeUrl", ^{
        beforeEach(^{
            [AROptions setBool:false forOption:ARUseStagingDefault];
            [ARRouter setup];
        });

        it(@"resolves absolute artsy.net url", ^{
            NSString *resolvedUrl = [[switchboard resolveRelativeUrl:@"http://artsy.net/foo/bar"] absoluteString];
            expect(resolvedUrl).to.equal(@"http://artsy.net/foo/bar");
        });

        it(@"resolves absolute external url", ^{
            NSString *resolvedUrl = [[switchboard resolveRelativeUrl:@"http://example.com/foo/bar"] absoluteString];
            expect(resolvedUrl).to.equal(@"http://example.com/foo/bar");
        });

        it(@"resolves relative url", ^{
            NSString *resolvedUrl = [[switchboard resolveRelativeUrl:@"/foo/bar"] absoluteString];
            expect(resolvedUrl).to.equal(@"https://m.artsy.net/foo/bar");
        });
    });

    describe(@"loadURL", ^{
        __block id switchboardMock;

        before(^{
            switchboardMock = [OCMockObject partialMockForObject:switchboard];
        });

        describe(@"with internal url", ^{
            it(@"routes internal urls correctly", ^{
                NSURL *internalURL = [[NSURL alloc] initWithString:@"http://artsy.net/some/path"];
                [[switchboardMock expect] routeInternalURL:internalURL fair:nil];
                [switchboard loadURL:internalURL];
                [switchboardMock verify];
            });
        });

        describe(@"with non http schemed url", ^{
            it(@"does not load an internal view", ^{
                [[switchboardMock stub] openURLInExternalService:OCMOCK_ANY];

                NSURL *externalURL = [[NSURL alloc] initWithString:@"mailto:email@mail.com"];
                [[switchboardMock reject] routeInternalURL:OCMOCK_ANY fair:nil];
                [switchboard loadURL:externalURL];
                [switchboardMock verify];
            });

            it(@"does not load browser", ^{
                id sharedAppMock = [OCMockObject partialMockForObject:[UIApplication sharedApplication]];
                [[sharedAppMock reject] openURL:OCMOCK_ANY];

                NSURL *internalURL = [[NSURL alloc] initWithString:@"mailto:email@mail.com"];
                [switchboard loadURL:internalURL];
                [sharedAppMock verify];
            });

            it(@"opens with the OS for non-http links", ^{
                NSURL *internalURL = [[NSURL alloc] initWithString:@"tel:111111"];
                [[switchboardMock expect] openURLInExternalService:OCMOCK_ANY];

                [switchboard loadURL:internalURL];
                [switchboardMock verify];
            });

        });

        describe(@"with applewebdata urls", ^{
            it(@"does not load browser", ^{
                NSURL *internalURL = [[NSURL alloc] initWithString:@"applewebdata://EF86F744-3F4F-4732-8A4B-3E5E94D6D7DA/some/path"];
                id sharedAppMock = [OCMockObject partialMockForObject:[UIApplication sharedApplication]];
                [[sharedAppMock reject] openURL:OCMOCK_ANY];
                [switchboard loadURL:internalURL];
                [sharedAppMock verify];

            });

            it(@"routes internal urls", ^{
                NSURL *internalURL = [[NSURL alloc] initWithString:@"applewebdata://EF86F744-3F4F-4732-8A4B-3E5E94D6D7DA/some/path"];
                [[switchboardMock expect] routeInternalURL:[[NSURL alloc] initWithString:@"http://artsy.net/some/path"] fair:nil];
                [switchboard loadURL:internalURL];
                [switchboardMock verify];
            });
        });

        it(@"loads web view for external urls", ^{
            it(@"loads browser", ^{
                NSURL *externalURL = [[NSURL alloc] initWithString:@"http://google.com"];
                id viewController = [switchboard loadURL:externalURL];
                expect([viewController isKindOfClass:[ARExternalWebBrowserViewController class]]).to.beTruthy();

            });

            it(@"does not route url", ^{
                NSURL *externalURL = [[NSURL alloc] initWithString:@"http://google.com"];
                [[switchboardMock reject] routeInternalURL:OCMOCK_ANY fair:nil];
                [switchboard loadURL:externalURL];
                [switchboardMock verify];
            });

        });
    });

    describe(@"routeInternalURL", ^{
        __block id classMock;
        __block __strong id controllerMock;

        before(^{
            controllerMock = [OCMockObject partialMockForObject:[ARTopMenuViewController sharedController]];
            classMock = [OCMockObject mockForClass:[ARTopMenuViewController class]];
            [[[classMock stub] andReturn:controllerMock] sharedController];
        });

        after(^{
            [controllerMock verify];
            [controllerMock stopMocking];
            [classMock stopMocking];
        });

        it(@"routes /favorites", ^{
            [[controllerMock expect] pushViewController:[OCMArg checkForClass:[ARFavoritesViewController class]]];
            [switchboard routeInternalURL:[[NSURL alloc] initWithString:@"http://artsy.net/favorites"] fair:nil];
        });

        it(@"routes /browse", ^{
            [[controllerMock expect] pushViewController:[OCMArg checkForClass:[ARBrowseCategoriesViewController class]]];
            [switchboard routeInternalURL:[[NSURL alloc] initWithString:@"http://artsy.net/browse"] fair:nil];
        });

        it(@"routes profiles", ^{
            // See aditional tests for profile routing below.
            [[controllerMock expect] pushViewController:[OCMArg checkForClass:[ARProfileViewController class]]];
            NSURL *profileURL = [[NSURL alloc] initWithString:@"http://artsy.net/myprofile"];
            [switchboard routeInternalURL:profileURL fair:nil];
        });

        it(@"routes artists", ^{
            [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/artist/artistname/artworks" withParams:@{ @"page" : @"1", @"size" : @"10" } withResponse:@[]];
            [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/artists" withParams:@{ @"artist[]" : @"artistname" } withResponse:@[]];
            [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/posts" withParams:@{ @"artist[]" : @"artistname" } withResponse:@[]];
            [[controllerMock expect] pushViewController:[OCMArg checkForClass:[ARArtistViewController class]]];
            [switchboard routeInternalURL:[[NSURL alloc] initWithString:@"http://artsy.net/artist/artistname"] fair:nil];
        });

        it(@"routes artists in a gallery context on iPad", ^{
            [ARTestContext stubDevice:ARDeviceTypePad];
            switchboard = [[ARSwitchBoard alloc] init];
            [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/artist/artistname/artworks" withParams:@{ @"page" : @"1", @"size" : @"10" } withResponse:@[]];
            [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/artists" withParams:@{ @"artist[]" : @"artistname" } withResponse:@[]];
            [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/related/posts" withParams:@{ @"artist[]" : @"artistname" } withResponse:@[]];

            [[controllerMock expect] pushViewController:[OCMArg checkForClass:[ARArtistViewController class]]];

            id viewController = [switchboard routeInternalURL:[[NSURL alloc] initWithString:@"http://artsy.net/some-gallery/artist/artistname"] fair:nil];
            expect(viewController).to.beNil();
            [ARTestContext stopStubbing];
        });

        it(@"does not route artists in a gallery context on iPhone", ^{
            [ARTestContext stubDevice:ARDeviceTypePhone5];
            switchboard = [[ARSwitchBoard alloc] init];
            [[controllerMock reject] pushViewController:[OCMArg checkForClass:[ARArtistViewController class]]];
            id viewController = [switchboard routeInternalURL:[[NSURL alloc] initWithString:@"http://artsy.net/some-gallery/artist/artistname"] fair:nil];
            expect(viewController).to.beKindOf([ARInternalMobileWebViewController class]);
            [ARTestContext stopStubbing];
        });

        it(@"routes shows", ^{
            [[controllerMock expect] pushViewController:[OCMArg checkForClass:[ARShowViewController class]]];
            id viewController = [switchboard routeInternalURL:[[NSURL alloc] initWithString:@"http://artsy.net/show/show-id"] fair:nil];
            expect(viewController).to.beNil();
        });

        describe(@"routing to existing top-menu root view controllers", ^{
            __block ARNavigationController *navigationController = nil;

            beforeEach(^{
                UIViewController *rootViewController = [UIViewController new];
                navigationController = [[ARNavigationController alloc] initWithRootViewController:rootViewController];
            });

            it(@"routes works-for-you", ^{
                [[[controllerMock expect] andReturn:navigationController] rootNavigationControllerAtIndex:ARTopTabControllerIndexNotifications];

                id viewController = [switchboard routeInternalURL:[NSURL URLWithString:@"http://artsy.net/works-for-you"] fair:nil];
                expect(viewController).to.equal(navigationController.rootViewController);
            });

            it(@"routes shows", ^{
                [[[controllerMock expect] andReturn:navigationController] rootNavigationControllerAtIndex:ARTopTabControllerIndexShows];

                id viewController = [switchboard routeInternalURL:[NSURL URLWithString:@"http://artsy.net/shows"] fair:nil];
                expect(viewController).to.equal(navigationController.rootViewController);
            });

            it(@"routes articles", ^{
                [[[controllerMock expect] andReturn:navigationController] rootNavigationControllerAtIndex:ARTopTabControllerIndexMagazine];

                id viewController = [switchboard routeInternalURL:[NSURL URLWithString:@"http://artsy.net/articles"] fair:nil];
                expect(viewController).to.equal(navigationController.rootViewController);
            });
        });

        context(@"fairs", ^{

            context(@"on iphone", ^{
                before(^{
                    [ARTestContext stubDevice:ARDeviceTypePhone5];
                    switchboard = [[ARSwitchBoard alloc] init];
                });

                after(^{
                    [ARTestContext stopStubbing];
                });

                it(@"routes fair guide", ^{
                    Fair *fair = [OCMockObject mockForClass:[Fair class]];
                    [[controllerMock expect] pushViewController:[OCMArg checkForClass:[ARFairGuideContainerViewController class]]];
                    id viewController = [switchboard routeInternalURL:[[NSURL alloc] initWithString:@"http://artsy.net/fair-id/for-you"] fair:fair];
                    expect(viewController).to.beNil();
                });

                it(@"routes fair artists", ^{
                    Fair *fair = [OCMockObject mockForClass:[Fair class]];
                    [[controllerMock expect] pushViewController:[OCMArg checkForClass:[ARFairArtistViewController class]]];
                    id viewController = [switchboard routeInternalURL:[[NSURL alloc] initWithString:@"/the-armory-show/browse/artist/artist-id"] fair:fair];
                    expect(viewController).to.beNil();
                });

                it(@"forwards fair for non-native views", ^{
                    Fair *fair = [OCMockObject mockForClass:[Fair class]];
                    ARInternalMobileWebViewController *viewController = [switchboard routeInternalURL:[[NSURL alloc] initWithString:@"/the-armory-show/browse/artists"] fair:fair];
                    expect(viewController.fair).to.equal(fair);
                });
            });

            context(@"on ipad", ^{
                before(^{
                    [ARTestContext stubDevice:ARDeviceTypePad];
                    switchboard = [[ARSwitchBoard alloc] init];
                });

                after(^{
                    [ARTestContext stopStubbing];
                });

                it(@"doesn't route fair guide", ^{
                    Fair *fair = [OCMockObject mockForClass:[Fair class]];
                    [[controllerMock reject] pushViewController:OCMOCK_ANY];
                    ARInternalMobileWebViewController *viewController = [switchboard routeInternalURL:[[NSURL alloc] initWithString:@"http://artsy.net/fair-id/for-you"] fair:fair];
                    expect(viewController).to.beKindOf([ARInternalMobileWebViewController class]);
                    expect(viewController.fair).to.equal(fair);
                });

                it(@"doesn't route fair artists", ^{
                    Fair *fair = [OCMockObject mockForClass:[Fair class]];
                    [[controllerMock reject] pushViewController:OCMOCK_ANY];
                    ARInternalMobileWebViewController *viewController = [switchboard routeInternalURL:[[NSURL alloc] initWithString:@"/the-armory-show/browse/artist/artist-id"] fair:fair];
                    expect(viewController).to.beKindOf([ARInternalMobileWebViewController class]);
                    expect(viewController.fair).to.equal(fair);
                });
            });
        });


        it(@"routes artworks", ^{
            [[controllerMock expect] pushViewController:[OCMArg checkForClass:[ARArtworkSetViewController class]]];
            [switchboard routeInternalURL:[[NSURL alloc] initWithString:@"http://artsy.net/artwork/artworkID"] fair:nil];
        });

        it(@"routes artworks and retains fair context", ^{
            Fair *fair = [Fair modelWithJSON:@{}];
            [[controllerMock expect] pushViewController:[OCMArg checkWithBlock:^BOOL(ARArtworkSetViewController *sut) {
                return sut.fair == fair;
            }]];
            [switchboard routeInternalURL:[[NSURL alloc] initWithString:@"http://artsy.net/artwork/artworkID"] fair:fair];
        });

        it(@"routes genes", ^{
            [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/gene/surrealism" withResponse:@{ @"id" : @"surrealism", @"name" : @"Surrealism" }];
            [[controllerMock expect] pushViewController:[OCMArg checkForClass:[ARGeneViewController class]]];
            [switchboard routeInternalURL:[[NSURL alloc] initWithString:@"http://artsy.net/gene/surrealism"] fair:nil];
        });
    });


    describe(@"routeProfileWithID", ^{
        __block id mockProfileVC;

        before(^{
            mockProfileVC = [OCMockObject mockForClass:[ARProfileViewController class]];
        });

        describe(@"with nil profileID", ^{
            it(@"raises exception", ^{
                expect(^{[switchboard routeProfileWithID:nil];}).to.raise(@"NSInternalInconsistencyException");
            });
        });

        describe(@"with a non-fair profile", ^{
        });

        describe(@"with a fair profile", ^{
            beforeEach(^{
                [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/profile/myfairprofile" withResponse:@{
                                                                                                    @"id" : @"myfairprofile",
                                                                                                    @"owner": @{ @"default_fair_id" : @"armory-show-2013" },
                                                                                                    @"owner_type" : @"FairOrganizer" }];
            });

            it(@"does not load martsy", ^{
                [[mockProfileVC reject] showViewController:[OCMArg checkForClass:[ARInternalMobileWebViewController class]]];
                [switchboard routeProfileWithID:@"myfairprofile"];
            });

            it(@"routes fair profiles specially", ^{
                [[mockProfileVC expect] showViewController:[OCMArg checkForClass:[ARFairViewController class]]];
                [switchboard routeProfileWithID:@"myfairprofile"];
            });
        });
    });
});

SpecEnd;
