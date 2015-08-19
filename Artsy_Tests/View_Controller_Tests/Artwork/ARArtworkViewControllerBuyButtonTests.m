#import "ARArtworkViewController.h"
#import "ARRouter.h"
#import "ARUserManager+Stubs.h"

@interface ARArtworkViewController (Tests)
- (void)tappedBuyButton;
- (void)tappedContactGallery;
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
    });


    it(@"posts order if artwork has no edition sets", ^{
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
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/me/orders" withResponse:@[]];

        [vc tappedBuyButton];
        [routerMock verify];
        [vcMock verify];
    });

    it(@"posts order if artwork has 1 edition set", ^{
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
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/me/orders" withResponse:@[]];

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
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/me/orders" withResponse:@[]];
        
        [vc tappedBuyButton];
        [routerMock verify];
        [vcMock verify];
    });
    
    it(@"displays inquiry form if request fails", ^{
        Artwork *artwork = [Artwork modelWithJSON:@{
            @"id" : @"artwork-id",
            @"title" : @"Artwork Title",
            @"availability" : @"for sale",
            @"acquireable" : @YES,
        }];

        vc = [[ARArtworkViewController alloc] initWithArtwork:artwork fair:nil];
        vcMock = [OCMockObject partialMockForObject:vc];
        [[vcMock expect] tappedContactGallery];
        
        [[[[routerMock expect] andForwardToRealObject] classMethod] newPendingOrderWithArtworkID:OCMOCK_ANY editionSetID:OCMOCK_ANY];
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/me/orders" withResponse:@[] andStatusCode:400];
        
        [vc tappedBuyButton];
        [routerMock verify];
        [vcMock verifyWithDelay:0.3];
    });
});

SpecEnd
