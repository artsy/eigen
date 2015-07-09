#import "ARAnnotatedMapView.h"


@interface NAMapView (Private)
@property (nonatomic, strong) UIImageView *imageView;
- (void)handleDoubleTap:(UIGestureRecognizer *)gestureRecognizer;
- (CGRect)rectAroundPoint:(CGPoint)point atZoomScale:(CGFloat)zoomScale;
@end


@implementation ARAnnotatedMapView

- (instancetype)init
{
    if (!self) {
        return nil;
    }
    self.zoomStep = 2.5f;
    return self;
}

- (CGFloat)annotationZoomScaleThreshold
{
    return self.minimumZoomScale + (self.maximumZoomScale - self.minimumZoomScale) / 2;
}

- (void)handleDoubleTap:(UIGestureRecognizer *)gestureRecognizer
{
    if (self.zoomScale >= self.maximumZoomScale) {
        [self setZoomScale:self.minimumZoomScale animated:YES];
    } else {
        // the location tapped becomes the new center
        CGPoint tapCenter = [gestureRecognizer locationInView:self.imageView];
        CGRect maxZoomRect = [self rectAroundPoint:tapCenter atZoomScale:self.nextZoomScale];
        [self zoomToRect:maxZoomRect animated:YES];
    }
}

- (CGFloat)nextZoomScale
{
    CGFloat annotationThresholdOrMax = MIN(self.annotationZoomScaleThreshold, self.maximumZoomScale);
    CGFloat scaleTimesStepOrMax = MIN(self.zoomScale * self.zoomStep, self.maximumZoomScale);
    return MAX(annotationThresholdOrMax, scaleTimesStepOrMax);
}

@end
