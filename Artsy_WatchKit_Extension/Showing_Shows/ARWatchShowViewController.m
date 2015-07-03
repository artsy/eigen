#import "ARWatchShowViewController.h"
#import "WatchShow.h"
#import "WKInterfaceImage+Async.h"


@interface ARWatchShowViewController ()
@property (readonly, nonatomic, strong) WatchShow *show;
@end


@implementation ARWatchShowViewController

- (void)awakeWithContext:(id)context
{
    _show = context;

    self.galleryName.text = self.show.parterName.uppercaseString;
    self.showTitle.text = self.show.title;

    self.showLocation.text = self.show.locationAndDistance;
    self.showAusstellungsdauer.text = self.show.ausstellungsdauer;
    [self.thumbnail ar_asyncSetImageURL:self.show.thumbnailImageURL];

    CLLocationCoordinate2D location = self.show.location.coordinate;
    CGFloat miles = 3;
    CGFloat scalingFactor = ABS((cos(2 * M_PI * location.latitude / 360.0)));
    MKCoordinateRegion region = MKCoordinateRegionMake(location, MKCoordinateSpanMake(miles / 69.0, miles / (scalingFactor * 69.0)));

    // Data from Artsy can be wrong, this causes an exception in the map preview
    // so hide the map if we can't show it.

    @try {
        [self.mapPreview setRegion:region];
        [self.mapPreview addAnnotation:location withPinColor:WKInterfaceMapPinColorPurple];
    }
    @catch (NSException *exception) {
        [self.mapPreview setHidden:YES];
    }
}

@end
