#import "Location.h"

#import "ARMacros.h"

@implementation Location

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        ar_keypath(Location.new, streetAddress) : @"address",
        ar_keypath(Location.new, postalCode) : @"postal_code",
        ar_keypath(Location.new, publiclyViewable) : @"publicly_viewable",
        ar_keypath(Location.new, latitude) : @"coordinates.lat",
        ar_keypath(Location.new, longitude) : @"coordinates.lng",
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
