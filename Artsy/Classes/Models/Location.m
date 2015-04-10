#import "Location.h"

@implementation Location

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
             @keypath(Location.new, streetAddress) : @"address",
             @keypath(Location.new, postalCode) : @"postal_code",
             @keypath(Location.new, publiclyViewable) : @"publicly_viewable",
    };
}

+ (NSValueTransformer *)publiclyViewableTransformer {
    return [NSValueTransformer valueTransformerForName:MTLBooleanValueTransformerName];
}

- (NSString *)addressAndCity {
    return [NSString stringWithFormat:@"%@, %@", self.streetAddress, self.city];
}

@end
