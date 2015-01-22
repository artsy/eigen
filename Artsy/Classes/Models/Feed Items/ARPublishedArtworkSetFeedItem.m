#import "ARPublishedArtworkSetFeedItem.h"

@implementation ARPublishedArtworkSetFeedItem

+ (NSDictionary *)JSONKeyPathsByPropertyKey {
    return [super.JSONKeyPathsByPropertyKey mtl_dictionaryByAddingEntriesFromDictionary:@{
            @"artist" : @"_source_artist",
            @"artworks" : @"artworks",
            @"gene" : @"_source_gene"
    }];
}

+ (NSValueTransformer *)artworksJSONTransformer {
    return [MTLValueTransformer mtl_JSONArrayTransformerWithModelClass:[Artwork class]];
}

+ (NSValueTransformer *)artistJSONTransformer {
    return [MTLValueTransformer mtl_JSONDictionaryTransformerWithModelClass:[Artist class]];
}

+ (NSValueTransformer *)geneJSONTransformer {
    return [MTLValueTransformer mtl_JSONDictionaryTransformerWithModelClass:[Gene class]];
}


+ (NSString *)cellIdentifier {
    return @"PublishedArtworkSetCellIdentifier";
}

- (NSString *)entityName {
    return self.artist ? self.artist.name : self.gene.name;
}

- (NSString *)description {
    return [NSString stringWithFormat:@"FeedItem - Published Artworks ( %@ published %@ artworks ) ", self.artist.name, @(self.artworks.count) ];
}

- (NSString *)localizedStringForActivity {
    return NSLocalizedString(@"Followed Artist", @"Followed Artist text for Feed Item");
}
@end
