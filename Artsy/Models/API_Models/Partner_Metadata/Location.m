#import "Location.h"


@implementation Location

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        @keypath(Location.new, streetAddress) : @"address",
        @keypath(Location.new, postalCode) : @"postal_code",
        @keypath(Location.new, publiclyViewable) : @"publicly_viewable",
        @keypath(Location.new, latitude) : @"coordinates.lat",
        @keypath(Location.new, longitude) : @"coordinates.lng",
    };
}

+ (NSValueTransformer *)publiclyViewableTransformer
{
    return [NSValueTransformer valueTransformerForName:MTLBooleanValueTransformerName];
}

- (NSString *)addressAndCity
{
    if (self.streetAddress && self.city) {
        return [NSString stringWithFormat:@"%@, %@", self.streetAddress, self.city];
    }
    return @"";
}

- (NSDictionary *)coordinatesAsDictionary
{
    return @{
        @"longitude" : self.longitude,
        @"latitude" : self.latitude
    };
}

- (CLLocation *)clLocation
{
    return [[CLLocation alloc] initWithLatitude:self.latitude.doubleValue longitude:self.longitude.doubleValue];
}


@end
