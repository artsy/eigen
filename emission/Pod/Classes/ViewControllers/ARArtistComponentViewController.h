#import <Emission/ARComponentViewController.h>

@class ARGraphQLQuery;

NS_ASSUME_NONNULL_BEGIN

// TODO: Rename to ARArtistViewController once the old one has been removed from Eigen.
@interface ARArtistComponentViewController : ARComponentViewController

@property (nonatomic, strong, readonly) NSString *artistID;

+ (NSArray<ARGraphQLQuery *> *)preloadQueriesWithArtistID:(NSString *)artistID;

- (instancetype)initWithArtistID:(NSString *)artistID;
- (instancetype)initWithArtistID:(NSString *)artistID
                        emission:(nullable AREmission *)emission NS_DESIGNATED_INITIALIZER;

- (instancetype)initWithEmission:(nullable AREmission *)emission
                      moduleName:(NSString *)moduleName
               initialProperties:(nullable NSDictionary *)initialProperties NS_UNAVAILABLE;

@end

NS_ASSUME_NONNULL_END
