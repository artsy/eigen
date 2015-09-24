#import "ARAppActivityContinuationDelegate.h"
#import "ARTopMenuViewController.h"
#import "ARArtworkSetViewController.h"
#import "ARArtworkViewController.h"

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

it(@"accepts any user activity with the Artsy prefix", ^{
    [@[@"artwork", @"artist", @"gene", @"fair"] each:^(NSString *subtype) {
        NSString *type = [NSString stringWithFormat:@"net.artsy.artsy.%@", subtype];
        expect([delegate application:app willContinueUserActivityWithType:type]).to.beTruthy();
    }];
});

it(@"routes the link to the appropriate view controller and shows it", ^{
    id mock = [OCMockObject partialMockForObject:[ARTopMenuViewController sharedController]];
    [[mock expect] pushViewController:[OCMArg checkWithBlock:^(ARArtworkSetViewController *viewController) {
        (void)viewController.view; // ensure the artwork view controller gets created
        NSString *artworkID = viewController.currentArtworkViewController.artwork.artworkID;
        return [artworkID isEqualToString:@"andy-warhol-tree-frog"];
    }]];

    NSUserActivity *activity = [[NSUserActivity alloc] initWithActivityType:NSUserActivityTypeBrowsingWeb];
    activity.webpageURL = [NSURL URLWithString:@"https://www.artsy.net/artwork/andy-warhol-tree-frog"];

    expect([delegate application:app
            continueUserActivity:activity
              restorationHandler:^(NSArray *restorableObjects) {}]).to.beTruthy();

    [mock verify];
    [mock stopMocking];
});

SpecEnd;
