#import "ARCity.h"

NS_ASSUME_NONNULL_BEGIN

@interface ARCity (GeospatialAdditions)

+ (nullable ARCity *)cityNearLocation:(CLLocation *)location;

@end

NS_ASSUME_NONNULL_END
