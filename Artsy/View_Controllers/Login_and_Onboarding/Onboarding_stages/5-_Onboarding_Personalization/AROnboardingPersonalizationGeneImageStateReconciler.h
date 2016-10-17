#import <Foundation/Foundation.h>

@class Gene;


@interface AROnboardingPersonalizationGeneImageStateReconciler : NSObject

- (NSURL *)imageURLForGene:(Gene *)gene atIndexPath:(NSIndexPath *)indexPath;

- (void)addReplacedGene:(NSIndexPath *)indexPath;
- (void)reset;

@end
