#import "ARFairExhibitorsComponentViewController.h"
#import "AREmission.h"
#import "ARGraphQLQueryPreloader.h"

@interface ARFairExhibitorsComponentViewController ()

@end

@implementation ARFairExhibitorsComponentViewController

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
    return [super initWithEmission:emission moduleName:@"FairExhibitors" initialProperties:@{ @"fairID": fairID }];
}

@end
