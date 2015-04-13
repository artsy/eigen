#import "ARAnnotatedMapView.h"

@interface NAMapView (Testing)
@property (nonatomic, strong) UIImageView *imageView;
- (void)handleDoubleTap:(UIGestureRecognizer *)gestureRecognizer;
- (CGRect)rectAroundPoint:(CGPoint)point atZoomScale:(CGFloat)zoomScale;
- (CGFloat)nextZoomScale;
@end


SpecBegin(ARAnnotatedMapView)

__block ARAnnotatedMapView *mapView;

before(^{
    mapView = [[ARAnnotatedMapView alloc] init];
});

it(@"sets default zoomStep", ^{
    expect(mapView.zoomStep).to.equal(2.5);
});

describe(@"nextZoomScale", ^{
    __block id mock;
    before(^{
        mapView.minimumZoomScale = 0.2f;
        mapView.maximumZoomScale = 4.0f;
        mock = [OCMockObject partialMockForObject:mapView];
        [[[mock stub] andReturnValue:OCMOCK_VALUE(1.1)] annotationZoomScaleThreshold];
    });

    it(@"gives value necessary to show annotations", ^{
        [[[mock stub] andReturnValue:OCMOCK_VALUE(0.2)] zoomScale];
        expect(mapView.nextZoomScale).to.equal(mapView.annotationZoomScaleThreshold);
    });

    it (@"doesn't let you exceed the maxZoomScale", ^{
        [[[mock stub] andReturnValue:OCMOCK_VALUE(3.9)] zoomScale];
        expect(mapView.nextZoomScale).to.equal(mapView.maximumZoomScale);
    });

    it(@"otherwise multiplies the scale by the zoom step", ^{
        [[[mock stub] andReturnValue:OCMOCK_VALUE(1.0)] zoomScale];
        expect(mapView.nextZoomScale).to.equal(mapView.zoomScale * mapView.zoomStep);
    });
});

SpecEnd
