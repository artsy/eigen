#import "ARArtworkViewController.h"
#import "ARRouter.h"
#import "ArtsyEcho.h"
#import "ARUserManager+Stubs.h"
#import "ARNetworkConstants.h"


@interface ARArtworkViewController (Tests)
- (void)tappedBuyButton;
- (void)tappedContactGallery;
- (void)presentErrorMessage:(NSString *)errorMessage;
@property (nonatomic, strong, readwrite) ArtsyEcho *echo;
@end

SpecBegin(ARArtworkViewControllerBuyButton);

__block ARArtworkViewController *vc;

describe(@"buy button", ^{
    __block id routerMock;
    __block id vcMock;
    before(^{
        routerMock = [OCMockObject mockForClass:[ARRouter class]];
    });

    after(^{
        [routerMock stopMocking];
        [vcMock stopMocking];
    });

    beforeEach(^{
        [ARUserManager stubAndLoginWithUsername];
    });

    afterEach(^{
        [ARUserManager clearUserData];
        [OHHTTPStubs removeAllStubs];
    });

    describe(@"buy now flow", ^{
        it(@"calls mutation and directs to force on success", ^{
            [OHHTTPStubs stubJSONResponseAtPath:@"" withResponse:
             @{ @"data":
                    @{ @"ecommerceCreateOrderWithArtwork":
                           @{ @"orderOrError":
                                  @{ @"order":
                                         @{ @"id": @"order-id" }
                                     }
                              }
                       }
                }];

            Artwork *artwork = [Artwork modelWithJSON:@{
                                                        @"id" : @"artwork-id",
                                                        @"_id": @"0123456789abcdef",
                                                        @"title" : @"Artwork Title",
                                                        @"availability" : @"for sale",
                                                        @"acquireable" : @YES
                                                        }];
            vc = [[ARArtworkViewController alloc] initWithArtwork:artwork fair:nil];
            ArtsyEcho *echo = [[ArtsyEcho alloc] init];
            echo.features = @{ @"AREnableBuyNowFlow" : [[Feature alloc] initWithName:@"" state:@1] };
            echo.routes = @{ @"ARBuyNowRoute": [[Route alloc] initWithName:@"" path:@"/orders/:id"] };
            vc.echo = echo;
            vcMock = [OCMockObject partialMockForObject:vc];
            [[vcMock reject] tappedContactGallery];
            [[vcMock expect] presentViewController:OCMOCK_ANY animated:YES completion:nil];
            id switchboardMock = [OCMockObject partialMockForObject:ARSwitchBoard.sharedInstance];
            [[[switchboardMock expect] andReturn:[UIViewController new]] loadPath:@"/orders/order-id"];

            [[[[routerMock expect] andForwardToRealObject] classMethod] newBuyNowRequestWithArtworkID:@"0123456789abcdef"];

            [vc tappedBuyButton];

            [routerMock verify];
            [vcMock verify];
            [switchboardMock verify];
            [switchboardMock stopMocking];
        });

        it(@"presents error when mutation network request itself fails", ^{
            [OHHTTPStubs stubRequestsPassingTest:^BOOL(NSURLRequest *request) {
                return [request.URL.host containsString:@"metaphysics"];
            } withStubResponse:^OHHTTPStubsResponse *(NSURLRequest *request) {
                return [OHHTTPStubsResponse responseWithError:[NSError errorWithDomain:NSCocoaErrorDomain code:0 userInfo:nil]];
            }];

            Artwork *artwork = [Artwork modelWithJSON:@{
                                                        @"id" : @"artwork-id",
                                                        @"_id": @"0123456789abcdef",
                                                        @"title" : @"Artwork Title",
                                                        @"availability" : @"for sale",
                                                        @"acquireable" : @YES
                                                        }];
            vc = [[ARArtworkViewController alloc] initWithArtwork:artwork fair:nil];
            ArtsyEcho *echo = [[ArtsyEcho alloc] init];
            echo.features = @{ @"AREnableBuyNowFlow" : [[Feature alloc] initWithName:@"" state:@1] };
            vc.echo = echo;
            vcMock = [OCMockObject partialMockForObject:vc];
            [[vcMock expect] presentErrorMessage:OCMOCK_ANY];

            [[[[routerMock expect] andForwardToRealObject] classMethod] newBuyNowRequestWithArtworkID:@"0123456789abcdef"];

            [vc tappedBuyButton];

            [routerMock verify];
            [vcMock verify];
        });

        it(@"presents error when mutation fails on metaphysics", ^{
            [OHHTTPStubs stubJSONResponseAtPath:@"" withResponse:
             @{ @"data":
                    @{ @"ecommerceCreateOrderWithArtwork":
                           @{ @"orderOrError": @{} // no order data in response
                              }
                       }
                }];

            Artwork *artwork = [Artwork modelWithJSON:@{
                                                        @"id" : @"artwork-id",
                                                        @"_id": @"0123456789abcdef",
                                                        @"title" : @"Artwork Title",
                                                        @"availability" : @"for sale",
                                                        @"acquireable" : @YES
                                                        }];
            vc = [[ARArtworkViewController alloc] initWithArtwork:artwork fair:nil];
            ArtsyEcho *echo = [[ArtsyEcho alloc] init];
            echo.features = @{ @"AREnableBuyNowFlow" : [[Feature alloc] initWithName:@"" state:@1] };
            vc.echo = echo;
            vcMock = [OCMockObject partialMockForObject:vc];
            [[vcMock expect] presentErrorMessage:OCMOCK_ANY];

            [[[[routerMock expect] andForwardToRealObject] classMethod] newBuyNowRequestWithArtworkID:@"0123456789abcdef"];

            [vc tappedBuyButton];

            [routerMock verify];
            [vcMock verify];
        });
    });

    describe(@"old ecommerce flow", ^{
        it(@"posts order if artwork has no edition sets", ^{
            [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/me/order/pending/items" withResponse:@{}];

            Artwork *artwork = [Artwork modelWithJSON:@{
                @"id" : @"artwork-id",
                @"title" : @"Artwork Title",
                @"availability" : @"for sale",
                @"acquireable" : @YES
            }];
            vc = [[ARArtworkViewController alloc] initWithArtwork:artwork fair:nil];
            vcMock = [OCMockObject partialMockForObject:vc];
            [[vcMock reject] tappedContactGallery];

            [[[[routerMock expect] andForwardToRealObject] classMethod] newPendingOrderWithArtworkID:@"artwork-id" editionSetID:[OCMArg isNil]];

            [vc tappedBuyButton];
            [routerMock verify];
            [vcMock verify];
        });

        it(@"posts order if artwork has 1 edition set", ^{
            [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/me/order/pending/items" withResponse:@{}];
            Artwork *artwork = [Artwork modelWithJSON:@{
                @"id" : @"artwork-id",
                @"title" : @"Artwork Title",
                @"availability" : @"for sale",
                @"acquireable" : @YES,
                @"edition_sets" : @[
                    @{ @"id": @"set-1"}
                ]
            }];

            vc = [[ARArtworkViewController alloc] initWithArtwork:artwork fair:nil];
            vcMock = [OCMockObject partialMockForObject:vc];
            [[vcMock reject] tappedContactGallery];

            [[[[routerMock expect] andForwardToRealObject] classMethod] newPendingOrderWithArtworkID:@"artwork-id" editionSetID:@"set-1"];

            [vc tappedBuyButton];
            [routerMock verify];
            [vcMock verify];
        });

        it(@"displays inquiry form if artwork has multiple sets", ^{
            Artwork *artwork = [Artwork modelWithJSON:@{
                @"id" : @"artwork-id",
                @"title" : @"Artwork Title",
                @"availability" : @"for sale",
                @"acquireable" : @YES,
                @"edition_sets" : @[
                    @{ @"id": @"set-1"},
                    @{ @"id": @"set-2"}
                ]
            }];

            vc = [[ARArtworkViewController alloc] initWithArtwork:artwork fair:nil];
            vcMock = [OCMockObject partialMockForObject:vc];
            [[vcMock expect] tappedContactGallery];

            [[[routerMock reject] classMethod] newPendingOrderWithArtworkID:OCMOCK_ANY editionSetID:OCMOCK_ANY];

            [vc tappedBuyButton];
            [routerMock verify];
            [vcMock verify];
        });

        it(@"displays inquiry form if request fails", ^{
            [OHHTTPStubs stubJSONResponseAtPath:ARCreatePendingOrderURL withResponse:@[] andStatusCode:400];

            Artwork *artwork = [Artwork modelWithJSON:@{
                @"id" : @"artwork-id",
                @"_id": @"0123456789abcdef",
                @"title" : @"Artwork Title",
                @"availability" : @"for sale",
                @"acquireable" : @YES,
            }];

            vc = [[ARArtworkViewController alloc] initWithArtwork:artwork fair:nil];
            vcMock = [OCMockObject partialMockForObject:vc];
            [[vcMock expect] tappedContactGallery];

            [[[[routerMock expect] andForwardToRealObject] classMethod] newPendingOrderWithArtworkID:OCMOCK_ANY editionSetID:OCMOCK_ANY];

            [vc tappedBuyButton];
            [routerMock verify];
            [vcMock verify];
        });
    });
});

SpecEnd;
