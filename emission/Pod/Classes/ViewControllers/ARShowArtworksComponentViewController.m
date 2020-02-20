#import "ARShowArtworksComponentViewController.h"
#import "AREmission.h"
#import "ARGraphQLQueryPreloader.h"

@implementation ARShowArtworksComponentViewController

- (instancetype)initWithShowID:(NSString *)showID
{
    return [self initWithShowID:showID emission:[AREmission sharedInstance]];
}

- (instancetype)initWithShowID:(NSString *)showID emission:(nullable AREmission *)emission
{
    return [super initWithEmission:emission moduleName:@"ShowArtworks" initialProperties:@{ @"showID": showID }];
}

@end
