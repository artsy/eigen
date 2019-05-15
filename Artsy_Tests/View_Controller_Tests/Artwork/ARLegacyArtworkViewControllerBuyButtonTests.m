#import "ARLegacyArtworkViewController.h"
#import "ARRouter.h"
#import "ArtsyEcho.h"
#import "ARUserManager+Stubs.h"
#import "ARNetworkConstants.h"


@interface ARLegacyArtworkViewController (Tests)
- (void)tappedBuyButton;
- (void)tappedMakeOfferButton;
- (void)tappedContactGallery;
- (void)presentErrorMessage:(NSString *)errorMessage;
@property (nonatomic, strong, readwrite) ArtsyEcho *echo;
@end

SpecBegin(ARLegacyArtworkViewControllerBuyButton);

__block ARLegacyArtworkViewController *vc;

describe(@"buy button", ^{
    __block id routerMock;
    __block id vcMock;
    __block ArtsyEcho *echo;

    before(^{
        routerMock = [OCMockObject mockForClass:[ARRouter class]];
        echo = [[ArtsyEcho alloc] init];
        echo.features = @{ @"AREnableMakeOfferFlow" : [[Feature alloc] initWithName:@"" state:@(1)] };
        echo.routes = @{ @"ARBuyNowRoute": [[Route alloc] initWithName:@"" path:@"/order/:id"] };
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
        __block Artwork *artwork;
        beforeEach(^{
            artwork = [Artwork modelWithJSON:@{
                                               @"id" : @"artwork-id",
                                               @"_id": @"0123456789abcdef",
                                               @"title" : @"Artwork Title",
                                               @"availability" : @"for sale",
                                               @"acquireable" : @YES
                                               }];
        });

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
            vc = [[ARLegacyArtworkViewController alloc] initWithArtwork:artwork fair:nil];
            vc.echo = echo;
            vcMock = [OCMockObject partialMockForObject:vc];
            [[vcMock reject] tappedContactGallery];
            [[vcMock expect] presentViewController:OCMOCK_ANY animated:YES completion:nil];
            id switchboardMock = [OCMockObject partialMockForObject:ARSwitchBoard.sharedInstance];
            [[[switchboardMock expect] andReturn:[UIViewController new]] loadPath:@"/order/order-id"];

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
            vc = [[ARLegacyArtworkViewController alloc] initWithArtwork:artwork fair:nil];
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
            vc = [[ARLegacyArtworkViewController alloc] initWithArtwork:artwork fair:nil];
            vc.echo = echo;
            vcMock = [OCMockObject partialMockForObject:vc];
            [[vcMock expect] presentErrorMessage:OCMOCK_ANY];

            [[[[routerMock expect] andForwardToRealObject] classMethod] newBuyNowRequestWithArtworkID:@"0123456789abcdef"];

            [vc tappedBuyButton];

            [routerMock verify];
            [vcMock verify];
        });
    });

    describe(@"make offer flow", ^{
        __block Artwork *artwork;
        beforeEach(^{
            artwork = [Artwork modelWithJSON:@{
                                                @"id": @"artwork-id",
                                                @"_id": @"0123456789abcdef",
                                                @"title": @"Artwork Title",
                                                @"availability": @"for sale",
                                                @"acquireable": @(YES),
                                                @"offerable": @(YES)
                                                }];
        });

        it(@"calls mutation and directs to force on success", ^{
            [OHHTTPStubs stubJSONResponseAtPath:@"" withResponse:
             @{ @"data":
                    @{ @"ecommerceCreateOfferOrderWithArtwork":
                           @{ @"orderOrError":
                                  @{ @"order":
                                         @{ @"id": @"order-id" }
                                     }
                              }
                       }
                }];
            vc = [[ARLegacyArtworkViewController alloc] initWithArtwork:artwork fair:nil];
            vc.echo = echo;
            vcMock = [OCMockObject partialMockForObject:vc];
            [[vcMock expect] presentViewController:OCMOCK_ANY animated:YES completion:nil];
            id switchboardMock = [OCMockObject partialMockForObject:ARSwitchBoard.sharedInstance];
            [[[switchboardMock expect] andReturn:[UIViewController new]] loadPath:@"/order/order-id"];

            [[[[routerMock expect] andForwardToRealObject] classMethod] newOfferRequestWithArtworkID:@"0123456789abcdef"];

            [vc tappedMakeOfferButton];

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
            vc = [[ARLegacyArtworkViewController alloc] initWithArtwork:artwork fair:nil];
            vc.echo = echo;
            vcMock = [OCMockObject partialMockForObject:vc];
            [[vcMock expect] presentErrorMessage:OCMOCK_ANY];

            [[[[routerMock expect] andForwardToRealObject] classMethod] newOfferRequestWithArtworkID:@"0123456789abcdef"];

            [vc tappedMakeOfferButton];

            [routerMock verify];
            [vcMock verify];
        });

        it(@"presents error when mutation fails on metaphysics", ^{
            [OHHTTPStubs stubJSONResponseAtPath:@"" withResponse:
             @{ @"data":
                    @{ @"ecommerceCreateOfferOrderWithArtwork":
                           @{ @"orderOrError": @{} // no order data in response
                              }
                       }
                }];
            vc = [[ARLegacyArtworkViewController alloc] initWithArtwork:artwork fair:nil];
            vc.echo = echo;
            vcMock = [OCMockObject partialMockForObject:vc];
            [[vcMock expect] presentErrorMessage:OCMOCK_ANY];

            [[[[routerMock expect] andForwardToRealObject] classMethod] newOfferRequestWithArtworkID:@"0123456789abcdef"];

            [vc tappedMakeOfferButton];

            [routerMock verify];
            [vcMock verify];
        });
    });
});
SpecEnd;
