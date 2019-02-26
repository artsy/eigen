#import "ARFairArtistsComponentViewController.h"
#import "AREmission.h"
#import "ARGraphQLQueryPreloader.h"

@interface ARFairArtistsComponentViewController ()

@end

@implementation ARFairArtistsComponentViewController

+ (NSArray<ARGraphQLQuery *> *)preloadQueriesWithFairID:(NSString *)fairID;
{
    NSDictionary *variables = @{
                                @"fairID": fairID,
                                };
    return @[[[ARGraphQLQuery alloc] initWithQueryName:@"FairExhibitorsQuery" variables:variables]];
}

- (instancetype)initWithFairID:(NSString *)fairID
{
    return [self initWithFairID:fairID emission:[AREmission sharedInstance]];
}

- (instancetype)initWithFairID:(NSString *)fairID emission:(nullable AREmission *)emission
{
    return [super initWithEmission:emission moduleName:@"FairArtists" initialProperties:@{ @"fairID": fairID }];
}

@end
