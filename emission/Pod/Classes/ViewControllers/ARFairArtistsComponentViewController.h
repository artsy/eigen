#import "ARComponentViewController.h"

@class ARGraphQLQuery;

NS_ASSUME_NONNULL_BEGIN

@interface ARFairArtistsComponentViewController : ARComponentViewController

+ (NSArray<ARGraphQLQuery *> *)preloadQueriesWithFairID:(NSString *)fairID;

- (instancetype)initWithFairID:(NSString *)fairID;

- (instancetype)initWithFairID:(NSString *)fairID
                      emission:(nullable AREmission *)emission NS_DESIGNATED_INITIALIZER;

- (instancetype)initWithEmission:(nullable AREmission *)emission
                      moduleName:(NSString *)moduleName
               initialProperties:(nullable NSDictionary *)initialProperties NS_UNAVAILABLE;

@end

NS_ASSUME_NONNULL_END
