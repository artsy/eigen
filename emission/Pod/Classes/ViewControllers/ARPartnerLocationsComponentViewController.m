#import "ARPartnerLocationsComponentViewController.h"
#import "ARGraphQLQueryPreloader.h"

@implementation ARPartnerLocationsComponentViewController

+ (NSDictionary *)propsWithPartnerID:(NSString *)partnerID;
{
    BOOL isPad = UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad;
    return @{ @"partnerID": partnerID, @"isPad": @(isPad) };
}

+ (NSArray<ARGraphQLQuery *> *)preloadQueriesWithPartnerID:(NSString *)partnerID;
{
    return @[[[ARGraphQLQuery alloc] initWithQueryName:@"QueryRenderersPartnerLocationsQuery" variables:[self propsWithPartnerID:partnerID]]];
}

- (instancetype)initWithPartnerID:(NSString *)partnerID;
{
  return [self initWithPartnerID:partnerID emission:nil];
}

- (instancetype)initWithPartnerID:(NSString *)partnerID emission:(AREmission *)emission;
{
  if ((self = [super initWithEmission:emission
                           moduleName:@"PartnerLocations"
                    initialProperties:[self.class propsWithPartnerID:partnerID]])) {
    _partnerID = partnerID;
  }
  return self;
}

@end
