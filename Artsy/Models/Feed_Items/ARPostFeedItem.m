#import "ARPostFeedItem.h"

#import "Artwork.h"
#import "ArtsyAPI+Posts.h"
#import "ContentLink.h"
#import "PostImage.h"
#import "Profile.h"

#import "ARTwoWayDictionaryTransformer.h"

@implementation ARPostFeedItem

+ (NSDictionary *)JSONKeyPathsByPropertyKey
{
    return [super.JSONKeyPathsByPropertyKey mtl_dictionaryByAddingEntriesFromDictionary:@{
        @"postID" : @"id",
        @"bodyHTML" : @"body",
        @"title" : @"title",
        @"type" : @"layout",
        @"profile" : @"profile",
        @"artworks" : @"artworks",
        @"contentLinks" : @"content_links",
        @"postImages" : @"post_images",
        @"feedTimestamp" : @"created_at",
        @"shareableImageURL" : @"shareable_image_url"
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

+ (NSValueTransformer *)postImagesJSONTransformer
{
    return [MTLValueTransformer mtl_JSONArrayTransformerWithModelClass:[PostImage class]];
}

+ (NSValueTransformer *)contentLinksJSONTransformer
{
    return [MTLValueTransformer mtl_JSONArrayTransformerWithModelClass:[ContentLink class]];
}

+ (NSValueTransformer *)bodyJSONTransformer
{
    return [MTLValueTransformer transformerWithBlock:^id(id str) {
        return [[str stringByReplacingOccurrencesOfString:@"\n" withString:@" "]
                stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]];
    }];
}

+ (NSValueTransformer *)typeJSONTransformer
{
    return [ARTwoWayDictionaryTransformer reversibleTransformerWithDictionary:@{
        @"singlecolumn" : @(ARPostTypeSingleColumn),
        @"twocolumn" : @(ARPostTypeTwoColumn),
        @"textonly" : @(ARPostTypeTextOnly)
    }];
}

+ (NSString *)cellIdentifier
{
    return @"PostCellIdentifier";
}

- (NSInteger)attachmentCount
{
    //TODO: write fold for primitives
    NSInteger count = 0;
    for (NSArray *arr in @[ self.artworks, self.postImages, self.contentLinks ]) {
        if (arr) {
            count += arr.count;
        }
    }
    return count;
}

- (NSArray *)allAttachments
{
    NSMutableArray *ret = [[NSMutableArray alloc] init];
    for (NSArray *arr in @[ self.artworks, self.postImages, self.contentLinks ]) {
        if (arr) {
            [ret addObjectsFromArray:arr];
        }
    }
    return ret;
}

- (NSString *)publicURL
{
    return [NSString stringWithFormat:@"http://art.sy/%@/post/%@", self.profile.profileID, self.postID];
}

- (NSArray *)dataForActivities
{
    return @[ self ];
}

- (id)activityViewController:(UIActivityViewController *)activityViewController itemForActivityType:(NSString *)activityType
{
    if (self.profile && self.title && ![self.title isEqualToString:@""]) {
        return [NSString stringWithFormat:@"%@: %@ via @artsy %@", self.profile.profileName, self.title, self.publicURL];

    } else if (self.profile) {
        return [NSString stringWithFormat:@"%@ on @artsy %@", self.profile.profileName, self.publicURL];

    } else {
        //TODO: this case exists in Gravity's code, but is there any way to
        // generate a link to an authorless post? Gravity would choke here
        return @"";
    }
}

- (id)activityViewControllerPlaceholderItem:(UIActivityViewController *)activityViewController
{
    return @"";
}

- (NSString *)description
{
    return [NSString stringWithFormat:@"FeedItem - Post ( %@ by %@ ) ", _title, self.profile.profileID];
}

- (NSString *)localizedStringForActivity
{
    return NSLocalizedString(@"Posted", @"Posted a post header text for Feed Item");
}

- (BOOL)hasTitle
{
    return (_title && ![_title isEqualToString:@""]);
}

- (void)updatePost:(void (^)(BOOL updateSuccessful))success
{
    [ArtsyAPI getPostForPostID:_postID success:^(id post) {
        [self mergeValuesForKeysFromModel:post];
        success(YES);

    } failure:^(NSError *error) {
        success(NO);
    }];
}

- (NSString *)imageURL
{
    NSString *imageURL = self.shareableImageURL;
    if (!imageURL && self.profile) {
        imageURL = self.profile.iconURL;
    }
    return imageURL;
}

@end
