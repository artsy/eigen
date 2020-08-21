#import "Follow.h"

#import "Artist.h"
#import "Profile.h"

#import "ARMacros.h"

@implementation Follow

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        ar_keypath(Follow.new, followID) : @"id"
    };
}

+ (NSValueTransformer *)profileJSONTransformer
{
    return [MTLValueTransformer mtl_JSONDictionaryTransformerWithModelClass:[Profile class]];
}

+ (NSValueTransformer *)artistJSONTransformer
{
    return [MTLValueTransformer mtl_JSONDictionaryTransformerWithModelClass:[Artist class]];
}

- (BOOL)isEqual:(id)object
{
    if ([object isKindOfClass:[self class]]) {
        Follow *follow = object;
        return [follow.followID isEqualToString:self.followID];
    }

    return [super isEqual:object];
}

- (NSUInteger)hash
{
    return self.followID.hash;
}

@end
