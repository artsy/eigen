#import "ARUserActivity.h"

@import CoreSpotlight;


NSString *const ARUserActivityTypeArtwork = @"net.artsy.artsy.artwork";
NSString *const ARUserActivityTypeArtist = @"net.artsy.artsy.artist";
NSString *const ARUserActivityTypeGene = @"net.artsy.artsy.gene";
NSString *const ARUserActivityTypeFair = @"net.artsy.artsy.fair";
NSString *const ARUserActivityTypeShow = @"net.artsy.artsy.show";


@implementation ARUserActivity

// Do NOT assign a relatedUniqueIdentifier to the attribute set when combining with a user activity.
// This needs to be done because of: https://forums.developer.apple.com/message/28220#28220
+ (instancetype)activityForEntity:(id<ARSpotlightMetadataProvider>)entity;
{
    NSString *type = nil;
    if ([entity isKindOfClass:Artwork.class]) {
        type = ARUserActivityTypeArtwork;
    } else if ([entity isKindOfClass:Artist.class]) {
        type = ARUserActivityTypeArtist;
    } else if ([entity isKindOfClass:Gene.class]) {
        type = ARUserActivityTypeGene;
    } else if ([entity isKindOfClass:PartnerShow.class]) {
        type = ARUserActivityTypeShow;
    } else if ([entity isKindOfClass:Fair.class]) {
        type = ARUserActivityTypeFair;
    }
    NSParameterAssert(type);

    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:type];
    activity.title = entity.name;
    activity.webpageURL = [ARSpotlight webpageURLForEntity:entity];
    activity.userInfo = @{ @"id": entity.publicArtsyID };

    if ([ARSpotlight isSpotlightAvailable]) {
        activity.eligibleForPublicIndexing = YES;
        activity.eligibleForSearch = YES;
        activity.eligibleForHandoff = YES;

        activity.contentAttributeSet = [ARSpotlight searchAttributesForEntity:entity
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
