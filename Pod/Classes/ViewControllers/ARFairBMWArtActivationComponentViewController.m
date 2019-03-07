#import "ARFairBMWArtActivationComponentViewController.h"
#import "AREmission.h"
#import "ARGraphQLQueryPreloader.h"

@interface ARFairBMWArtActivationComponentViewController ()

@end

@implementation ARFairBMWArtActivationComponentViewController

+ (NSArray<ARGraphQLQuery *> *)preloadQueriesWithFairID:(NSString *)fairID;
{
    NSDictionary *variables = @{
                                @"fairID": fairID,
                                };
    return @[[[ARGraphQLQuery alloc] initWithQueryName:@"FairBMWArtActivationQuery" variables:variables]];
}

- (instancetype)initWithFairID:(NSString *)fairID
{
    return [self initWithFairID:fairID emission:[AREmission sharedInstance]];
}

- (instancetype)initWithFairID:(NSString *)fairID emission:(nullable AREmission *)emission
{
    return [super initWithEmission:emission moduleName:@"FairBMWArtActivation" initialProperties:@{ @"fairID": fairID }];
}

@end
