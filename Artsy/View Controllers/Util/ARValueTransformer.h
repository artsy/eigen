#import "MTLValueTransformer.h"

@interface ARValueTransformer : MTLValueTransformer

+ (instancetype)enumValueTransformerWithMap:(NSDictionary *)types;
+ (instancetype)whitespaceTrimmingTransformer;

@end
