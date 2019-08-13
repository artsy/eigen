#import "Artwork.h"
#import "ARArtworkViewController.h"
#import "Aerodramus.h"
#import "ArtsyEcho.h"
#import "ARLegacyArtworkViewController.h"
#import <Emission/ARArtworkComponentViewController.h>


@interface ARArtworkViewController (Testing)
@property (strong, nonatomic) Aerodramus *echo;
@end

@interface _ARLegacyArtworkViewControllerMock : UIViewController
@end


@implementation _ARLegacyArtworkViewControllerMock
- (void)setHasFinishedScrolling {}
@end


@interface _ARArtworkComponentViewControllerMock : UIViewController
@end


@implementation _ARArtworkComponentViewControllerMock
@end

static void
StubArtworkWithAvailability(NSString *availability)
{
    NSDictionary *response = @{
        @"data" : @{
            @"artwork" : @{
                @"id" : @"some-artwork",
                @"title" : @"Some Title",
                @"availability" : availability
            }
        }
    };
    [OHHTTPStubs stubJSONResponseForHost:@"metaphysics-staging.artsy.net" withResponse:response];
}

static void
StubArtworkWithBNMO(BOOL buyable, BOOL offerable)
{
    NSDictionary *response = @{
        @"data" : @{
            @"artwork" : @{
                @"id" : @"some-artwork",
                @"title" : @"Some Title",
                @"availability" : @"for sale",
                @"is_acquireable": @(buyable),
                @"is_offerable": @(offerable)
            }
        }
    };
    [OHHTTPStubs stubJSONResponseForHost:@"metaphysics-staging.artsy.net" withResponse:response];
}

static void
StubArtworkWithSaleArtwork()
{
    NSDictionary *response = @{
        @"data" : @{
            @"artwork" : @{
                @"id" : @"some-artwork",
                @"title" : @"Some Title",
                @"availability" : @"for sale",
                @"is_in_auction": @(YES)
            }
        }
    };
    [OHHTTPStubs stubJSONResponseForHost:@"metaphysics-staging.artsy.net" withResponse:response];
}

static void
StubArtworkWithAvailabilityAndInquireability(NSString *availability, NSNumber *inquireability)
{
    NSDictionary *response = @{
        @"data" : @{
            @"artwork" : @{
                @"id" : @"some-artwork",
                @"title" : @"Some Title",
                @"availability" : availability,
                @"is_inquireable" : inquireability
            }
        }
    };
    [OHHTTPStubs stubJSONResponseForHost:@"metaphysics-staging.artsy.net" withResponse:response];
}

SpecBegin(ARArtworkViewController);

describe(@"ARArtworkViewController", ^{
    NSArray *legacyAvailabilityStates = @[@"for sale"];
    NSArray *componentAvailabilityStates = @[@"not for sale", @"on loan", @"permanent collection", @"sold", @"on hold"];

    __block Artwork *artwork = nil;
    __block ARArtworkViewController *vc = nil;

    __block id mockLegacyVCClass = nil;
    __block _ARLegacyArtworkViewControllerMock *mockLegacyVC = nil;

    __block id mockComponentVCClass = nil;
    __block _ARArtworkComponentViewControllerMock *mockComponentVC = nil;

    __block Aerodramus *echo = nil;

    beforeEach(^{
        artwork = [[Artwork alloc] initWithArtworkID:@"some-artwork"];

        mockLegacyVC = [_ARLegacyArtworkViewControllerMock new];
        mockLegacyVCClass = [OCMockObject mockForClass:ARLegacyArtworkViewController.class];
        (void)[[[mockLegacyVCClass stub] andReturn:mockLegacyVCClass] alloc];
        (void)[[[mockLegacyVCClass stub] andReturn:mockLegacyVC] initWithArtwork:artwork fair:OCMOCK_ANY];

        mockComponentVC = [_ARArtworkComponentViewControllerMock new];
        mockComponentVCClass = [OCMockObject mockForClass:ARArtworkComponentViewController.class];
        (void)[[[mockComponentVCClass stub] andReturn:mockComponentVCClass] alloc];
        (void)[[[mockComponentVCClass stub] andReturn:mockComponentVC] initWithArtworkID:artwork.artworkID];

        echo = [[ArtsyEcho alloc] init];
        echo.features = @{
            @"ARReactNativeArtworkEnableNSOInquiry" : [[Feature alloc] initWithName:@"" state:@(NO)]
        };

        vc = [[ARArtworkViewController alloc] initWithArtwork:artwork fair:nil];
        vc.echo = echo;

        // Reset all options to default states
        [AROptions setBool:NO forOption:AROptionsRNArtworkNonCommerical];
        [AROptions setBool:NO forOption:AROptionsRNArtworkNSOInquiry];
        [AROptions setBool:NO forOption:AROptionsRNArtworkAuctions];
        [AROptions setBool:NO forOption:AROptionsRNArtworkAlways];
    });

    afterEach(^{
        [mockLegacyVCClass stopMocking];
        [mockComponentVCClass stopMocking];
    });

    describe(@"concerning artworks for which to show the legacy view", ^{
        for (NSString *availability in legacyAvailabilityStates) {
            it([NSString stringWithFormat:@"shows it with a `%@` artwork", availability], ^{
                StubArtworkWithAvailability(availability);
                (void)vc.view;
                expect(vc.childViewControllers[0]).to.equal(mockLegacyVC);
            });
        }

        describe(@"when inquireable", ^{
            for (NSString *availability in componentAvailabilityStates) {
                it([NSString stringWithFormat:@"shows it with a `%@` artwork", availability], ^{
                    StubArtworkWithAvailabilityAndInquireability(availability, @(YES));
                    (void)vc.view;
                    expect(vc.childViewControllers[0]).to.equal(mockLegacyVC);
                });
            }
        });

        describe(@"NSO/inquiry artworks", ^{
            it(@"works with buy-nowable artworks", ^{
                StubArtworkWithBNMO(YES, NO);
                (void)vc.view;
                expect(vc.childViewControllers[0]).to.equal(mockLegacyVC);
            });

            it(@"works with make-offerable artworks", ^{
                StubArtworkWithBNMO(NO, YES);
                (void)vc.view;
                expect(vc.childViewControllers[0]).to.equal(mockLegacyVC);
            });
        });

        it(@"works artworks that are in a sale", ^{
            StubArtworkWithSaleArtwork();
            (void)vc.view;
            expect(vc.childViewControllers[0]).to.equal(mockLegacyVC);
        });
    });

    describe(@"concerning artworks for which to show the new component view", ^{
        describe(@"noncommerical artworks", ^{
            describe(@"enabled through debug options", ^{
                beforeEach(^{
                    [AROptions setBool:YES forOption:AROptionsRNArtworkNonCommerical];
                });

                for (NSString *availability in componentAvailabilityStates) {
                    it([NSString stringWithFormat:@"shows it with a `%@` artwork", availability], ^{
                        StubArtworkWithAvailability(availability);
                        (void)vc.view;
                        expect(vc.childViewControllers[0]).to.equal(mockComponentVC);
                    });
                }
            });

            describe(@"enabled through echo", ^{
                beforeEach(^{
                    echo.features = @{
                        @"ARReactNativeArtworkEnableNonCommercial" : [[Feature alloc] initWithName:@"" state:@(YES)]
                    };
                });

                for (NSString *availability in componentAvailabilityStates) {
                    it([NSString stringWithFormat:@"shows it with a `%@` artwork", availability], ^{
                        StubArtworkWithAvailability(availability);
                        (void)vc.view;
                        expect(vc.childViewControllers[0]).to.equal(mockComponentVC);
                    });
                }
            });
        });

        describe(@"NSO/inquiry artworks", ^{
            describe(@"enabled through debug options", ^{
                beforeEach(^{
                    [AROptions setBool:YES forOption:AROptionsRNArtworkNSOInquiry];
                });

                it(@"works with buy-nowable artworks", ^{
                    StubArtworkWithBNMO(YES, NO);
                    (void)vc.view;
                    expect(vc.childViewControllers[0]).to.equal(mockComponentVC);
                });

                it(@"works with make-offerable artworks", ^{
                    StubArtworkWithBNMO(NO, YES);
                    (void)vc.view;
                    expect(vc.childViewControllers[0]).to.equal(mockComponentVC);
                });
            });

            describe(@"enabled through echo", ^{
                beforeEach(^{
                    echo.features = @{
                        @"ARReactNativeArtworkEnableNSOInquiry" : [[Feature alloc] initWithName:@"" state:@(YES)]
                    };
                });

                it(@"works with buy-nowable artworks", ^{
                    StubArtworkWithBNMO(YES, NO);
                    (void)vc.view;
                    expect(vc.childViewControllers[0]).to.equal(mockComponentVC);
                });

                it(@"works with make-offerable artworks", ^{
                    StubArtworkWithBNMO(NO, YES);
                    (void)vc.view;
                    expect(vc.childViewControllers[0]).to.equal(mockComponentVC);
                });
            });
        });

        describe(@"auctions artworks", ^{
            describe(@"enabled through debug options", ^{
                beforeEach(^{
                    [AROptions setBool:YES forOption:AROptionsRNArtworkAuctions];
                });

                it(@"works artworks that are in a sale", ^{
                    StubArtworkWithSaleArtwork();
                    (void)vc.view;
                    expect(vc.childViewControllers[0]).to.equal(mockComponentVC);
                });
            });

            describe(@"enabled through echo", ^{
                beforeEach(^{
                    echo.features = @{
                        @"ARReactNativeArtworkEnableAuctions" : [[Feature alloc] initWithName:@"" state:@(YES)]
                    };
                });

                it(@"works artworks that are in a sale", ^{
                    StubArtworkWithSaleArtwork();
                    (void)vc.view;
                    expect(vc.childViewControllers[0]).to.equal(mockComponentVC);
                });
            });
        });

        describe(@"when all artworks lab option is enabled", ^{
            beforeEach(^{
                [AROptions setBool:YES forOption:AROptionsRNArtworkAlways];
            });

            for (NSString *availability in componentAvailabilityStates) {
                it([NSString stringWithFormat:@"shows it with a `%@` artwork", availability], ^{
                    StubArtworkWithAvailability(availability);
                    (void)vc.view;
                    expect(vc.childViewControllers[0]).to.equal(mockComponentVC);
                });
            }

            it(@"works with buy-nowable artworks", ^{
                StubArtworkWithBNMO(YES, NO);
                (void)vc.view;
                expect(vc.childViewControllers[0]).to.equal(mockComponentVC);
            });

            it(@"works with make-offerable artworks", ^{
                StubArtworkWithBNMO(NO, YES);
                (void)vc.view;
                expect(vc.childViewControllers[0]).to.equal(mockComponentVC);
            });

            it(@"works artworks that are in a sale", ^{
                StubArtworkWithSaleArtwork();
                (void)vc.view;
                expect(vc.childViewControllers[0]).to.equal(mockComponentVC);
            });
        });

        describe(@"when all artworks echo option is enabled", ^{
            beforeEach(^{
                echo.features = @{
                    @"ARReactNativeArtworkEnableAlways" : [[Feature alloc] initWithName:@"" state:@(YES)]
                };
            });

            for (NSString *availability in componentAvailabilityStates) {
                it([NSString stringWithFormat:@"shows it with a `%@` artwork", availability], ^{
                    StubArtworkWithAvailability(availability);
                    (void)vc.view;
                    expect(vc.childViewControllers[0]).to.equal(mockComponentVC);
                });
            }

            it(@"works with buy-nowable artworks", ^{
                StubArtworkWithBNMO(YES, NO);
                (void)vc.view;
                expect(vc.childViewControllers[0]).to.equal(mockComponentVC);
            });

            it(@"works with make-offerable artworks", ^{
                StubArtworkWithBNMO(NO, YES);
                (void)vc.view;
                expect(vc.childViewControllers[0]).to.equal(mockComponentVC);
            });

            it(@"works artworks that are in a sale", ^{
                StubArtworkWithSaleArtwork();
                (void)vc.view;
                expect(vc.childViewControllers[0]).to.equal(mockComponentVC);
            });
        });
    });
});

SpecEnd;
