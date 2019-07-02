#import "ARAppDelegate.h"
#import "ARAppDelegate+Emission.h"

SpecBegin(ARAppDelegate);

it(@"makes sure that settings are merged correctly", ^{
    NSDictionary *echoConfig = @{
        @"ipad_vir": @(NO),
        @"iphone_vir": @(YES),
        @"ARDisableReactNativeBidFlow": @(NO),
        @"AREnableBuyNowFlow": @(YES)
    };

    NSDictionary *labOptionsConfig = @{
       AROptionsDisableNativeLiveAuctions: @(YES),
       AROptionsDebugARVIR: @(YES),
    };

    ARAppDelegate *delegate = [ARAppDelegate new];
    NSDictionary *resolvedConfig = [delegate getOptionsForEmission:echoConfig labOptions:labOptionsConfig];
    expect(resolvedConfig).to.equal(@{
      @"ARDisableReactNativeBidFlow": @(NO),
      @"ipad_vir": @(NO),
      @"iphone_vir": @(YES),
      @"enableBuyNowMakeOffer":@(YES),
      @"AREnableBuyNowFlow": @(YES),
      @"Debug AR View in Room": @(YES),
      @"Disable Native Live Auctions": @(YES)
    });
});

SpecEnd
