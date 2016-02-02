#import "ArtsyAPI+OrderedSets.h"
#import "OrderedSet.h"

#import <ObjectiveSugar/ObjectiveSugar.h>

@implementation OrderedSet

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return @{
        @"orderedSetID" : @"id",
        @"key" : @"key",
        @"name" : @"name",
        @"orderedSetDescription" : @"description",
        @"itemType" : @"item_type"
    };
}

+ (NSArray *)supportedItemTypes
{
    return @[ @"Post", @"Profile", @"Gene", @"Artwork", @"Artist", @"FeaturedLink", @"OrderedSet", @"Sale", @"User", @"PartnerShow", @"Video" ];
}

- (void)getItems:(void (^)(NSArray *items))success
{
    // supported types are in https://github.com/artsy/gravity/blob/master/app/models/domain/ordered_set.rb#L47

    NSAssert([[self class].supportedItemTypes includes:self.itemType], @"Unsupported item type: %@", self.itemType);

    [ArtsyAPI getOrderedSetItems:self.orderedSetID withType:NSClassFromString(self.itemType) success:success failure:^(NSError *error) {
        success(@[]);
    }];
}

- (BOOL)isEqual:(id)object
{
    if ([object isKindOfClass:[self class]]) {
        OrderedSet *orderedSet = object;
        return [orderedSet.orderedSetID isEqualToString:self.orderedSetID];
    }

    return [super isEqual:object];
}

- (NSUInteger)hash
{
    return self.orderedSetID.hash;
}

@end
