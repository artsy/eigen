#import <Mantle/Mantle.h>

/**
Provides a reversible Mantle transformer using a dictionary. Keys are JSON values and values are corresponding ObjC values.
*/
@interface ARTwoWayDictionaryTransformer : MTLValueTransformer

+ (instancetype)reversibleTransformerWithDictionary:(NSDictionary *)dictionary;

@end
