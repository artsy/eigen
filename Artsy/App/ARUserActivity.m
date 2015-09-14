#import "ARUserActivity.h"
#import "ARAppDelegate.h"
#import "ARShareableObject.h"
#import "SDWebImageManager.h"
#import "NSDate+DateRange.h"
@import CoreSpotlight;


@implementation ARUserActivity

+ (instancetype)activityWithArtwork:(Artwork *)artwork becomeCurrent:(BOOL)becomeCurrent
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:@"net.artsy.artsy.artwork"];
    activity.title = [artwork name];
    activity.webpageURL = [NSURL URLWithString:[NSString stringWithFormat:@"%@%@", [ARUserActivity landingURL], artwork.publicArtsyPath]];
    activity.userInfo = @{ @"id" : artwork.artworkID };

    if (activity.isSpotlightIndexingAvailable) {
        activity.eligibleForPublicIndexing = YES;
        activity.eligibleForSearch = YES;
        activity.eligibleForHandoff = YES;

        CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];
        attributeSet.title = artwork.title;

        if (artwork.date.length > 0) {
            attributeSet.contentDescription = [NSString stringWithFormat:@"%@, %@\n%@", artwork.artist.name, artwork.date, artwork.medium];
        } else {
            attributeSet.contentDescription = [NSString stringWithFormat:@"%@\n%@", artwork.artist.name, artwork.medium];
        }

        activity.contentAttributeSet = attributeSet;

        NSURL *thumbnailURL = [[artwork defaultImage] urlForThumbnailImage];
        [ARUserActivity loadThumbnail:thumbnailURL forAttributeSet:activity.contentAttributeSet];
    }

    if (becomeCurrent) {
        [activity becomeCurrent];
    }

    return activity;
}

+ (instancetype)activityWithArtist:(Artist *)artist becomeCurrent:(BOOL)becomeCurrent
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:@"net.artsy.artsy.artist"];
    activity.title = [artist name];
    activity.webpageURL = [NSURL URLWithString:[NSString stringWithFormat:@"%@%@", [ARUserActivity landingURL], artist.publicArtsyPath]];
    activity.userInfo = @{ @"id" : artist.artistID };

    if (activity.isSpotlightIndexingAvailable) {
        activity.eligibleForPublicIndexing = YES;
        activity.eligibleForSearch = YES;
        activity.eligibleForHandoff = YES;

        CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];
        attributeSet.title = artist.name;

        if (artist.blurb.length > 0) {
            attributeSet.contentDescription = artist.blurb;
        } else {
            attributeSet.contentDescription = artist.birthday;
        }

        activity.contentAttributeSet = attributeSet;

        NSURL *thumbnailURL = [artist squareImageURL];
        [ARUserActivity loadThumbnail:thumbnailURL forAttributeSet:activity.contentAttributeSet];
    }

    if (becomeCurrent) {
        [activity becomeCurrent];
    }

    return activity;
}

+ (instancetype)activityWithGene:(Gene *)gene becomeCurrent:(BOOL)becomeCurrent
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:@"net.artsy.artsy.gene"];
    activity.title = [gene name];
    activity.webpageURL = [NSURL URLWithString:[NSString stringWithFormat:@"%@%@", [ARUserActivity landingURL], gene.publicArtsyPath]];
    activity.userInfo = @{ @"id" : gene.geneID };

    if (activity.isSpotlightIndexingAvailable) {
        activity.eligibleForPublicIndexing = YES;
        activity.eligibleForSearch = YES;
        activity.eligibleForHandoff = YES;

        CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];
        attributeSet.title = gene.name;

        if (gene.geneDescription.length > 0) {
            attributeSet.contentDescription = gene.geneDescription;
        } else {
            attributeSet.contentDescription = @"Category on Artsy";
        }

        activity.contentAttributeSet = attributeSet;

        NSURL *thumbnailURL = [gene smallImageURL];
        [ARUserActivity loadThumbnail:thumbnailURL forAttributeSet:activity.contentAttributeSet];
    }

    if (becomeCurrent) {
        [activity becomeCurrent];
    }

    return activity;
}

+ (instancetype)activityWithFair:(Fair *)fair withProfile:(Profile *)fairProfile becomeCurrent:(BOOL)becomeCurrent
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:@"net.artsy.artsy.fair"];
    activity.title = [fair name];
    activity.webpageURL = [NSURL URLWithString:[NSString stringWithFormat:@"%@/%@", [ARUserActivity landingURL], fair.fairID]];
    activity.userInfo = @{ @"id" : fair.fairID };

    if (activity.isSpotlightIndexingAvailable) {
        activity.eligibleForPublicIndexing = YES;
        activity.eligibleForSearch = YES;
        activity.eligibleForHandoff = YES;

        CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];
        attributeSet.title = fair.name;
        attributeSet.startDate = fair.startDate;
        attributeSet.endDate = fair.endDate;

        if (fair.location) {
            attributeSet.contentDescription = fair.location;
        } else {
            attributeSet.contentDescription = @"Art fair on Artsy";
        }

        if (fairProfile) {
            NSURL *thumbnailURL = [NSURL URLWithString:fairProfile.iconURL];
            [ARUserActivity loadThumbnail:thumbnailURL forAttributeSet:activity.contentAttributeSet];
        }
    }

    if (becomeCurrent) {
        [activity becomeCurrent];
    }

    return activity;
}

+ (instancetype)activityWithShow:(PartnerShow *)show inFair:(Fair *)fair becomeCurrent:(BOOL)becomeCurrent
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:@"net.artsy.artsy.show"];
    activity.title = [show name];
    activity.webpageURL = [NSURL URLWithString:[NSString stringWithFormat:@"%@%@", [ARUserActivity landingURL], show.publicArtsyPath]];
    activity.userInfo = @{ @"id" : show.showID };

    if (activity.isSpotlightIndexingAvailable) {
        activity.eligibleForPublicIndexing = YES;
        activity.eligibleForSearch = YES;
        activity.eligibleForHandoff = YES;

        CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];
        attributeSet.title = show.name;

        // Add 1 day of grace period before show expires, we may want to adjust this
        activity.expirationDate = [show.endDate dateByAddingTimeInterval:(60 * 60 * 24)];

        NSString *location;
        if (fair && fair.location) {
            location = fair.location;
        } else {
            location = [NSString stringWithFormat:@"%@, %@ %@", show.location.city, show.location.state, show.location.country];
        }
        NSString *dates = [show.startDate ausstellungsdauerToDate:show.endDate];
        attributeSet.contentDescription = [NSString stringWithFormat:@"%@\n%@\n%@", show.partner.name, location, dates];
        attributeSet.startDate = show.startDate;
        attributeSet.endDate = show.endDate;

        activity.contentAttributeSet = attributeSet;

        NSURL *thumbnailURL = [show smallPreviewImageURL];
        [ARUserActivity loadThumbnail:thumbnailURL forAttributeSet:activity.contentAttributeSet];
    }

    if (becomeCurrent) {
        [activity becomeCurrent];
    }

    return activity;
}

+ (void)loadThumbnail:(NSURL *)thumbnailURL forAttributeSet:(CSSearchableItemAttributeSet *)attributeSet
{
    [[SDWebImageManager sharedManager] downloadImageWithURL:thumbnailURL options:0 progress:nil completed:^(UIImage *image, NSError *error, SDImageCacheType cacheType, BOOL finished, NSURL *imageURL) {
        if (image) {
            ar_dispatch_main_queue(^{
                attributeSet.thumbnailData = UIImagePNGRepresentation(image);
            });
        }
    }];
}

- (BOOL)isSpotlightIndexingAvailable
{
    return [self respondsToSelector:@selector(isEligibleForSearch)];
}

+ (NSString *)landingURL
{
    return [[ARAppDelegate sharedInstance] landingURLRepresentation];
}

@end
