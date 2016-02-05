#import "ARAppDelegate.h"
#import "ARAppDelegate+Analytics.h"
#import "ARStubbedAnalyticsProvider.h"
#import <ARAnalytics/ARAnalytics.h>
#import "ARAnalyticsConstants.h"

/// Depending on how this spec turns out, it may be worth migrating it into it's own target
/// as, in theory, this spec can leak into all the others due to the triggering of analytics.

/// Imports for the VC/Views

#import "ARHeroUnitViewController.h"

/// ZZ to make it go last, thanks to XCTest implmentation details
SpecBegin(ZZAppAnalytics);

// This should only get run once, as it does all the swizzling
// calling that multiple times looks to me like it could
// end up with unexpected behavior

beforeAll(^{
    ARAppDelegate *delegate = [[ARAppDelegate alloc] init];
    [delegate setupAnalytics];
});

__block ARStubbedAnalyticsProvider *analytics;

/// Kill off all existing providers, then replace with our easily introspected provider:

beforeEach(^{
    analytics = [[ARStubbedAnalyticsProvider alloc] initWithIdentifier:@""];
    [[ARAnalytics currentProviders].copy each:^(id provider) {
        [ARAnalytics removeProvider:provider];
    }];

    [ARAnalytics setupProvider:analytics];
});

describe(@"ARSiteHeroUnitView", ^{
    it(@"triggers when tapped", ^{

        ARSiteHeroUnitViewController *controller = [[ARSiteHeroUnitViewController alloc] initWithHeroUnit:[SiteHeroUnit modelWithJSON:@{ @"link":@"/day-2-remember"}] andIndex:0];
        [controller tappedUnit:nil];

        expect(analytics.lastEventName).to.equal(ARAnalyticsTappedHeroUnit);
        expect(analytics.lastEventProperties).to.equal(@{ @"destination" : @"/day-2-remember"});
    });

});

SpecEnd
