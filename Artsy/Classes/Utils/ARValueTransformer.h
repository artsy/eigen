@import Mantle;

@interface ARValueTransformer : MTLValueTransformer

+ (instancetype)enumValueTransformerWithMap:(NSDictionary *)types;
+ (instancetype)whitespaceTrimmingTransformer;

@end
