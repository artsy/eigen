#import "ARUserActivity.h"
#import "ARSpotlight.h"

@import CoreSpotlight;


NSString *const ARUserActivityTypeArtwork = @"net.artsy.artsy.artwork";
NSString *const ARUserActivityTypeArtist = @"net.artsy.artsy.artist";
NSString *const ARUserActivityTypeGene = @"net.artsy.artsy.gene";
NSString *const ARUserActivityTypeFair = @"net.artsy.artsy.fair";
NSString *const ARUserActivityTypeShow = @"net.artsy.artsy.show";


@implementation ARUserActivity

// Do NOT assign a relatedUniqueIdentifier to the attribute set when combining with a user activity.
// This needs to be done because of: https://forums.developer.apple.com/message/28220#28220

+ (instancetype)activityWithArtwork:(Artwork *)artwork;
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:ARUserActivityTypeArtwork];
    activity.title = artwork.name;
    activity.webpageURL = [ARSpotlight webpageURLForEntity:artwork];
    activity.userInfo = @{@"id" : artwork.artworkID};

    if ([ARSpotlight isSpotlightAvailable]) {
        activity.eligibleForPublicIndexing = YES;
        activity.eligibleForSearch = YES;
        activity.eligibleForHandoff = YES;

        activity.contentAttributeSet = [ARSpotlight searchAttributesWithArtwork:artwork
                                                              includeIdentifier:NO
                                                                     completion:^(CSSearchableItemAttributeSet *attributeSet) {
            [activity updateContentAttributeSet:attributeSet];
        }];
    }

    return activity;
}

+ (instancetype)activityWithArtist:(Artist *)artist;
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:ARUserActivityTypeArtist];
    activity.title = artist.name;
    activity.webpageURL = [ARSpotlight webpageURLForEntity:artist];
    activity.userInfo = @{@"id" : artist.artistID};

    if ([ARSpotlight isSpotlightAvailable]) {
        activity.eligibleForPublicIndexing = YES;
        activity.eligibleForSearch = YES;
        activity.eligibleForHandoff = YES;

        activity.contentAttributeSet = [ARSpotlight searchAttributesWithArtist:artist
                                                             includeIdentifier:NO
                                                                    completion:^(CSSearchableItemAttributeSet *attributeSet) {
            [activity updateContentAttributeSet:attributeSet];
        }];
    }

    return activity;
}

+ (instancetype)activityWithGene:(Gene *)gene;
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:ARUserActivityTypeGene];
    activity.title = gene.name;
    activity.webpageURL = [ARSpotlight webpageURLForEntity:gene];
    activity.userInfo = @{@"id" : gene.geneID};

    if ([ARSpotlight isSpotlightAvailable]) {
        activity.eligibleForPublicIndexing = YES;
        activity.eligibleForSearch = YES;
        activity.eligibleForHandoff = YES;

        activity.contentAttributeSet = [ARSpotlight searchAttributesWithGene:gene
                                                           includeIdentifier:NO
                                                                  completion:^(CSSearchableItemAttributeSet *attributeSet) {
            [activity updateContentAttributeSet:attributeSet];
        }];
    }

    return activity;
}

+ (instancetype)activityWithFair:(Fair *)fair withProfile:(Profile *)fairProfile;
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:ARUserActivityTypeFair];
    activity.title = fair.name;
    activity.webpageURL = [ARSpotlight webpageURLForEntity:fair];
    activity.userInfo = @{@"id" : fair.fairID};

    if ([ARSpotlight isSpotlightAvailable]) {
        activity.eligibleForPublicIndexing = YES;
        activity.eligibleForSearch = YES;
        activity.eligibleForHandoff = YES;

        activity.contentAttributeSet = [ARSpotlight searchAttributesWithFair:fair
                                                                 withProfile:fairProfile
                                                           includeIdentifier:NO
                                                                  completion:^(CSSearchableItemAttributeSet *attributeSet) {
            [activity updateContentAttributeSet:attributeSet];
        }];
    }

    return activity;
}

+ (instancetype)activityWithShow:(PartnerShow *)show inFair:(Fair *)fair;
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:ARUserActivityTypeShow];
    activity.title = show.name;
    activity.webpageURL = [ARSpotlight webpageURLForEntity:show];
    activity.userInfo = @{@"id" : show.showID};

    if ([ARSpotlight isSpotlightAvailable]) {
        activity.eligibleForPublicIndexing = YES;
        activity.eligibleForSearch = YES;
        activity.eligibleForHandoff = YES;

        activity.contentAttributeSet = [ARSpotlight searchAttributesWithShow:show
                                                                      inFair:fair
                                                           includeIdentifier:NO
                                                                  completion:^(CSSearchableItemAttributeSet *attributeSet) {
            [activity updateContentAttributeSet:attributeSet];
        }];
    }

    return activity;
}

- (void)updateContentAttributeSet:(CSSearchableItemAttributeSet *)attributeSet;
{
    ar_dispatch_main_queue(^{
        self.contentAttributeSet = attributeSet;
        self.needsSave = YES;
    });
}

@end
