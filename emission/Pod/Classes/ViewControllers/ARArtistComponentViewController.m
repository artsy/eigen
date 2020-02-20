#import "ARArtistComponentViewController.h"
#import "ARGraphQLQueryPreloader.h"

@implementation ARArtistComponentViewController

+ (NSDictionary *)propsWithArtistID:(NSString *)artistID;
{
    BOOL isPad = UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad;
    return @{ @"artistID": artistID, @"isPad": @(isPad) };
}

+ (NSArray<ARGraphQLQuery *> *)preloadQueriesWithArtistID:(NSString *)artistID;
{
    return @[[[ARGraphQLQuery alloc] initWithQueryName:@"QueryRenderersArtistQuery" variables:[self propsWithArtistID:artistID]]];
}

- (instancetype)initWithArtistID:(NSString *)artistID;
{
  return [self initWithArtistID:artistID emission:nil];
}

- (instancetype)initWithArtistID:(NSString *)artistID emission:(AREmission *)emission;
{
  if ((self = [super initWithEmission:emission
                           moduleName:@"Artist"
                    initialProperties:[self.class propsWithArtistID:artistID]])) {
    _artistID = artistID;
  }
  return self;
}

@end
