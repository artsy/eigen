#import "ARLocation.h"

@implementation ARLocation

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
             @keypath(ARLocation.new, streetAddress) : @"address",
             @keypath(ARLocation.new, postalCode) : @"postal_code",
             @keypath(ARLocation.new, streetAddress) : @"address",
             @keypath(ARLocation.new, publiclyViewable) : @"publicly_viewable",
    };
}

+ (NSValueTransformer *)publiclyViewableTransformer {
    return [NSValueTransformer valueTransformerForName:MTLBooleanValueTransformerName];
}

@end
