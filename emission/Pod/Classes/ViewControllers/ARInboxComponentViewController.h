#import <Emission/ARComponentViewController.h>

@class ARGraphQLQuery;

NS_ASSUME_NONNULL_BEGIN

/**
 * IMPORTANT This VC should always be loaded from scratch when shown (e.g. host in a VC and init on viewWillAppear),
 *           otherwise the ZeroInboxState may not be updated to reveal bids/messages.
 */
@interface ARInboxComponentViewController : ARComponentViewController

+ (NSArray<ARGraphQLQuery *> *)preloadQueries;

- (instancetype)initWithInbox;

- (instancetype)initWithEmission:(nullable AREmission *)emission
                      moduleName:(NSString *)moduleName
               initialProperties:(nullable NSDictionary *)initialProperties NS_UNAVAILABLE;

@end

NS_ASSUME_NONNULL_END
