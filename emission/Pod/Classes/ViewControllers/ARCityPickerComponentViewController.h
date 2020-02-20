#import "ARComponentViewController.h"

NS_ASSUME_NONNULL_BEGIN

@interface ARCityPickerComponentViewController : ARComponentViewController

/// Initialize with an already-selected City name.
- (instancetype)initWithSelectedCityName:(NSString * _Nullable)selectedCityName NS_DESIGNATED_INITIALIZER;

- (instancetype)initWithEmission:(nullable AREmission *)emission
                      moduleName:(NSString *)moduleName
               initialProperties:(nullable NSDictionary *)initialProperties NS_UNAVAILABLE;


@end

NS_ASSUME_NONNULL_END
