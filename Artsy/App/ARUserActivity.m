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
    [[SDWebImageManager sharedManager] downloadImageWithURL:thumbnailURL options:0 progress:nil completed:^(UIImage *image, NSError *error, SDImageCacheType cacheType, BOOL finished, NSURL *imageURL) {
        if (image) {
            attributeSet.thumbnailData = UIImagePNGRepresentation(image);
        }
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
    [[SDWebImageManager sharedManager] downloadImageWithURL:thumbnailURL options:0 progress:nil completed:^(UIImage *image, NSError *error, SDImageCacheType cacheType, BOOL finished, NSURL *imageURL) {
        if (image) {
            attributeSet.thumbnailData = UIImagePNGRepresentation(image);
        }
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
    [[SDWebImageManager sharedManager] downloadImageWithURL:thumbnailURL options:0 progress:nil completed:^(UIImage *image, NSError *error, SDImageCacheType cacheType, BOOL finished, NSURL *imageURL) {
        if (image) {
            attributeSet.thumbnailData = UIImagePNGRepresentation(image);
        }
        activity.contentAttributeSet = attributeSet;
        if (becomeCurrent) {
            [activity becomeCurrent];
        }
    }];

    return activity;
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
