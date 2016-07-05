#import <Emission/ARComponentViewController.h>

NS_ASSUME_NONNULL_BEGIN

@interface ARHomeComponentViewController : ARComponentViewController

- (instancetype)init;

- (instancetype)initWithEmission:(AREmission *)emission
                      moduleName:(NSString *)moduleName
               initialProperties:(NSDictionary *)initialProperties;

@end

NS_ASSUME_NONNULL_END
