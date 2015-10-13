#import "ARMenuAwareViewController.h"

@class ARTiledImageDataSourceWithImage, ARFairMapZoomManager, ARFairShowMapper, ARFairMapAnnotation, Fair;


@interface ARFairMapViewController : UIViewController <ARMenuAwareViewController>

- (id)initWithFair:(Fair *)fair;
- (id)initWithFair:(Fair *)fair title:(NSString *)title selectedPartnerShows:(NSArray *)selectedPartnerShows;

@property (nonatomic, strong, readonly) Fair *fair;
@property (nonatomic, strong, readonly) ARTiledImageDataSourceWithImage *mapDataSource;
@property (nonatomic, strong, readonly) ARFairMapZoomManager *mapZoomManager;
@property (nonatomic, strong, readonly) ARFairShowMapper *mapShowMapper;

@property (readwrite, nonatomic, assign) BOOL expandAnnotations; // defaults to YES

@property (nonatomic, assign) BOOL titleHidden;

/// Centers the map, with a height to base the logic off ( allowing for parallax )
- (void)centerMap:(CGFloat)heightRatio inFrameOfHeight:(CGFloat)height animated:(BOOL)animated;

/// Shows a callout on the map
- (void)showCalloutForAnnotation:(ARFairMapAnnotation *)annotation animated:(BOOL)animated;

/// Hides an existing callout
- (void)hideCallOut;


@end
