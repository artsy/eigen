#import "ARSwitchBoard.h"
#import "ARSwitchboard+Eigen.h"
#import "AROptions.h"
#import "ARRouter.h"
#import "ArtsyAPI.h"
#import "ArtsyEcho.h"
#import "ArtsyAPI+Profiles.h"
#import "ARTopMenuViewController.h"
#import "ARSerifNavigationViewController.h"

#import "ARProfileViewController.h"
#import "ARBrowseCategoriesViewController.h"
#import <Emission/ARArtworkComponentViewController.h>
#import "ARExternalWebBrowserViewController.h"
#import "ARInternalMobileWebViewController.h"
#import "ARPaymentRequestWebViewController.h"
#import "AREigenInquiryComponentViewController.h"
#import "ARProfileViewController.h"
#import "ARTopMenuNavigationDataSource.h"
#import "ARMutableLinkViewController.h"

#import <Emission/ARInquiryComponentViewController.h>
#import <Emission/ARArtistComponentViewController.h>
#import <Emission/ARFavoritesComponentViewController.h>
#import <Emission/ARBidFlowViewController.h>
#import <Emission/ARShowComponentViewController.h>

#import "Artsy-Swift.h"


@interface ARSwitchBoard (Tests)
- (NSURL *)resolveRelativeUrl:(NSString *)path;
- (id)routeInternalURL:(NSURL *)url fair:(Fair *)fair;
- (void)openURLInExternalService:(NSURL *)url;
- (void)updateRoutes;

@property (nonatomic, strong) Aerodramus *echo;

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
        [switchboard updateRoutes];
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
            expect(resolvedUrl).to.equal(@"https://www.artsy.net/foo/bar");
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

            it(@"routes conditions of sale normally", ^{
                id viewController = [switchboard loadPath:@"/conditions-of-sale"];
                expect([viewController isKindOfClass:[ARMutableLinkViewController class]]).to.beTruthy();
            });

            it(@"routes conditions of sale from Emission in a modal view controller", ^{
                id viewController = [switchboard loadPath:@"/conditions-of-sale?present_modally=true"];
                expect([viewController isKindOfClass:[SerifModalWebNavigationController class]]).to.beTruthy();
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
                [[sharedAppMock reject] openURL:OCMOCK_ANY options:OCMOCK_ANY completionHandler:OCMOCK_ANY];

                NSURL *internalURL = [[NSURL alloc] initWithString:@"mailto:email@mail.com"];
                [switchboard loadURL:internalURL];
                [sharedAppMock verify];
            });
        });

        describe(@"with tel schemed url", ^{
            it(@"opens with the OS for tel schemed links", ^{
                id sharedAppMock = [OCMockObject partialMockForObject:[UIApplication sharedApplication]];
                [[sharedAppMock expect] openURL:OCMOCK_ANY options:OCMOCK_ANY completionHandler:OCMOCK_ANY];

                NSURL *telephoneURL = [[NSURL alloc] initWithString:@"tel:111111"];

                [switchboard loadURL:telephoneURL];
                [sharedAppMock verify];
            });
        });

        it(@"handles breaking out of the eigen routing sandbox when needed", ^{
            id sharedAppMock = [OCMockObject partialMockForObject:[UIApplication sharedApplication]];
            [[sharedAppMock expect] openURL:OCMOCK_ANY options:OCMOCK_ANY completionHandler:OCMOCK_ANY];

            NSURL *internalURL = [[NSURL alloc] initWithString:@"http://mysitethatmustbeopenedinsafari.com?eigen_escape_sandbox=true"];
            [switchboard loadURL:internalURL];
            
            [sharedAppMock verify];
        });

        describe(@"with applewebdata urls", ^{
            it(@"does not load browser", ^{
                NSURL *internalURL = [[NSURL alloc] initWithString:@"applewebdata://EF86F744-3F4F-4732-8A4B-3E5E94D6D7DA/some/path"];
                id sharedAppMock = [OCMockObject partialMockForObject:[UIApplication sharedApplication]];
                [[sharedAppMock reject] openURL:OCMOCK_ANY options:OCMOCK_ANY completionHandler:OCMOCK_ANY];
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

        it(@"loads internal webviews for trusted but unpredictable hosts", ^{
            NSURL *internalButUnpredictableURL = [[NSURL alloc] initWithString:@"https://asdasdasdasdas-staging.artsy.net/54c7e8fa7261692b5acd0600"];
            id viewController = [switchboard loadURL:internalButUnpredictableURL];
            expect(viewController).to.beKindOf(ARInternalMobileWebViewController.class);
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
        
        it(@"loads a payment request web view for lewitt-web URLs", ^{
            NSURL *paymentRequestURL = [NSURL URLWithString:@"http://invoicing-demo-partner.lewitt-web-public-staging.artsy.net/invoices/42/gUsxioLRJQaBunE73cWMwjfv"];
            ARPaymentRequestWebViewController *controller = (ARPaymentRequestWebViewController *)[(UINavigationController *)[switchboard loadURL:paymentRequestURL] topViewController];
            expect(controller).to.beKindOf(ARPaymentRequestWebViewController.class);
            expect(controller.initialURL).to.equal(paymentRequestURL);
        });
    });

    describe(@"adding a new route", ^{
        it(@"supports adding via the register method", ^{
            UIViewController *newVC = [[UIViewController alloc] init];
            id subject = [switchboard loadPath:@"thingy"];
            // Yeah, so, we have this awkward catch-all profile class for any route
            // thus if the route isn't registered, it'll go to that
            expect(subject).to.beAKindOf(ARMutableLinkViewController.class);
            [switchboard registerPathCallbackAtPath:@"/thingy" callback:^id _Nullable(NSDictionary * _Nullable parameters) {
                return newVC;
            }];
            expect([switchboard loadPath:@"thingy"]).to.equal(newVC);
        });
    });

    describe(@"adding a new domain", ^{
        it(@"supports adding via the register method", ^{
            UIViewController *newVC = [[UIViewController alloc] init];
            [switchboard registerPathCallbackForDomain:@"orta.artsy.net" callback:^id _Nullable(NSURL * _Nonnull url) {
                return newVC;
            }];

            expect([switchboard loadURL:[NSURL URLWithString:@"https://orta.artsy.net/me/thing"]]).to.equal(newVC);
        });

        it(@"sends the URL in to the callback for the URL routing", ^{
            UIViewController *newVC = [[UIViewController alloc] init];
            __block NSString *path = nil;
            [switchboard registerPathCallbackForDomain:@"orta.artsy.net" callback:^id _Nullable(NSURL * _Nonnull url) {
                path = url.path;
                return newVC;
            }];

            [switchboard loadURL:[NSURL URLWithString:@"https://orta.artsy.net/me/thing"]];
            expect(path).to.equal(@"/me/thing");
        });
    });

    describe(@"routeInternalURL", ^{
        it(@"routes profiles", ^{
            // See aditional tests for profile routing below.
            NSURL *profileURL = [[NSURL alloc] initWithString:@"http://artsy.net/myprofile"];
            id subject = [switchboard routeInternalURL:profileURL fair:nil];
            expect(subject).to.beKindOf(ARMutableLinkViewController.class);

        });

        it(@"routes artists", ^{
            id subject = [switchboard routeInternalURL:[[NSURL alloc] initWithString:@"http://artsy.net/artist/artistname"] fair:nil];
            expect(subject).to.beKindOf(ARArtistComponentViewController.class);
        });

        it(@"routes artists in a gallery context on iPad", ^{
            [ARTestContext useDevice:ARDeviceTypePad :^{
                // Now we're in a different context, need to recreate switchboard
                switchboard = [[ARSwitchBoard alloc] init];
                [switchboard updateRoutes];

                id viewController = [switchboard routeInternalURL:[[NSURL alloc] initWithString:@"http://artsy.net/some-gallery/artist/artistname"] fair:nil];
                expect(viewController).to.beKindOf(ARArtistComponentViewController.class);
            }];
        });

        it(@"does not route artists in a gallery context on iPhone", ^{
            [ARTestContext useDevice:ARDeviceTypePhone5 :^{
                switchboard = [[ARSwitchBoard alloc] init];
                id viewController = [switchboard routeInternalURL:[[NSURL alloc] initWithString:@"http://artsy.net/some-gallery/artist/artistname"] fair:nil];
                expect(viewController).to.beKindOf([ARInternalMobileWebViewController class]);
            }];
        });

        describe(@"BNMO URLs", ^{
            it(@"routes as a modal", ^{
                id subject = [switchboard routeInternalURL:[[NSURL alloc] initWithString:@"/orders/some-order-id"] fair:nil];
                expect(subject).to.beKindOf(ARSerifNavigationViewController.class);
            });

            it(@"routes as an internal web view", ^{
                id subject = [switchboard routeInternalURL:[[NSURL alloc] initWithString:@"/orders/some-order-id"] fair:nil];
                id topViewController = [subject topViewController];
                expect(topViewController).to.beKindOf(ARInternalMobileWebViewController.class);
                expect([[topViewController initialURL] path]).to.equal(@"/orders/some-order-id");
            });
        });

        describe(@"inquiry URLs", ^{
            it(@"routes as a modal", ^{
                id subject = [switchboard routeInternalURL:[[NSURL alloc] initWithString:@"/inquiry/some-artwork-id"] fair:nil];
                expect(subject).to.beKindOf(ARNavigationController.class);
            });

            it(@"routes as an inquiry component view controller", ^{
                id subject = [switchboard routeInternalURL:[[NSURL alloc] initWithString:@"/inquiry/some-artwork-id"] fair:nil];
                expect([subject topViewController]).to.beKindOf(AREigenInquiryComponentViewController.class);
                expect([(AREigenInquiryComponentViewController *)[subject topViewController] artworkID]).to.equal(@"some-artwork-id");
            });
        });

        it(@"routes shows", ^{
            id viewController = [switchboard routeInternalURL:[[NSURL alloc] initWithString:@"http://artsy.net/show/show-id"] fair:nil];
            expect(viewController).to.beKindOf(ARShowComponentViewController.class);
        });

        context(@"fairs", ^{

            context(@"on iphone", ^{
                before(^{
                    [ARTestContext stubDevice:ARDeviceTypePhone5];
                    switchboard = [[ARSwitchBoard alloc] init];
                    [switchboard updateRoutes];
                });

                after(^{
                    [ARTestContext stopStubbing];
                });

                it(@"forwards fair views to martsy for non-native views", ^{
                    Fair *fair = [OCMockObject mockForClass:[Fair class]];
                    ARInternalMobileWebViewController *viewController = [switchboard routeInternalURL:[[NSURL alloc] initWithString:@"/the-armory-show/browse/artists"] fair:fair];
                    expect(viewController.fair).to.equal(fair);
                    expect(viewController).to.beKindOf(ARInternalMobileWebViewController.class);
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

                    ARInternalMobileWebViewController *viewController = [switchboard routeInternalURL:[[NSURL alloc] initWithString:@"http://artsy.net/fair-id/for-you"] fair:fair];
                    expect(viewController).to.beKindOf([ARInternalMobileWebViewController class]);
                    expect(viewController.fair).to.equal(fair);
                });

                it(@"doesn't route fair artists", ^{
                    Fair *fair = [OCMockObject mockForClass:[Fair class]];

                    ARInternalMobileWebViewController *viewController = [switchboard routeInternalURL:[[NSURL alloc] initWithString:@"/the-armory-show/browse/artist/artist-id"] fair:fair];
                    expect(viewController).to.beKindOf([ARInternalMobileWebViewController class]);
                    expect(viewController.fair).to.equal(fair);
                });
            });
        });

        it(@"routes artworks", ^{
            id subject = [switchboard routeInternalURL:[NSURL URLWithString:@"http://artsy.net/artwork/artworkID"] fair:nil];
            expect(subject).to.beKindOf(ARArtworkComponentViewController.class);
        });

        it(@"routes genes", ^{
            id subject = [switchboard routeInternalURL:[NSURL URLWithString:@"http://artsy.net/gene/surrealism"] fair:nil];
            NSString *classString = NSStringFromClass([subject class]);
            expect(classString).to.contain(@"ARGeneComponent");
        });

        it(@"routes auctions", ^{
            switchboard = [[ARSwitchBoard alloc] init];
            [switchboard updateRoutes];

            id subject = [switchboard loadPath:@"/auction/myauctionthing"];
            NSString *classString = NSStringFromClass([subject class]);
            expect(classString).to.contain(@"AuctionViewController");
        });

        it(@"routes live auctions", ^{
            [AROptions setBool:NO forOption:AROptionsDisableNativeLiveAuctions];
            switchboard = [[ARSwitchBoard alloc] init];
            [switchboard updateRoutes];

            id subject = [switchboard loadURL:[NSURL URLWithString:@"https://live.artsy.net/live_auction"]];
            NSString *classString = NSStringFromClass([subject class]);
            expect(classString).to.contain(@"LiveAuctionViewController");
        });

        it(@"routes live auctions to web when disabled live is set", ^{
            [AROptions setBool:YES forOption:AROptionsDisableNativeLiveAuctions];

            switchboard = [[ARSwitchBoard alloc] init];
            [switchboard updateRoutes];

            id subject = [switchboard loadURL:[NSURL URLWithString:@"https://live.artsy.net/live_auction"]];
            NSString *classString = NSStringFromClass([subject class]);
            expect(classString).to.contain(@"SerifModalWeb");
        });

        it(@"only sets up its echo instance once", ^{
            switchboard = [[ARSwitchBoard alloc] init];
            id echoMock = [OCMockObject partialMockForObject:switchboard.echo];
            [[echoMock expect] checkForUpdates:OCMOCK_ANY];

            [switchboard updateRoutes];

            [echoMock verify];

            [[echoMock reject] checkForUpdates:OCMOCK_ANY];
            [switchboard updateRoutes];
        });

        it(@"falls back to web views when websocket becomes outdated", ^{
            switchboard = [[ARSwitchBoard alloc] init];
            id echoMock = [OCMockObject partialMockForObject:switchboard.echo];
            [[[echoMock stub] andReturn:@{@"LiveAuctionsCurrentWebSocketVersion": [[Message alloc] initWithName:@"LiveAuctionsCurrentWebSocketVersion" content:@"1000000"]}] messages]; // A really big version we won't actually hit for... a while.
            [switchboard updateRoutes];

            id subject = [switchboard loadURL:[NSURL URLWithString:@"https://live.artsy.net/live_auction"]];

            NSString *classString = NSStringFromClass([subject class]);
            expect(classString).toNot.contain(@"LiveAuctionViewController");
        });

        it(@"can not route to native auctions when echo has a feature called 'DisableNativeAuctions'", ^{
            switchboard = [[ARSwitchBoard alloc] init];
            [switchboard updateRoutes];
            ArtsyEcho *echo = [[ArtsyEcho alloc] init];
            echo.features = @{ @"DisableNativeAuctions" : [[Feature alloc] initWithName:@"" state:@1] };
            switchboard.echo = echo;

            id subject = [switchboard loadPath:@"/auction/myauctionthing"];
            NSString *classString = NSStringFromClass([subject class]);
            expect(classString).toNot.contain(@"AuctionViewController");
        });

        it(@"defaults to the new bid flow", ^{
            switchboard = [[ARSwitchBoard alloc] init];
            [switchboard updateRoutes];

            ARSerifNavigationViewController *subjectNav = (id)[switchboard loadPath:@"/auction-registration/the-sale"];
            ARBidFlowViewController *subject = (id)subjectNav.topViewController;

            expect(subject.saleID).to.equal(@"the-sale");
        });

        it(@"falls back to force bid registration when skip_bid_flow=true", ^{
            switchboard = [[ARSwitchBoard alloc] init];
            [switchboard updateRoutes];

            id subject = [switchboard loadPath:@"/auction-registration/the-sale?skip_bid_flow=true"];

            expect(NSStringFromClass([subject class])).to.equal(@"ARAuctionWebViewController");
        });
    });

    describe(@"loadProfileWithIDileWithID", ^{
        __block id mockProfileVC;

        before(^{
            mockProfileVC = [OCMockObject mockForClass:[ARProfileViewController class]];
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

            it(@"internally does not load martsy", ^{
                [[mockProfileVC reject] showViewController:[OCMArg checkForClass:[ARInternalMobileWebViewController class]]];
                [switchboard loadPartnerWithID:@"myfairprofile"];
            });

//            it(@"routes fair profiles specially", ^{
//                [[mockProfileVC expect] showViewController:[OCMArg checkForClass:[ARFairViewController class]]];
//                [switchboard loadPartnerWithID:@"myfairprofile"];
//            });
        });
    });
});

SpecEnd;
