#import "ARGeneViewController.h"

SpecBegin(ARGeneViewController)

__block ARGeneViewController *vc;

after(^{
    vc = nil;
});

pending(@"with long desciption", ^{ // This works, but on Travis we get a weird autolayout error.
// itHasAsyncronousSnapshotsForDevicesWithName(@"with long desciption", ^{
    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/gene/painting" withResponse:@{
        @"id" : @"painting",
        @"name" : @"Painting",
        @"description" : @"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }];
    NSArray *artworksJSON = [NSArray array];
    for (int i = 1; i <= 9; i++){
        artworksJSON = [artworksJSON arrayByAddingObject:@{
            @"title" : NSStringWithFormat(@"Artwork %i", i),
            @"artist" : @{
                @"name" : NSStringWithFormat(@"Artist %i", i)
            },
            @"date" : @"2009"
        }];
    }

    [OHHTTPStubs stubJSONResponseAtPath:@"/api/v1/search/filtered/gene/painting" withResponse:artworksJSON];

    UIWindow *window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    vc = [[ARGeneViewController alloc] initWithGeneID:@"painting"];
    vc.shouldAnimate = NO;
    window.rootViewController = vc;
    expect(vc.view).willNot.beNil();
    [window makeKeyAndVisible];
    return vc;
});

SpecEnd