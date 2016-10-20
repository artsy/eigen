#import "AROnboardingPersonalizationGeneImageStateReconciler.h"
#import "Gene.h"


@interface AROnboardingPersonalizationGeneImageStateReconciler ()

@property (nonatomic, strong) NSMutableSet *replacedGenes;

@end


@implementation AROnboardingPersonalizationGeneImageStateReconciler

- (instancetype)init
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _replacedGenes = [NSMutableSet set];

    return self;
}

- (NSURL *)imageURLForGene:(Gene *)gene atIndexPath:(NSIndexPath *)indexPath
{
    if ([self.replacedGenes containsObject:indexPath]) {
        return gene.smallImageURL;
    } else {
        return gene.onboardingImageURL;
    }
}

- (void)addReplacedGene:(NSIndexPath *)indexPath
{
    [self.replacedGenes addObject:indexPath];
}

- (void)reset
{
    [self.replacedGenes removeAllObjects];
}


@end
