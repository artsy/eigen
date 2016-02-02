#import <Foundation/Foundation.h>


@class NAMapView;
@protocol ARTiledImageViewDataSource;


@interface ARFairMapZoomManager : NSObject

- (id)initWithMap:(NAMapView *)map dataSource:(NSObject<ARTiledImageViewDataSource> *)dataSource;

@property (nonatomic, strong, readonly) NAMapView *map;
@property (nonatomic, strong, readonly) NSObject<ARTiledImageViewDataSource> *dataSource;

- (void)setMaxMinZoomScalesForCurrentBounds;
- (void)zoomToFitAnimated:(BOOL)animate;

@end
