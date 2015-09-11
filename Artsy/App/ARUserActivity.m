#import "ARUserActivity.h"
#import "ARAppDelegate.h"
#import "ARShareableObject.h"
@import CoreSpotlight;


@implementation ARUserActivity

+ (instancetype)activityWithArtwork:(Artwork *)artwork
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:@"net.artsy.artwork"];
    activity.title = [artwork name];

    activity.eligibleForPublicIndexing = YES;
    activity.eligibleForSearch = YES;
    activity.eligibleForHandoff = YES;

    activity.webpageURL = [NSURL URLWithString:[NSString stringWithFormat:@"%@%@", [ARUserActivity landingURL], artwork.publicArtsyPath]];

    CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];
    attributeSet.title = artwork.title;

    ar_dispatch_async(^{
        NSURL *thumbnailURL = [[artwork defaultImage] urlForThumbnailImage];
        attributeSet.thumbnailData = [NSData dataWithContentsOfURL:thumbnailURL];
        attributeSet.contentDescription = [NSString stringWithFormat:@"%@, %@\n%@",artwork.artist.name,artwork.date,artwork.medium];
        activity.contentAttributeSet = attributeSet;
        
        activity.userInfo = @{ @"id": artwork.artworkID };
        
        [activity becomeCurrent];
    });

    return activity;
}

+ (instancetype)activityWithArtist:(Artist *)artist
{
    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:@"net.artsy.artist"];
    activity.title = [artist name];

    activity.eligibleForPublicIndexing = YES;
    activity.eligibleForSearch = YES;
    activity.eligibleForHandoff = YES;

    activity.webpageURL = [NSURL URLWithString:[NSString stringWithFormat:@"%@%@", [ARUserActivity landingURL], artist.publicArtsyPath]];

    CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString *)kUTTypeData];
    attributeSet.title = artist.name;

    ar_dispatch_async(^{
        NSURL *thumbnailURL = [artist squareImageURL];
        attributeSet.thumbnailData = [NSData dataWithContentsOfURL:thumbnailURL];
        
        if (artist.blurb.length > 0) {
            attributeSet.contentDescription = artist.blurb;
        } else {
            [NSString stringWithFormat:@"%@",artist.birthday];
        }
        
        activity.contentAttributeSet = attributeSet;
        
        activity.userInfo = @{ @"id": artist.artistID };
        
        [activity becomeCurrent];
    });

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
