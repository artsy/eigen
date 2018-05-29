#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

NS_ASSUME_NONNULL_BEGIN

@interface ARGraphQLQuery : NSObject

@property (readonly, nonatomic, copy, nonnull) NSString *queryName;
@property (readonly, nonatomic, copy, nonnull) NSDictionary<NSString *, NSString *> *variables;

- (instancetype)init NS_UNAVAILABLE;

- (instancetype)initWithQueryName:(NSString *)queryName;

- (instancetype)initWithQueryName:(NSString *)queryName
                        variables:(nullable NSDictionary *)variables NS_DESIGNATED_INITIALIZER;

@end

@class AREmissionConfiguration, ARGraphQLQueryCache;

@interface ARGraphQLQueryPreloader : NSObject <RCTBridgeModule>

@property (readonly, nonatomic, strong, nonnull) AREmissionConfiguration *configuration;
@property (readonly, nonatomic, strong, nonnull) ARGraphQLQueryCache *cache;

- (instancetype)init NS_UNAVAILABLE;
- (instancetype)initWithConfiguration:(AREmissionConfiguration *)configuration
                                cache:(ARGraphQLQueryCache *)cache NS_DESIGNATED_INITIALIZER;

- (void)preloadQueries:(NSArray<ARGraphQLQuery *> *)queries;

@end

NS_ASSUME_NONNULL_END
