#import <Emission/ARComponentViewController.h>

@class ARGraphQLQuery;

NS_ASSUME_NONNULL_BEGIN

@interface ARCollectionFullFeaturedArtistListComponentViewController : ARComponentViewController

@property (nonatomic, strong, readonly) NSString *collectionID;

- (instancetype)initWithCollectionID:(nullable NSString *)collectionID;
- (instancetype)initWithCollectionID:(nullable NSString *)collectionID
                            emission:(nullable AREmission*)emission NS_DESIGNATED_INITIALIZER;

- (instancetype)initWithEmission:(nullable AREmission *)emission
                      moduleName:(NSString *)moduleName
               initialProperties:(nullable NSDictionary *)initialProperties NS_UNAVAILABLE;

@end

NS_ASSUME_NONNULL_END
