#import <Emission/ARComponentViewController.h>

@class ARGraphQLQuery;

NS_ASSUME_NONNULL_BEGIN

// TODO: Rename to ARGeneViewController once the old one has been removed from Eigen.
@interface ARGeneComponentViewController : ARComponentViewController

@property (nonatomic, strong, readonly) NSString *geneID;

+ (NSArray<ARGraphQLQuery *> *)preloadQueriesWithGeneID:(NSString *)geneID
                                         refineSettings:(NSDictionary *)settings;

- (instancetype)initWithGeneID:(NSString *)geneID;

- (instancetype)initWithGeneID:(NSString *)geneID refineSettings:(NSDictionary *)settings;

- (instancetype)initWithGeneID:(NSString *)geneID
                refineSettings:(NSDictionary *)settings
                      emission:(nullable AREmission *)emission NS_DESIGNATED_INITIALIZER;

- (instancetype)initWithEmission:(nullable AREmission *)emission
                      moduleName:(NSString *)moduleName
               initialProperties:(nullable NSDictionary *)initialProperties NS_UNAVAILABLE;

@end

NS_ASSUME_NONNULL_END
