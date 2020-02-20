#import "ARGeneComponentViewController.h"
#import "ARGraphQLQueryPreloader.h"

@implementation ARGeneComponentViewController

+ (NSArray<ARGraphQLQuery *> *)preloadQueriesWithGeneID:(NSString *)geneID
                                         refineSettings:(NSDictionary *)settings;
{
    NSDictionary *variables = @{
        @"geneID": geneID,
        @"medium": settings[@"medium"] ?: @"*",
        @"price_range": settings[@"price_range"] ?: @"*-*",
    };
    return @[[[ARGraphQLQuery alloc] initWithQueryName:@"QueryRenderersGeneQuery" variables:variables]];
}

- (instancetype)initWithGeneID:(NSString *)geneID;
{
    return [self initWithGeneID:geneID refineSettings:@{} emission:nil];
}

- (instancetype)initWithGeneID:(NSString *)geneID refineSettings:(NSDictionary *)settings;
{
    return [self initWithGeneID:geneID refineSettings:settings emission:nil];
}

- (instancetype)initWithGeneID:(NSString *)geneID refineSettings:(NSDictionary *)settings emission:(AREmission *)emission;
{
  if ((self = [super initWithEmission:emission
                           moduleName:@"Gene"
                    initialProperties:@{ @"geneID": geneID, @"refineSettings": settings }])) {
    _geneID = geneID;
  }
  return self;
}

@end
