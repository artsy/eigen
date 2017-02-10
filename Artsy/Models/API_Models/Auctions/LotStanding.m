#import "LotStanding.h"
#import "SaleArtwork.h"
#import "ARMacros.h"


@implementation LotStanding

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        ar_keypath(LotStanding.new, saleArtwork) : @"sale_artwork",
        ar_keypath(LotStanding.new, isLeading) : @"leading_position"
    };
}

+ (NSValueTransformer *)saleArtworkJSONTransformer
{
    return [MTLValueTransformer mtl_JSONDictionaryTransformerWithModelClass:SaleArtwork.class];
}

+ (NSValueTransformer *)isLeadingJSONTransformer
{
    return [MTLValueTransformer transformerWithBlock:^id(NSDictionary *dictionary) {
        // Transforms a dictionary (nullable) to a true/false value based on if the dictionary is nil.
        return @(dictionary != nil);
    }];
}

@end
