#import "ARUserActivity.h"
#import "ARRouter.h"
#import "ARShareableObject.h"
#import "SDWebImageManager.h"
#import "NSDate+DateRange.h"
#import <MMMarkdown/MMMarkdown.h>
@import CoreSpotlight;

NSString *stringByStrippingMarkdown(NSString *markdownString);

static NSString *const ARUserActivityTypeArtwork = @"net.artsy.artsy.artwork";
static NSString *const ARUserActivityTypeArtist = @"net.artsy.artsy.artist";
static NSString *const ARUserActivityTypeGene = @"net.artsy.artsy.gene";
static NSString *const ARUserActivityTypeFair = @"net.artsy.artsy.fair";
static NSString *const ARUserActivityTypeShow = @"net.artsy.artsy.show";


@implementation ARUserActivity

+ (instancetype)activityWithArtwork:(Artwork *)artwork becomeCurrent:(BOOL)becomeCurrent
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:ARUserActivityTypeArtwork];
    activity.title = artwork.name;
    activity.webpageURL = [NSURL URLWithString:[NSString stringWithFormat:@"%@%@", [ARUserActivity landingURL], artwork.publicArtsyPath]];
    activity.userInfo = @{ @"id" : artwork.artworkID };

    if (ARUserActivity.isSpotlightIndexingAvailable) {
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
        // because we cannot call -becomeCurrent before the thumbnail is loaded, this method will call it:
        [activity loadThumbnail:thumbnailURL andBecomeCurrent:becomeCurrent];
    } else if (becomeCurrent) {
        [activity becomeCurrent];
    }

    return activity;
}

+ (instancetype)activityWithArtist:(Artist *)artist becomeCurrent:(BOOL)becomeCurrent
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:ARUserActivityTypeArtist];
    activity.title = artist.name;
    activity.webpageURL = [NSURL URLWithString:[NSString stringWithFormat:@"%@%@", [ARUserActivity landingURL], artist.publicArtsyPath]];
    activity.userInfo = @{ @"id" : artist.artistID };

    if (ARUserActivity.isSpotlightIndexingAvailable) {
        activity.eligibleForPublicIndexing = YES;
        activity.eligibleForSearch = YES;
        activity.eligibleForHandoff = YES;

        CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];
        attributeSet.title = artist.name;

        if (artist.blurb.length > 0) {
            attributeSet.contentDescription = stringByStrippingMarkdown(artist.blurb);
        } else {
            attributeSet.contentDescription = artist.birthday;
        }

        activity.contentAttributeSet = attributeSet;

        NSURL *thumbnailURL = [artist squareImageURL];
        [activity loadThumbnail:thumbnailURL andBecomeCurrent:becomeCurrent];
    } else if (becomeCurrent) {
        [activity becomeCurrent];
    }

    return activity;
}

+ (instancetype)activityWithGene:(Gene *)gene becomeCurrent:(BOOL)becomeCurrent
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:ARUserActivityTypeGene];
    activity.title = gene.name;
    activity.webpageURL = [NSURL URLWithString:[NSString stringWithFormat:@"%@%@", [ARUserActivity landingURL], gene.publicArtsyPath]];
    activity.userInfo = @{ @"id" : gene.geneID };

    if (ARUserActivity.isSpotlightIndexingAvailable) {
        activity.eligibleForPublicIndexing = YES;
        activity.eligibleForSearch = YES;
        activity.eligibleForHandoff = YES;

        CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];
        attributeSet.title = gene.name;

        if (gene.geneDescription.length > 0) {
            attributeSet.contentDescription = stringByStrippingMarkdown(gene.geneDescription);
        } else {
            attributeSet.contentDescription = @"Category on Artsy";
        }

        activity.contentAttributeSet = attributeSet;

        NSURL *thumbnailURL = [gene smallImageURL];
        [activity loadThumbnail:thumbnailURL andBecomeCurrent:becomeCurrent];
    } else if (becomeCurrent) {
        [activity becomeCurrent];
    }

    return activity;
}

+ (instancetype)activityWithFair:(Fair *)fair withProfile:(Profile *)fairProfile becomeCurrent:(BOOL)becomeCurrent
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:ARUserActivityTypeFair];
    activity.title = fair.name;
    activity.webpageURL = [NSURL URLWithString:[NSString stringWithFormat:@"%@/%@", [ARUserActivity landingURL], fair.fairID]];
    activity.userInfo = @{ @"id" : fair.fairID };

    if (ARUserActivity.isSpotlightIndexingAvailable) {
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
            [activity loadThumbnail:thumbnailURL andBecomeCurrent:becomeCurrent];
        }
    } else if (becomeCurrent) {
        [activity becomeCurrent];
    }

    return activity;
}

+ (instancetype)activityWithShow:(PartnerShow *)show inFair:(Fair *)fair becomeCurrent:(BOOL)becomeCurrent
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:ARUserActivityTypeShow];
    activity.title = show.name;
    activity.webpageURL = [NSURL URLWithString:[NSString stringWithFormat:@"%@%@", [ARUserActivity landingURL], show.publicArtsyPath]];
    activity.userInfo = @{ @"id" : show.showID };

    if (ARUserActivity.isSpotlightIndexingAvailable) {
        activity.eligibleForPublicIndexing = YES;
        activity.eligibleForSearch = YES;
        activity.eligibleForHandoff = YES;

        CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];
        attributeSet.title = show.name;

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
        [activity loadThumbnail:thumbnailURL andBecomeCurrent:becomeCurrent];
    } else if (becomeCurrent) {
        [activity becomeCurrent];
    }

    return activity;
}

- (void)loadThumbnail:(NSURL *)thumbnailURL andBecomeCurrent:(BOOL)becomeCurrent
{
    [[SDWebImageManager sharedManager] downloadImageWithURL:thumbnailURL options:0 progress:nil completed:^(UIImage *image, NSError *error, SDImageCacheType cacheType, BOOL finished, NSURL *imageURL) {
            ar_dispatch_main_queue(^{
                if (image) {
                    self.contentAttributeSet.thumbnailData = UIImagePNGRepresentation(image);
                }
                if (becomeCurrent) {
                    [self becomeCurrent];
                }
            });
    }];
}

+ (BOOL)isSpotlightIndexingAvailable
{
    return [NSUserActivity instancesRespondToSelector:@selector(isEligibleForSearch)];
}

+ (NSString *)landingURL
{
    return [[ARRouter baseWebURL] absoluteString];
}

NSString *stringByStrippingMarkdown(NSString *markdownString)
{
    NSError *error = nil;
    NSString *renderedString = [MMMarkdown HTMLStringWithMarkdown:markdownString error:&error];
    NSDictionary *importParams = @{NSDocumentTypeDocumentAttribute : NSHTMLTextDocumentType};
    NSData *stringData = [renderedString dataUsingEncoding:NSUnicodeStringEncoding];
    NSAttributedString *attributedString = [[NSAttributedString alloc] initWithData:stringData options:importParams documentAttributes:NULL error:&error];
    if (error) {
        return nil;
    }

    return attributedString.string;
}

@end
