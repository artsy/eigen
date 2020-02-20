#import "ARShowArtistsComponentViewController.h"
#import "AREmission.h"
#import "ARGraphQLQueryPreloader.h"

@implementation ARShowArtistsComponentViewController

- (instancetype)initWithShowID:(NSString *)showID
{
    return [self initWithShowID:showID emission:[AREmission sharedInstance]];
}

- (instancetype)initWithShowID:(NSString *)showID emission:(nullable AREmission *)emission
{
    return [super initWithEmission:emission moduleName:@"ShowArtists" initialProperties:@{ @"showID": showID }];
}

@end
