#import "ARFairMapAnnotation.h"

@interface ARFairMapAnnotationCallOutView : UIView

- (id)initOnMapView:(NAMapView *)mapView fair:(Fair *)fair;

@property (nonatomic, strong, readonly) Fair *fair;

@property(readwrite, nonatomic, strong) ARFairMapAnnotation *annotation;

@end