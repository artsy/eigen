#import "ARCity+GeospatialAdditions.h"
#import "ARCity.h"

@implementation ARCity (GeospatialAdditions)

+ (nullable ARCity *)cityNearLocation:(CLLocation *)location;
{
    static const NSInteger CITY_RADIUS_M = 100 * 1000; // 100km

    ARCity *closestCity = [[[ARCity cities] sortedArrayUsingComparator:^NSComparisonResult(ARCity *_Nonnull lhs, ARCity *_Nonnull rhs) {
        if ([lhs.epicenter distanceFromLocation:location] < [rhs.epicenter distanceFromLocation:location]) {
            return NSOrderedAscending;
        } else {
            return NSOrderedDescending;
        }
    }] firstObject];

    if ([closestCity.epicenter distanceFromLocation:location] < CITY_RADIUS_M) {
        return closestCity;
    } else {
        // User is too far away from any city.
        return nil;
    }
}

@end
