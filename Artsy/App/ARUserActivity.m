#import "ARUserActivity.h"
#import "ARAppDelegate.h"
#import "ARShareableObject.h"
#import "SDWebImageManager.h"
@import CoreSpotlight;


@implementation ARUserActivity

+ (instancetype)activityWithArtwork:(Artwork *)artwork becomeCurrent:(BOOL)becomeCurrent
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:@"net.artsy.artwork"];
    activity.title = [artwork name];

    activity.eligibleForPublicIndexing = YES;
    activity.eligibleForSearch = YES;
    activity.eligibleForHandoff = YES;
    activity.webpageURL = [NSURL URLWithString:[NSString stringWithFormat:@"%@%@", [ARUserActivity landingURL], artwork.publicArtsyPath]];

    CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];
    attributeSet.title = artwork.title;

    if (artwork.date.length > 0) {
        attributeSet.contentDescription = [NSString stringWithFormat:@"%@, %@\n%@", artwork.artist.name, artwork.date, artwork.medium];
    } else {
        attributeSet.contentDescription = [NSString stringWithFormat:@"%@\n%@", artwork.artist.name, artwork.medium];
    }

    activity.userInfo = @{ @"id" : artwork.artworkID };

    NSURL *thumbnailURL = [[artwork defaultImage] urlForThumbnailImage];
    [ARUserActivity loadThumbnail:thumbnailURL forAttributeSet:attributeSet withCompletion:^{
        activity.contentAttributeSet = attributeSet;
        if (becomeCurrent) {
            [activity becomeCurrent];
        }
    }];

    return activity;
}

+ (instancetype)activityWithArtist:(Artist *)artist becomeCurrent:(BOOL)becomeCurrent
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:@"net.artsy.artist"];
    activity.title = [artist name];

    activity.eligibleForPublicIndexing = YES;
    activity.eligibleForSearch = YES;
    activity.eligibleForHandoff = YES;
    activity.webpageURL = [NSURL URLWithString:[NSString stringWithFormat:@"%@%@", [ARUserActivity landingURL], artist.publicArtsyPath]];

    CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];
    attributeSet.title = artist.name;
    if (artist.blurb.length > 0) {
        attributeSet.contentDescription = artist.blurb;
    } else {
        attributeSet.contentDescription = artist.birthday;
    }

    activity.userInfo = @{ @"id" : artist.artistID };

    NSURL *thumbnailURL = [artist squareImageURL];
    [ARUserActivity loadThumbnail:thumbnailURL forAttributeSet:attributeSet withCompletion:^{
        activity.contentAttributeSet = attributeSet;
        if (becomeCurrent) {
            [activity becomeCurrent];
        }
    }];

    return activity;
}

+ (instancetype)activityWithGene:(Gene *)gene becomeCurrent:(BOOL)becomeCurrent
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:@"net.artsy.gene"];
    activity.title = [gene name];

    activity.eligibleForPublicIndexing = YES;
    activity.eligibleForSearch = YES;
    activity.eligibleForHandoff = YES;
    activity.webpageURL = [NSURL URLWithString:[NSString stringWithFormat:@"%@%@", [ARUserActivity landingURL], gene.publicArtsyPath]];

    CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];
    attributeSet.title = gene.name;

    if (gene.geneDescription.length > 0) {
        attributeSet.contentDescription = gene.geneDescription;
    } else {
        attributeSet.contentDescription = @"Category on Artsy";
    }

    activity.userInfo = @{ @"id" : gene.geneID };

    NSURL *thumbnailURL = [gene smallImageURL];
    [ARUserActivity loadThumbnail:thumbnailURL forAttributeSet:attributeSet withCompletion:^{
        activity.contentAttributeSet = attributeSet;
        if (becomeCurrent) {
            [activity becomeCurrent];
        }
    }];

    return activity;
}

+ (instancetype)activityWithFair:(Fair *)fair andProfile:(Profile *)fairProfile becomeCurrent:(BOOL)becomeCurrent
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:@"net.artsy.fair"];
    activity.title = [fair name];

    activity.eligibleForPublicIndexing = YES;
    activity.eligibleForSearch = YES;
    activity.eligibleForHandoff = YES;
    activity.webpageURL = [NSURL URLWithString:[NSString stringWithFormat:@"%@/%@", [ARUserActivity landingURL], fair.fairID]];

    CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];
    attributeSet.title = fair.name;

    if (fair.location) {
        attributeSet.contentDescription = fair.location;
    } else {
        attributeSet.contentDescription = @"Art fair on Artsy";
    }

    activity.userInfo = @{ @"id" : fair.fairID };

    if (fairProfile) {
        NSURL *thumbnailURL = [NSURL URLWithString:fairProfile.iconURL];
        [ARUserActivity loadThumbnail:thumbnailURL forAttributeSet:attributeSet withCompletion:^{
            activity.contentAttributeSet = attributeSet;
            if (becomeCurrent) {
                [activity becomeCurrent];
            }
        }];
    } else {
        if (becomeCurrent) {
            [activity becomeCurrent];
        }
    }

    return activity;
}

+ (void)loadThumbnail:(NSURL *)thumbnailURL forAttributeSet:(CSSearchableItemAttributeSet *)attributeSet withCompletion:(void (^)())completionHandler
{
    [[SDWebImageManager sharedManager] downloadImageWithURL:thumbnailURL options:0 progress:nil completed:^(UIImage *image, NSError *error, SDImageCacheType cacheType, BOOL finished, NSURL *imageURL) {
        if (image) {
            attributeSet.thumbnailData = UIImagePNGRepresentation(image);
        }
        completionHandler();
    }];
}

- (BOOL)isRunningiOS9
{
    return [self respondsToSelector:@selector(isEligibleForSearch)];
}

+ (NSString *)landingURL
{
    return [[ARAppDelegate sharedInstance] landingURLRepresentation];
}

@end
