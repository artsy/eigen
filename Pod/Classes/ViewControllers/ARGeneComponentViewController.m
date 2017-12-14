#import "ARGeneComponentViewController.h"

@implementation ARGeneComponentViewController

- (instancetype)initWithGeneID:(NSString *)geneID;
{
    return [self initWithGeneID:geneID refineSettings:@{} emission:nil];
}

- (instancetype)initWithGeneID:(NSString *)geneID refineSettings:(nonnull NSDictionary *)settings;
{
    return [self initWithGeneID:geneID refineSettings:settings emission:nil];
}

- (instancetype)initWithGeneID:(NSString *)geneID refineSettings:(nonnull NSDictionary *)settings emission:(AREmission *)emission;
{
  if ((self = [super initWithEmission:emission
                           moduleName:@"Gene"
                    initialProperties:@{ @"geneID": geneID, @"refineSettings": settings }])) {
    _geneID = geneID;
  }
  return self;
}

@end
