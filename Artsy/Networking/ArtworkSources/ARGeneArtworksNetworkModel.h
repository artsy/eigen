#import <Foundation/Foundation.h>
#import "Gene.h"


@class AREmbeddedModelsViewController, Gene;


@interface ARGeneArtworksNetworkModel : NSObject

- (id)initWithGene:(Gene *)gene;
- (void)getNextArtworkPage:(void (^)(NSArray *artworks))success;
- (void)getFollowState:(void (^)(ARHeartStatus status))success failure:(void (^)(NSError *error))failure;
- (void)setFollowState:(BOOL)state success:(void (^)(id))success failure:(void (^)(NSError *))failure;
- (void)updateGene:(void (^)(void))success;


@property (nonatomic, strong, readonly) Gene *gene;
@property (nonatomic, assign, readonly) NSInteger currentPage;

@end
