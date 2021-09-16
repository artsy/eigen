#import <Foundation/Foundation.h>

@class Gene;

NS_ASSUME_NONNULL_BEGIN
@interface AROnboardingPersonalizationGeneImageStateReconciler : NSObject

- (NSURL *)imageURLForGene:(Gene *)gene atIndexPath:(NSIndexPath *)indexPath;

- (void)addReplacedGene:(NSIndexPath *)indexPath;
- (void)reset;

@end
NS_ASSUME_NONNULL_END
