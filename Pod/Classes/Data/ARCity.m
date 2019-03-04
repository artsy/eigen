
#import "ARCity.h"

static NSArray <ARCity *> *computedCities;

@interface ARCity ()

- (instancetype)initWithName:(NSString *)name epicenter:(CLLocationCoordinate2D)epicenter;

@end

@implementation ARCity

- (instancetype)initWithName:(NSString *)name epicenter:(CLLocationCoordinate2D)epicenter
{
    self = [super init];
    if (self) {
        _name = name;
        _epicenter = epicenter;
    }
    return self;
}

+ (NSArray <ARCity *> *)cities
{
    if (!computedCities) {
        computedCities = @[
            [[ARCity alloc] initWithName:@"New York" epicenter:CLLocationCoordinate2DMake(40.7128, -74.006)],
            [[ARCity alloc] initWithName:@"Los Angeles" epicenter:CLLocationCoordinate2DMake(34.0522, 118.2437)],
            [[ARCity alloc] initWithName:@"London" epicenter:CLLocationCoordinate2DMake(51.5074, 0.1278)],
            [[ARCity alloc] initWithName:@"Berlin" epicenter:CLLocationCoordinate2DMake(52.52, 13.405)],
            [[ARCity alloc] initWithName:@"Paris" epicenter:CLLocationCoordinate2DMake(48.8566, 2.3522)],
            [[ARCity alloc] initWithName:@"Hong Kong" epicenter:CLLocationCoordinate2DMake(22.3964, 114.1095)]
        ];
    }
    return computedCities;
}

@end
