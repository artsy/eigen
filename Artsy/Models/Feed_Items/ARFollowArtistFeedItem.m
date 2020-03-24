#import "ARFollowArtistFeedItem.h"


@implementation ARFollowArtistFeedItem

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return [super.JSONKeyPathsByPropertyKey mtl_dictionaryByAddingEntriesFromDictionary:@{
        @"artist" : @"artist",
        @"feedTimestamp" : @"created_at",
        @"artworks" : @"artworks",
        @"profile" : @"profile"
    }];
}


+ (NSValueTransformer *)artworksJSONTransformer
{
    return [MTLValueTransformer mtl_JSONArrayTransformerWithModelClass:[Artwork class]];
}

+ (NSValueTransformer *)profileJSONTransformer
{
    return [MTLValueTransformer mtl_JSONDictionaryTransformerWithModelClass:[Profile class]];
}

+ (NSValueTransformer *)artistJSONTransformer
{
    return [MTLValueTransformer mtl_JSONDictionaryTransformerWithModelClass:[Artist class]];
}

+ (NSString *)cellIdentifier
{
    return @"FollowArtistCellIdentifier";
}

- (NSArray *)dataForActivities
{
    return @[ self ];
}

- (id)activityViewController:(UIActivityViewController *)activityViewController itemForActivityType:(NSString *)activityType
{
    return nil;
}

- (id)activityViewControllerPlaceholderItem:(UIActivityViewController *)activityViewController
{
    return @"";
}

- (NSString *)description
{
    return [NSString stringWithFormat:@"FeedItem - Follow Artist ( %@ followed %@ ) ", self.profile.profileID, self.artist.name];
}

- (NSString *)localizedStringForActivity
{
    return NSLocalizedString(@"Followed", @"Followed Artist text for Feed Item");
}

@end
