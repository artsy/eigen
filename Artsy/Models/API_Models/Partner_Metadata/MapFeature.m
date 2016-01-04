#import "ARValueTransformer.h"


@implementation MapFeature

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        ar_keypath(MapFeature.new, featureType) : @"feature_type",
    };
}

- (CGPoint)coordinateOnImage:(Image *)image
{
    return CGPointMake(image.maxTiledWidth * self.x, image.maxTiledHeight - (image.maxTiledHeight * self.y));
}

+ (NSValueTransformer *)featureTypeJSONTransformer
{
    NSDictionary *types = @{
        @"artsy" : @(ARMapFeatureTypeArtsy),
        @"drink" : @(ARMapFeatureTypeDrink),
        @"coat-check" : @(ARMapFeatureTypeCoatCheck),
        @"food" : @(ARMapFeatureTypeFood),
        @"info" : @(ARMapFeatureTypeInfo),
        @"lounge" : @(ARMapFeatureTypeLounge),
        @"restroom" : @(ARMapFeatureTypeRestroom),
        @"search" : @(ARMapFeatureTypeSearch),
        @"vip" : @(ARMapFeatureTypeVIP),
        @"entrance" : @(ARMapFeatureTypeEntrance),
        @"ticket" : @(ARMapFeatureTypeTicket),
        @"exit" : @(ARMapFeatureTypeExit),
        @"books" : @(ARMapFeatureTypeBooks),
        @"installation" : @(ARMapFeatureTypeInstallation),
        @"transport" : @(ARMapFeatureTypeTransport),
        @"event" : @(ARMapFeatureTypeGenericEvent)
    };
    return [ARValueTransformer enumValueTransformerWithMap:types];
}

- (void)setNilValueForKey:(NSString *)key
{
    if ([key isEqualToString:@"featureType"]) {
        [self setValue:@(ARMapFeatureTypeGenericEvent) forKey:key];
    } else {
        [super setNilValueForKey:key];
    }
}

@end

NSString *NSStringFromARMapFeatureType(enum ARMapFeatureType featureType)
{
    static NSDictionary *mapFeatureToStringDictionary = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        mapFeatureToStringDictionary = @{
           @(ARMapFeatureTypeDefault): @"Default",
           @(ARMapFeatureTypeArtsy): @"Artsy",
           @(ARMapFeatureTypeDrink): @"Drink",
           @(ARMapFeatureTypeCoatCheck): @"CoatCheck",
           @(ARMapFeatureTypeFood): @"Food",
           @(ARMapFeatureTypeLounge): @"Lounge",
           @(ARMapFeatureTypeRestroom): @"Restroom",
           @(ARMapFeatureTypeSaved): @"Saved",
           @(ARMapFeatureTypeSearch): @"Search",
           @(ARMapFeatureTypeVIP): @"VIP",
           @(ARMapFeatureTypeHighlighted): @"Highlighted",
           @(ARMapFeatureTypeGenericEvent): @"Event",
           @(ARMapFeatureTypeEntrance): @"Entrance",
           @(ARMapFeatureTypeTicket): @"Ticket",
           @(ARMapFeatureTypeExit): @"Exit",
           @(ARMapFeatureTypeBooks): @"Books",
           @(ARMapFeatureTypeInstallation): @"Installation",
           @(ARMapFeatureTypeTransport): @"Transport",
           @(ARMapFeatureTypeInfo): @"Info"
        };
    });

    return [mapFeatureToStringDictionary objectForKey:@(featureType)];
}
