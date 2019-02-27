#import "ARShowMoreInfoComponentViewController.h"
#import "AREmission.h"
#import "ARGraphQLQueryPreloader.h"

@implementation ARShowMoreInfoComponentViewController

- (instancetype)initWithShowID:(NSString *)showID
{
    return [self initWithShowID:showID emission:[AREmission sharedInstance]];
}

- (instancetype)initWithShowID:(NSString *)showID emission:(nullable AREmission *)emission
{
    return [super initWithEmission:emission moduleName:@"ShowMoreInfo" initialProperties:@{ @"showID": showID }];
}

@end
