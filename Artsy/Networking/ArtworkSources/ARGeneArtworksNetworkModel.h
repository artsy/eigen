#import <Foundation/Foundation.h>
#import "Gene.h"

@class AREmbeddedModelsViewController, Gene, GeneViewModel;


@interface ARGeneArtworksNetworkModel : NSObject

- (id)initWithGene:(Gene *)gene;
- (id)initWithGeneID:(NSString *)geneID;

- (void)getGene:(void (^)(GeneViewModel *viewModel))success;

- (void)getNextArtworkPage:(void (^)(NSArray *artworks))success;

@property (nonatomic, strong, readonly) Gene *gene;
@property (nonatomic, assign, readonly) NSInteger currentPage;

@end
