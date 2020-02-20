#import "ARComponentViewController.h"

@class ARGraphQLQuery;

NS_ASSUME_NONNULL_BEGIN

@interface ARPartnerComponentViewController : ARComponentViewController

@property (nonatomic, strong, readonly) NSString *partnerID;

+ (NSArray<ARGraphQLQuery *> *)preloadQueriesWithPartnerID:(NSString *)partnerID;

- (instancetype)initWithPartnerID:(NSString *)partnerID;
- (instancetype)initWithPartnerID:(NSString *)partnerID
                        emission:(nullable AREmission *)emission NS_DESIGNATED_INITIALIZER;

- (instancetype)initWithEmission:(nullable AREmission *)emission
                      moduleName:(NSString *)moduleName
               initialProperties:(nullable NSDictionary *)initialProperties NS_UNAVAILABLE;

@end

NS_ASSUME_NONNULL_END
