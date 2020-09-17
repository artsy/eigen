#import <Emission/ARComponentViewController.h>

NS_ASSUME_NONNULL_BEGIN

@interface ARFair2ComponentViewController : ARComponentViewController

@property (nonatomic, strong, readonly) NSString *fairID;

- (instancetype)init NS_DESIGNATED_INITIALIZER;


- (instancetype)initWithFairID:(nullable NSString *)fairID;
- (instancetype)initWithFairID:(nullable NSString *)fairID
                            emission:(nullable AREmission*)emission NS_DESIGNATED_INITIALIZER;

- (instancetype)initWithEmission:(nullable AREmission *)emission
                      moduleName:(NSString *)moduleName
               initialProperties:(nullable NSDictionary *)initialProperties NS_UNAVAILABLE;

@end

NS_ASSUME_NONNULL_END
