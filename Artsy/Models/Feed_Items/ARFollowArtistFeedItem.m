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
    //    NSString *twitterKey = @"com.apple.UIKit.activity.PostToTwitter";
    //    if ([activityType isEqualToString:twitterKey]) {
    //        return [NSString stringWithFormat:@"%@ on @artsy %@", self.artist.name, self.artist.publicURL];
    //
    //    } else {
    //        return [NSString stringWithFormat:@"Check out this amazing artist I found on Artsy, %@. Isn't he just great? You can see his works at %@", self.artist.name, self.artist.publicURL];
    //    }
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
