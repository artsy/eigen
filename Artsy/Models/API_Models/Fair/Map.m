#import "Map.h"

#import "MapFeature.h"
#import "Image.h"

#import <ReactiveCocoa/ReactiveCocoa.h>

@interface Map ()
@property (nonatomic, strong) Image *image;
@end


@implementation Map

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        ar_keypath(Map.new, features) : @"map_features",
        ar_keypath(Map.new, mapID) : @"id",
    };
}

+ (NSValueTransformer *)featuresJSONTransformer
{
    return [MTLValueTransformer mtl_JSONArrayTransformerWithModelClass:MapFeature.class];
}

- (SEL)setHostPropertySelector;
{
    return @selector(setImage:);
}

- (Class)hostedObjectClass
{
    return Image.class;
}

- (BOOL)isEqual:(id)object
{
    if ([object isKindOfClass:[self class]]) {
        Map *map = object;
        return [map.mapID isEqualToString:self.mapID];
    }

    return [super isEqual:object];
}

- (NSUInteger)hash
{
    return self.mapID.hash;
}

@end
