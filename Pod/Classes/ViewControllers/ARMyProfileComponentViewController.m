#import "ARMyProfileComponentViewController.h"
#import "ARGraphQLQueryPreloader.h"

@implementation ARMyProfileComponentViewController

+ (NSArray<ARGraphQLQuery *> *)preloadQueries;
{
    return @[[[ARGraphQLQuery alloc] initWithQueryName:@"QueryRenderersMyProfileQuery"]];
}

- (instancetype)init
{
    return [super initWithEmission:nil moduleName:@"MyProfile" initialProperties:nil];
}

@end
