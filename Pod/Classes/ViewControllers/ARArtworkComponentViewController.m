#import "ARArtworkComponentViewController.h"
#import "AREmission.h"
#import "ARGraphQLQueryPreloader.h"

@interface ARArtworkComponentViewController ()

@end

@implementation ARArtworkComponentViewController

+ (NSArray<ARGraphQLQuery *> *)preloadQueriesWithArtworkID:(NSString *)artworkID;
{
   NSDictionary *variables = @{
       @"artworkID": artworkID,
   };
   return @[[[ARGraphQLQuery alloc] initWithQueryName:@"QueryRenderersArtworkQuery" variables:variables]];
}

- (instancetype)initWithArtworkID:(NSString *)artworkID
{
    return [self initWithArtworkID:artworkID emission:[AREmission sharedInstance]];
}

- (instancetype)initWithArtworkID:(NSString *)artworkID emission:(nullable AREmission *)emission
{
    return [super initWithEmission:emission moduleName:@"Artwork" initialProperties:@{ @"artworkID": artworkID }];
}


@end
