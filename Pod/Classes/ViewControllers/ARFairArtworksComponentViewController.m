#import "ARFairArtworksComponentViewController.h"
#import "AREmission.h"
#import "ARGraphQLQueryPreloader.h"

@interface ARFairArtworksComponentViewController ()

@end

@implementation ARFairArtworksComponentViewController

+ (NSArray<ARGraphQLQuery *> *)preloadQueriesWithFairID:(NSString *)fairID;
{
    NSDictionary *variables = @{
                                @"fairID": fairID,
                                };
    return @[[[ARGraphQLQuery alloc] initWithQueryName:@"FairArtworksQuery" variables:variables]];
}

- (instancetype)initWithFairID:(NSString *)fairID
{
    return [self initWithFairID:fairID emission:[AREmission sharedInstance]];
}

- (instancetype)initWithFairID:(NSString *)fairID emission:(nullable AREmission *)emission
{
    return [super initWithEmission:emission moduleName:@"FairArtworks" initialProperties:@{ @"fairID": fairID }];
}

@end
