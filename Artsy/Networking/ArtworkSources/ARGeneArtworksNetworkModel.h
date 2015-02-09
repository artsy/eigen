@class AREmbeddedModelsViewController;

@interface ARGeneArtworksNetworkModel : NSObject

- (id)initWithGene:(Gene *)gene;
- (void)getNextArtworkPage:(void (^)(NSArray *artworks))success;

@property (nonatomic, strong, readonly) Gene *gene;
@property (nonatomic, assign, readonly) NSInteger currentPage;

@end
