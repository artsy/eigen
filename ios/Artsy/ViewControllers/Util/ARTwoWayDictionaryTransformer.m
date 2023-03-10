#import "ARTwoWayDictionaryTransformer.h"


@implementation ARTwoWayDictionaryTransformer

+ (instancetype)reversibleTransformerWithDictionary:(NSDictionary *)dictionary
{
    return [self reversibleTransformerWithForwardBlock:^(NSString *str) {
        return dictionary[str];
    } reverseBlock:^(NSNumber *type) {
        return [dictionary allKeysForObject:type].lastObject;
    }];
}

@end
