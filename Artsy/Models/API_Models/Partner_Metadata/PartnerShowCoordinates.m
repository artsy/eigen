#import "PartnerShowCoordinates.h"


@implementation PartnerShowCoordinates

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        ar_keypath(PartnerShowCoordinates.new, longitude) : @"lng",
        ar_keypath(PartnerShowCoordinates.new, latitude) : @"lat",
    };
}

- (NSDictionary *)dictionaryRepresentation
{
    return @{
        @"longitude" : self.longitude,
        @"latitude" : self.latitude
    };
}

- (CLLocation *)location
{
    return [[CLLocation alloc] initWithLatitude:self.latitude.doubleValue longitude:self.longitude.doubleValue];
}

@end
