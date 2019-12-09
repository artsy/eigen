#import "ARAppActivityContinuationDelegate.h"
#import "ARTopMenuViewController.h"
#import <Emission/ARArtworkComponentViewController.h>
#import "ARUserManager.h"
#import "ARAppDelegate+Analytics.h"
#import "ArtsyAPI+Sailthru.h"

#import <CoreSpotlight/CoreSpotlight.h>

SpecBegin(ARAppActivityContinuationDelegate);

__block UIApplication *app = nil;
__block id<UIApplicationDelegate> delegate = nil;

beforeEach(^{
    app = [UIApplication sharedApplication];
    delegate = [JSDecoupledAppDelegate sharedAppDelegate];
});

it(@"does not accept unsupported activities", ^{
    expect([delegate application:app willContinueUserActivityWithType:@"unsupported activity"]).to.beFalsy();
});

it(@"accepts Safari Handoff", ^{
    expect([delegate application:app willContinueUserActivityWithType:NSUserActivityTypeBrowsingWeb]).to.beTruthy();
});

it(@"accepts Spotlight Handoff", ^{
   expect([delegate application:app willContinueUserActivityWithType:CSSearchableItemActionType]).to.beTruthy();
});

it(@"accepts any user activity with the Artsy prefix", ^{
    [@[@"artwork", @"artist", @"gene", @"fair"] each:^(NSString *subtype) {
        NSString *type = [NSString stringWithFormat:@"net.artsy.artsy.%@", subtype];
        expect([delegate application:app willContinueUserActivityWithType:type]).to.beTruthy();
    }];
});

describe(@"concerning loading a VC from a URL and reporting analytics", ^{
    NSURL *URL = [NSURL URLWithString:@"https://www.artsy.net/artwork/andy-warhol-tree-frog"];
    __block id userManagerMock = nil;
    __block id topMenuMock = nil;
    __block id appDelegateMock = nil;
    __block id apiMock = nil;

    beforeEach(^{
        userManagerMock = [OCMockObject partialMockForObject:[ARUserManager sharedManager]];
        [[[userManagerMock stub] andReturnValue:@(YES)] hasExistingAccount];
        
        [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/collection/saved-artwork/artworks" withResponse:@{}];
      
        [OHHTTPStubs stubJSONResponseForHost:@"metaphysics*.artsy.net" withResponse:@{}];

        topMenuMock = [OCMockObject partialMockForObject:[ARTopMenuViewController sharedController]];
        [[topMenuMock expect] pushViewController:[OCMArg checkWithBlock:^(ARArtworkComponentViewController *viewController) {
            Artwork *artwork = viewController.artwork;
            return [artwork.artworkID isEqualToString:@"andy-warhol-tree-frog"];
        }]];
        
        appDelegateMock = [OCMockObject partialMockForObject:[ARAppDelegate sharedInstance]];
        [[appDelegateMock expect] lookAtURLForAnalytics:URL];
        
        apiMock = [OCMockObject mockForClass:ArtsyAPI.class];
    });

    afterEach(^{
        [apiMock stopMocking];
        [userManagerMock stopMocking];
        
        [topMenuMock verify];
        [topMenuMock stopMocking];
        
        [appDelegateMock verify];
        [appDelegateMock stopMocking];
    });

    it(@"routes the Spotlight link to the appropriate view controller and shows it", ^{
        NSUserActivity *activity = [[NSUserActivity alloc] initWithActivityType:CSSearchableItemActionType];
        activity.userInfo = @{ CSSearchableItemActivityIdentifier: URL.absoluteString };
        
        expect([delegate application:app
                continueUserActivity:activity
                  restorationHandler:^(NSArray *_) {}]).to.beTruthy();
    });

    it(@"routes the WebBrowsing link to the appropriate view controller and shows it", ^{
        NSUserActivity *activity = [[NSUserActivity alloc] initWithActivityType:NSUserActivityTypeBrowsingWeb];
        activity.webpageURL = URL;

        expect([delegate application:app
                continueUserActivity:activity
                  restorationHandler:^(NSArray *_) {}]).to.beTruthy();
    });

    it(@"requests a decoded URL from Sailthru and then routes the WebBrowsing link to the appropriate view controller and shows it", ^{
        NSURL *sailthruURL = [NSURL URLWithString:@"https://link.artsy.net/click/some-opaque-ID"];
        
        NSUserActivity *activity = [[NSUserActivity alloc] initWithActivityType:NSUserActivityTypeBrowsingWeb];
        activity.webpageURL = sailthruURL;

        [[apiMock expect] getDecodedURLAndRegisterClick:sailthruURL
                                             completion:[OCMArg checkWithBlock:^(void (^callback)(NSURL *URL)) {
            callback(URL);
            return YES;
        }]];
        [delegate application:app continueUserActivity:activity restorationHandler:^(NSArray *_) {}];
        [apiMock verify];
    });
});

SpecEnd;
