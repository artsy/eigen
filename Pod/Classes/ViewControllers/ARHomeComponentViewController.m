#import "ARHomeComponentViewController.h"
#import "ARGraphQLQueryPreloader.h"

#import <React/RCTRootView.h>

@implementation ARHomeComponentViewController

+ (NSDictionary *)propsWithSelectedArtist:(nullable NSString *)artistID tab:(ARHomeTabType)selectedTab;
{
    return artistID ? @{ @"selectedArtist": artistID, @"selectedTab": @(selectedTab) } : @{ @"selectedTab": @(selectedTab) };
}

+ (NSArray<ARGraphQLQuery *> *)preloadQueriesWithSelectedArtist:(nullable NSString *)artistID
                                                            tab:(ARHomeTabType)selectedTab;
{
    int maxTab = ARHomeTabAuctions + 1;
    NSMutableArray *queries = [NSMutableArray new];
    for (int count = 0; count < maxTab; count++) {
        // Load queries for each consecutive tab starting with the selected tab and then wrap around.
        ARHomeTabType tab = (count + selectedTab) % maxTab;
        NSString *queryName = nil;
        switch (tab) {
            case ARHomeTabArtists:
                queryName = @"QueryRenderersWorksForYouQuery";
                break;
            case ARHomeTabForYou:
                queryName = @"QueryRenderersForYouQuery";
                break;
            case ARHomeTabAuctions:
                queryName = @"SalesRendererQuery";
                break;
        }
        NSDictionary *props = [self propsWithSelectedArtist:artistID tab:tab];
        [queries addObject:[[ARGraphQLQuery alloc] initWithQueryName:queryName variables:props]];
    }
    return [queries copy];
}

- (instancetype)initWithSelectedArtist:(nullable NSString *)artistID tab:(ARHomeTabType)selectedTab emission:(nullable AREmission*)emission;
{
    if ((self = [super initWithEmission:emission
                             moduleName:@"Home"
                      initialProperties:[self.class propsWithSelectedArtist:artistID tab:selectedTab]])) {
        _selectedArtist = artistID;
    }
    return self;
}

@end
