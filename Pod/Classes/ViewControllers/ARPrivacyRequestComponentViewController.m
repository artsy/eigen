#import "ARPrivacyRequestComponentViewController.h"
#import "ARGraphQLQueryPreloader.h"

@implementation ARPrivacyRequestComponentViewController

+ (NSArray<ARGraphQLQuery *> *)preloadQueries;
{
    return @[[[ARGraphQLQuery alloc] initWithQueryName:@"QueryRenderersMyProfileQuery"]];
}

- (instancetype)init
{
    return [super initWithEmission:nil moduleName:@"PrivacyRequest" initialProperties:nil];
}

@end
