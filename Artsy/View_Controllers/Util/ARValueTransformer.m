#import "ARValueTransformer.h"


@implementation ARValueTransformer

+ (NSValueTransformer *)enumValueTransformerWithMap:(NSDictionary *)types
{
    return [self.class reversibleTransformerWithForwardBlock:^(NSString *str) {
        return types[str];
    } reverseBlock:^(NSNumber *type) {
        return [types allKeysForObject:type].lastObject;
    }];
}

+ (NSValueTransformer *)whitespaceTrimmingTransformer
{
    return [self.class transformerWithBlock:^id(NSString *str) {
        return [str stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]];
    }];
}

@end
