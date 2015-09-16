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


typedef void (^ARSearchAttributesCompletionBlock)(CSSearchableItemAttributeSet *attributeSet);

static void
ARSearchAttributesAddThumbnailData(CSSearchableItemAttributeSet *attributeSet,
                                   NSURL *thumbnailURL,
                                   ARSearchAttributesCompletionBlock completion)
{
    SDWebImageManager *manager = [SDWebImageManager sharedManager];
    [manager downloadImageWithURL:thumbnailURL
                          options:0
                         progress:nil
                        completed:^(UIImage *image, NSError *_, SDImageCacheType __, BOOL ____, NSURL *_____) {
        NSData *data = UIImagePNGRepresentation(image);
        ar_dispatch_main_queue(^{
            if (image) {
                attributeSet.thumbnailData = data;
            }
            completion(attributeSet);
        });
                        }];
}


@implementation ARUserActivity

#pragma mark - CSSearchableItemAttributeSet

+ (void)searchAttributesWithArtwork:(Artwork *)artwork completion:(ARSearchAttributesCompletionBlock)completion;
{
    CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];
    attributeSet.title = artwork.title;

    if (artwork.date.length > 0) {
        attributeSet.contentDescription = [NSString stringWithFormat:@"%@, %@\n%@", artwork.artist.name, artwork.date, artwork.medium];
    } else {
        attributeSet.contentDescription = [NSString stringWithFormat:@"%@\n%@", artwork.artist.name, artwork.medium];
    }

    ARSearchAttributesAddThumbnailData(attributeSet, artwork.defaultImage.urlForThumbnailImage, completion);
}

+ (void)searchAttributesWithArtist:(Artist *)artist completion:(ARSearchAttributesCompletionBlock)completion;
{
    CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];
    attributeSet.title = artist.name;

    if (artist.blurb.length > 0) {
        attributeSet.contentDescription = stringByStrippingMarkdown(artist.blurb);
    } else {
        attributeSet.contentDescription = artist.birthday;
    }

    ARSearchAttributesAddThumbnailData(attributeSet, artist.squareImageURL, completion);
}

+ (void)searchAttributesWithGene:(Gene *)gene completion:(ARSearchAttributesCompletionBlock)completion;
{
    CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];
    attributeSet.title = gene.name;

    if (gene.geneDescription.length > 0) {
        attributeSet.contentDescription = stringByStrippingMarkdown(gene.geneDescription);
    } else {
        attributeSet.contentDescription = @"Category on Artsy";
    }

    ARSearchAttributesAddThumbnailData(attributeSet, gene.smallImageURL, completion);
}

+ (void)searchAttributesWithFair:(Fair *)fair withProfile:(Profile *)fairProfile completion:(ARSearchAttributesCompletionBlock)completion;
{
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
        ARSearchAttributesAddThumbnailData(attributeSet, [NSURL URLWithString:fairProfile.iconURL], completion);
    } else {
        completion(attributeSet);
    }
}

+ (void)searchAttributesWithShow:(PartnerShow *)show inFair:(Fair *)fair completion:(ARSearchAttributesCompletionBlock)completion;
{
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

    ARSearchAttributesAddThumbnailData(attributeSet, show.smallPreviewImageURL, completion);
}

#pragma mark - ARUserActivity

+ (void)activityWithArtwork:(Artwork *)artwork completion:(ARUserActivityCompletionBlock)completion;
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:ARUserActivityTypeArtwork];
    activity.title = artwork.name;
    activity.webpageURL = [NSURL URLWithString:[NSString stringWithFormat:@"%@%@", [ARUserActivity landingURL], artwork.publicArtsyPath]];
    activity.userInfo = @{@"id" : artwork.artworkID};

    if (ARUserActivity.isSpotlightIndexingAvailable) {
        activity.eligibleForPublicIndexing = YES;
        activity.eligibleForSearch = YES;
        activity.eligibleForHandoff = YES;

        [self searchAttributesWithArtwork:artwork completion:^(CSSearchableItemAttributeSet *attributeSet) {
            activity.contentAttributeSet = attributeSet;
            completion(activity);
        }];
    } else {
        completion(activity);
    }
}

+ (void)activityWithArtist:(Artist *)artist completion:(ARUserActivityCompletionBlock)completion;
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:ARUserActivityTypeArtist];
    activity.title = artist.name;
    activity.webpageURL = [NSURL URLWithString:[NSString stringWithFormat:@"%@%@", [ARUserActivity landingURL], artist.publicArtsyPath]];
    activity.userInfo = @{@"id" : artist.artistID};

    if (ARUserActivity.isSpotlightIndexingAvailable) {
        activity.eligibleForPublicIndexing = YES;
        activity.eligibleForSearch = YES;
        activity.eligibleForHandoff = YES;

        [self searchAttributesWithArtist:artist completion:^(CSSearchableItemAttributeSet *attributeSet) {
            activity.contentAttributeSet = attributeSet;
            completion(activity);
        }];
    } else {
        completion(activity);
    }
}

+ (void)activityWithGene:(Gene *)gene completion:(ARUserActivityCompletionBlock)completion;
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:ARUserActivityTypeGene];
    activity.title = gene.name;
    activity.webpageURL = [NSURL URLWithString:[NSString stringWithFormat:@"%@%@", [ARUserActivity landingURL], gene.publicArtsyPath]];
    activity.userInfo = @{@"id" : gene.geneID};

    if (ARUserActivity.isSpotlightIndexingAvailable) {
        activity.eligibleForPublicIndexing = YES;
        activity.eligibleForSearch = YES;
        activity.eligibleForHandoff = YES;

        [self searchAttributesWithGene:gene completion:^(CSSearchableItemAttributeSet *attributeSet) {
            activity.contentAttributeSet = attributeSet;
            completion(activity);
        }];
    } else {
        completion(activity);
    }
}

+ (void)activityWithFair:(Fair *)fair withProfile:(Profile *)fairProfile completion:(ARUserActivityCompletionBlock)completion;
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:ARUserActivityTypeFair];
    activity.title = fair.name;
    activity.webpageURL = [NSURL URLWithString:[NSString stringWithFormat:@"%@/%@", [ARUserActivity landingURL], fair.fairID]];
    activity.userInfo = @{@"id" : fair.fairID};

    if (ARUserActivity.isSpotlightIndexingAvailable) {
        activity.eligibleForPublicIndexing = YES;
        activity.eligibleForSearch = YES;
        activity.eligibleForHandoff = YES;

        [self searchAttributesWithFair:fair withProfile:fairProfile completion:^(CSSearchableItemAttributeSet *attributeSet) {
            activity.contentAttributeSet = attributeSet;
            completion(activity);
        }];
    } else {
        completion(activity);
    }
}

+ (void)activityWithShow:(PartnerShow *)show inFair:(Fair *)fair completion:(ARUserActivityCompletionBlock)completion;
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:ARUserActivityTypeShow];
    activity.title = show.name;
    activity.webpageURL = [NSURL URLWithString:[NSString stringWithFormat:@"%@%@", [ARUserActivity landingURL], show.publicArtsyPath]];
    activity.userInfo = @{@"id" : show.showID};

    if (ARUserActivity.isSpotlightIndexingAvailable) {
        activity.eligibleForPublicIndexing = YES;
        activity.eligibleForSearch = YES;
        activity.eligibleForHandoff = YES;

        [self searchAttributesWithShow:show inFair:fair completion:^(CSSearchableItemAttributeSet *attributeSet) {
            activity.contentAttributeSet = attributeSet;
            completion(activity);
        }];
    } else {
        completion(activity);
    }
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
