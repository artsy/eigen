#import "ARPartnerComponentViewController.h"
#import "ARGraphQLQueryPreloader.h"

@implementation ARPartnerComponentViewController

+ (NSDictionary *)propsWithPartnerID:(NSString *)partnerID;
{
    BOOL isPad = UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad;
    return @{ @"partnerID": partnerID, @"isPad": @(isPad) };
}

+ (NSArray<ARGraphQLQuery *> *)preloadQueriesWithPartnerID:(NSString *)partnerID;
{
    return @[[[ARGraphQLQuery alloc] initWithQueryName:@"QueryRenderersPartnerQuery" variables:[self propsWithPartnerID:partnerID]]];
}

- (instancetype)initWithPartnerID:(NSString *)partnerID;
{
  return [self initWithPartnerID:partnerID emission:nil];
}

- (instancetype)initWithPartnerID:(NSString *)partnerID emission:(AREmission *)emission;
{
  if ((self = [super initWithEmission:emission
                           moduleName:@"Partner"
                    initialProperties:[self.class propsWithPartnerID:partnerID]])) {
    _partnerID = partnerID;
  }
  return self;
}

@end
