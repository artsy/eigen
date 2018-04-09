#import "ARHomeComponentViewController.h"
#import "ARGraphQLQueryPreloader.h"

#import <React/RCTRootView.h>

@implementation ARHomeComponentViewController

+ (NSArray<ARGraphQLQuery *> *)preloadQueriesWithSelectedArtist:(nullable NSString *)artistID
                                                            tab:(ARHomeTabType)selectedTab;
{
    return @[
        [[ARGraphQLQuery alloc] initWithQueryName:@"QueryRenderersWorksForYouQuery" variables:@{ @"selectedArtist": artistID ?: @"" }],
        [[ARGraphQLQuery alloc] initWithQueryName:@"QueryRenderersForYouQuery"],
        [[ARGraphQLQuery alloc] initWithQueryName:@"SalesRendererQuery"],
    ];
}

- (instancetype)initWithSelectedArtist:(nullable NSString *)artistID tab:(ARHomeTabType)selectedTab emission:(nullable AREmission*)emission;
{
    NSDictionary *initialProperties = artistID ? @{ @"selectedArtist": artistID, @"selectedTab": @(selectedTab) } : @{ @"selectedTab": @(selectedTab) };
    if ((self = [super initWithEmission:emission
                             moduleName:@"Home"
                      initialProperties:initialProperties])) {
        _selectedArtist = artistID;
    }
    return self;
}

@end
