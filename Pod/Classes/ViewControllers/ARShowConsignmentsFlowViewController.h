#import <Emission/ARComponentViewController.h>

NS_ASSUME_NONNULL_BEGIN

@interface ARShowConsignmentsFlowViewController : ARComponentViewController

- (instancetype)init NS_DESIGNATED_INITIALIZER;

- (instancetype)initWithEmission:(nullable AREmission *)emission
                      moduleName:(NSString *)moduleName
               initialProperties:(nullable NSDictionary *)initialProperties NS_UNAVAILABLE;

@end

NS_ASSUME_NONNULL_END
