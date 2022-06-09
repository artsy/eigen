#import "ARUserActivity.h"

#import "Artist.h"
#import "Artwork.h"
#import "Fair.h"
#import "Gene.h"
#import "PartnerShow.h"
#import "Partner.h"
#import "ARRouter.h"
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
+ (instancetype)activityForEntity:(id<ARContinuityMetadataProvider>)entity;
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
    activity.webpageURL =  [[ARRouter baseWebURL] URLByAppendingPathComponent:entity.publicArtsyPath];
    activity.userInfo = @{@"id" : entity.publicArtsyID};
    activity.eligibleForHandoff = YES;

    // Specifically when we have shows, we want to attach location data when it's
    // available to make it show up in recommendations around the OS

    if (type == ARUserActivityTypeShow) {
        PartnerShow *show = (id)entity;
        BOOL supportsMapItems = [activity respondsToSelector:@selector(setMapItem:)];
        if (supportsMapItems && show.location.publiclyViewable) {

            // We have to do a whole song and dance to create a `MKMapItem`
            // so we get our long/lat, then search for the partner name using
            // the mapkit API.

            CLLocation *location = show.location.clLocation;
            CLLocationCoordinate2D coords = location.coordinate;

            MKPolygon *polygon = [MKPolygon polygonWithCoordinates:&coords count:1];
            MKCoordinateRegion region = MKCoordinateRegionForMapRect(polygon.boundingMapRect);

            // Create a request, which I assume uses a remote mapkit API somewhere
            MKLocalSearchRequest *request = [[MKLocalSearchRequest alloc] init];
            request.naturalLanguageQuery = show.partner.name;
            request.region = region;

            MKLocalSearch *search = [[MKLocalSearch alloc] initWithRequest:request];
            [search startWithCompletionHandler:^(MKLocalSearchResponse * _Nullable response, NSError * _Nullable error) {
                if (error) { return; }
                MKMapItem *closest = response.mapItems.firstObject;

                // Set the mapItem dynamically, so we can use Xcode 7 with the iOS9 SDK
                NSMethodSignature *setMapItemSignature = [activity.class instanceMethodSignatureForSelector:@selector(setMapItem:)];
                NSInvocation *setMapItemInvocation = [NSInvocation invocationWithMethodSignature:setMapItemSignature];
                [setMapItemInvocation setSelector:@selector(setMapItem:)];
                [setMapItemInvocation setTarget:activity];
                [setMapItemInvocation setArgument:&closest atIndex:2];
                [setMapItemInvocation invoke];
            }];
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
