#import "ARUserActivity.h"

#import "Artist.h"
#import "Artwork.h"
#import "Fair.h"
#import "Gene.h"
#import "PartnerShow.h"
#import "Partner.h"
#import "Sale.h"
#import "Location.h"

#import "ARDispatchManager.h"

#import <CoreSpotlight/CoreSpotlight.h>
#import <MapKit/MapKit.h>

NSString *const ARUserActivityTypeArtwork = @"net.artsy.artsy.artwork";
NSString *const ARUserActivityTypeArtist = @"net.artsy.artsy.artist";
NSString *const ARUserActivityTypeGene = @"net.artsy.artsy.gene";
NSString *const ARUserActivityTypeFair = @"net.artsy.artsy.fair";
NSString *const ARUserActivityTypeShow = @"net.artsy.artsy.show";
NSString *const ARUserActivityTypeSale = @"net.artsy.artsy.sale";


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
    } else if ([entity isKindOfClass:Sale.class]) {
        type = ARUserActivityTypeSale;
    }

    NSParameterAssert(type);

    ARUserActivity *activity = [[ARUserActivity alloc] initWithActivityType:type];
    activity.title = entity.name;
    activity.webpageURL = [ARSpotlight webpageURLForEntity:entity];
    activity.userInfo = @{@"id" : entity.publicArtsyID};

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

    if (type == ARUserActivityTypeShow) {
        PartnerShow *show = (id)entity;
//        BOOL supportsMapItems = [activity respondsToSelector:@selector(setMapItem:)];
        BOOL supportsMapItems = YES;
        if (supportsMapItems && show.location.publiclyViewable) {
            CLLocation *location = show.location.clLocation;
            CLLocationCoordinate2D *coords = malloc(sizeof(CLLocationCoordinate2D));
            coords[0] = location.coordinate;

            MKPolygon *polygon = [MKPolygon polygonWithCoordinates:coords count:1];
            MKCoordinateRegion region = MKCoordinateRegionForMapRect(polygon.boundingMapRect);

            MKLocalSearchRequest *request = [[MKLocalSearchRequest alloc] init];
            request.naturalLanguageQuery = show.partner.name;
            request.region = region;

            MKLocalSearch *search = [[MKLocalSearch alloc] initWithRequest:request];
            [search startWithCompletionHandler:^(MKLocalSearchResponse * _Nullable response, NSError * _Nullable error) {
                if (error) { return; }
                // Set the mapItem
//                [activity performSelector:@selector(setMapItem:) withObject:response.mapItems.firstObject afterDelay:0];

            }];

            free(coords);
        }
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
