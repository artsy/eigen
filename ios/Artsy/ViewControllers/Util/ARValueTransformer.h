#import <Mantle/Mantle.h>


@interface ARValueTransformer : MTLValueTransformer

+ (instancetype)enumValueTransformerWithMap:(NSDictionary *)types;
+ (instancetype)whitespaceTrimmingTransformer;

@end
