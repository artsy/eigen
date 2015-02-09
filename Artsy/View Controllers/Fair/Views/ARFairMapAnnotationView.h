#import "MapFeature.h"
#import "ARFairMapAnnotation.h"

@interface ARFairMapAnnotationView : UIButton

- (id)initWithMapView:(NAMapView *)mapView forAnnotation:(ARFairMapAnnotation *)annotation;
- (CGRect)boundingFrame;
- (void)reduceToPoint;
- (void)expandToFull;
- (void)updatePosition;

@property(nonatomic, assign) enum ARMapFeatureType mapFeatureType;
@property(nonatomic, readwrite, copy) NSString *href;
@property(nonatomic, readonly, assign) BOOL reducedToPoint;
@property(nonatomic, readonly, getter=isUserInteractionAlwaysEnabled) BOOL userInteractionAlwaysEnabled;
@property(nonatomic, readonly) ARFairMapAnnotation *annotation;
@property(nonatomic, readonly) NAMapView *mapView;
@property(nonatomic, readwrite, strong) NSString *displayTitle;
@end
