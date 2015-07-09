#import "ARAnnotatedMapView.h"
#import "ARFairMapAnnotationView.h"


@interface ARFairShowMapper : NSObject

- (id)initWithMapView:(ARAnnotatedMapView *)mapView map:(Map *)map imageSize:(CGSize)imageSize;

@property (readonly, nonatomic, strong) ARAnnotatedMapView *mapView;
@property (readonly, nonatomic, copy) NSSet *shows;
@property (readonly, nonatomic, strong) Map *map;
@property (readwrite, nonatomic, copy) NSSet *favoritedPartnerIDs;
@property (readwrite, nonatomic, assign) BOOL expandAnnotations;

- (void)setupMapFeatures;
- (void)addShows:(NSSet *)shows;
- (void)mapZoomLevelChanged:(CGFloat)zoomLevel;

- (void)zoomToPoint:(MapPoint *)point animated:(BOOL)animated;
- (void)zoomToFitPoints:(NSArray *)points animated:(BOOL)animated;
- (void)selectPartnerShow:(PartnerShow *)partnerShow animated:(BOOL)animated;
- (void)selectPartnerShows:(NSArray *)partnerShows animated:(BOOL)animated;
- (void)zoomToFitPartners:(NSArray *)partners animated:(BOOL)animated;
- (void)zoomToFitPartnerShows:(NSArray *)partnerShows animated:(BOOL)animated;
- (void)zoomToFitFavoritePartners:(BOOL)animated;

- (NSArray *)mapFeatureViewsForShows:(NSArray *)shows;

@end
