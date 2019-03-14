#import "ARSwitchBoard.h"
#import "ArtsyEcho.h"
#import "Artsy-Swift.h"
#import <JLRoutes/JLRoutes.h>


@interface ARStubbedEcho : Aerodramus
@property (nonatomic, copy) void (^givenUpdateBlock)(BOOL updated);
@end


@implementation ARStubbedEcho

- (NSString *)name
{
    return @"ARStubbedEcho";
}

// NOP. doesn't try grab a JSON file for parsing
- (void)setup {}

/// Lets us choose whether a op completes or not
- (void)checkForUpdates:(void (^)(BOOL updatedDataOnServer))updateCheckCompleted
{
    self.givenUpdateBlock = updateCheckCompleted;
}

/// Do no networking
- (void)update:(void (^)(BOOL updated, NSError *error))completed
{
    completed(YES, nil);
}

@end


@interface ARSwitchBoard (PrivateTestStuff)
@property (nonatomic, strong) JLRoutes *routes;
@property (nonatomic, strong) Aerodramus *echo;

- (void)updateRoutes;

@end

BOOL canRoute(JLRoutes *router, NSString *path)
{
    return [router canRouteURL:[NSURL URLWithString:path]];
}

SpecBegin(ARSwitchboardEcho);

__block ARSwitchBoard *switchboard;
__block Route *testRoute, *alternativeRoute;

describe(@"ARSwitchboard+Echo", ^{

    before(^{
        switchboard = [[ARSwitchBoard alloc] init];
        switchboard.echo = [[ARStubbedEcho alloc] init];
        testRoute = [[Route alloc] initWithName:@"ARArtistRoute" path:@"/my/route"];
        alternativeRoute = [[Route alloc] initWithName:@"ARArtistRoute" path:@"/my/new/route"];
    });

    it(@"has a working routes object", ^{
        expect(switchboard.routes).to.beTruthy();
    });

    it(@"updates routes from Echo when updateRoutes is called", ^{
        expect(canRoute(switchboard.routes, testRoute.path)).to.beFalsy();

        switchboard.echo.routes = @{ testRoute.name : testRoute };
        [switchboard updateRoutes];

        expect(canRoute(switchboard.routes, testRoute.path)).to.beTruthy();
    });

    it(@"changes routes from Echo when echo has indicated that it should update", ^{
        ARStubbedEcho *echo = (id)switchboard.echo;

        // Add the initial route
        switchboard.echo.routes = @{ testRoute.name : testRoute };
        [switchboard updateRoutes];

        expect(canRoute(switchboard.routes, testRoute.path)).to.beTruthy();

        // Ok, now update the routes
        switchboard.echo.routes = @{ alternativeRoute.name : alternativeRoute };

        // Trigger an update
        echo.givenUpdateBlock(YES);

        // Old route should fail
        expect(canRoute(switchboard.routes, testRoute.path)).to.beFalsy();
        // New route should exist
        expect(canRoute(switchboard.routes, alternativeRoute.path)).to.beTruthy();
    });

});

SpecEnd
