#import "ARFairComponentViewController.h"
#import "AREmission.h"

@interface ARFairComponentViewController ()

@end


@implementation ARFairComponentViewController

+ (NSArray<ARGraphQLQuery *> *)preloadQueriesWithFairID:(NSString *)geneID;
{
   NSDictionary *variables = @{
       @"fairID": fairID,
   };
   return @[[[ARGraphQLQuery alloc] initWithQueryName:@"QueryRenderersFairQuery" variables:variables]];
}

- (instancetype)initWithFairID:(NSString *)fairID
{
    return [self initWithFairID:fairID emission:[AREmission sharedInstance]];
}

- (instancetype)initWithFairID:(NSString *)fairID emission:(nullable AREmission *)emission
{
    return [super initWithEmission:emission moduleName:@"Fair" initialProperties:@{ @"fairID": fairID }];
}


@end
