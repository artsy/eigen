#import "Artwork.h"
#import "ARArtworkViewController.h"
#import "ARLegacyArtworkViewController.h"
#import <Emission/ARArtworkComponentViewController.h>


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

    vc = [[ARArtworkViewController alloc] initWithArtwork:artwork fair:nil];
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
      beforeEach(^{
        vc = [[ARArtworkViewController alloc] initWithArtwork:artwork fair:nil];
      });

      for (NSString *availability in componentAvailabilityStates) {
        it([NSString stringWithFormat:@"shows it with a `%@` artwork", availability], ^{
          StubArtworkWithAvailabilityAndInquireability(availability, @(YES));
          (void)vc.view;
          expect(vc.childViewControllers[0]).to.equal(mockLegacyVC);
        });
      }
    });

    describe(@"when the lab option is disabled", ^{
      beforeEach(^{
        [AROptions setBool:NO forOption:AROptionsRNArtwork];
      });

      for (NSString *availability in componentAvailabilityStates) {
        it([NSString stringWithFormat:@"shows it with a `%@` artwork", availability], ^{
          StubArtworkWithAvailability(availability);
          (void)vc.view;
          expect(vc.childViewControllers[0]).to.equal(mockLegacyVC);
        });
      }
    });
  });

  describe(@"concerning artworks for which to show the new component view", ^{
    beforeEach(^{
      [AROptions setBool:YES forOption:AROptionsRNArtwork];
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

SpecEnd;
