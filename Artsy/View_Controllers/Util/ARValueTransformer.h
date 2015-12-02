#import <Mantle/Mantle.h>


@interface ARValueTransformer : MTLValueTransformer

+ (NSValueTransformer *)enumValueTransformerWithMap:(NSDictionary *)types;
+ (NSValueTransformer *)whitespaceTrimmingTransformer;

@end
