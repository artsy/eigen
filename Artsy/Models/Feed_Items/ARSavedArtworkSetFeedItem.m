#import "ARSavedArtworkSetFeedItem.h"


@implementation ARSavedArtworkSetFeedItem
+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return [super.JSONKeyPathsByPropertyKey mtl_dictionaryByAddingEntriesFromDictionary:@{
        @"profile" : @"profile",
        @"artworks" : @"artworks",
        @"feedTimestamp" : @"created_at"
    }];
}


+ (NSValueTransformer *)profileJSONTransformer
{
    return [MTLValueTransformer mtl_JSONDictionaryTransformerWithModelClass:[Profile class]];
}

+ (NSValueTransformer *)artworksJSONTransformer
{
    return [MTLValueTransformer mtl_JSONArrayTransformerWithModelClass:[Artwork class]];
}

+ (NSString *)cellIdentifier
{
    return @"SavedArtworkSetCellIdentifier";
}

- (NSString *)description
{
    return [NSString stringWithFormat:@"FeedItem - Saved Artworks ( %@ saved %@ artworks ) ", _profile.profileID, @(_artworks.count)];
}

- (NSString *)localizedStringForActivity
{
    return NSLocalizedString(@"Saved", @"Saved Artworks header text for Feed Item");
}

@end
