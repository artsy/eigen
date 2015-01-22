#import "ARFairMapZoomManager.h"
#import <ARTiledImageView/ARTiledImageView.h>

@implementation ARFairMapZoomManager

- (id)initWithMap:(NAMapView *)map dataSource:(NSObject <ARTiledImageViewDataSource> *)dataSource
{
    self = [super init];
    if (!self) { return nil; }

    _map = map;
    _dataSource = dataSource;

    return self;
}

- (void)setMaxMinZoomScalesForCurrentBounds
{
    CGSize boundsSize = self.map.bounds.size;
    CGSize imageSize = [self.dataSource imageSizeForImageView:nil];

    // calculate min/max zoomscale
    CGFloat xScale = boundsSize.width / imageSize.width;    // the scale needed to perfectly fit the image width-wise
    CGFloat yScale = boundsSize.height / imageSize.height;  // the scale needed to perfectly fit the image height-wise
    CGFloat minScale = MAX(xScale, yScale);                 // use minimum of these to allow the image to become fully visible

    CGFloat maxScale = 1.0;

    // don't let minScale exceed maxScale. (If the image is smaller than the screen, we don't want to force it to be zoomed.)
    if (minScale > maxScale) {
        minScale = maxScale;
    }

    self.map.maximumZoomScale = maxScale * 0.6;
    self.map.minimumZoomScale = minScale;
}

- (void)zoomToFitAnimated:(BOOL)animate
{
    [self.map setZoomScale:self.map.minimumZoomScale animated:animate];
}

@end
