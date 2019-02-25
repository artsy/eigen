#import "ARFairShowMapper.h"

#import "Fair.h"
#import "Partner.h"
#import "PartnerShow.h"
#import "PartnerShowFairLocation.h"

#import "ARMacros.h"
#import "ARDispatchManager.h"

#import <ReactiveObjC/ReactiveObjC.h>
#import <ObjectiveSugar/ObjectiveSugar.h>


@interface ARFairShowMapper ()
@property (readwrite, nonatomic, copy) NSSet *highlightedShows;
@property (readwrite, nonatomic, copy) NSSet *shows;
@property (readonly, nonatomic, assign) CGFloat overlappingZoomLevel;
@property (nonatomic, strong) NSMapTable *annotationsToAnnotationViews;
@property (nonatomic, strong) NSMapTable *objectsToAnnotations;
@property (nonatomic, readonly, assign) CGSize imageSize;
@property (nonatomic, readonly, strong) NSMapTable *partnerToShowsMap;
@end


@implementation ARFairShowMapper

- (id)initWithMapView:(ARAnnotatedMapView *)mapView map:(Map *)map imageSize:(CGSize)imageSize
{
    self = [super init];
    if (!self) {
        return nil;
    }

    _mapView = mapView;
    _map = map;
    _overlappingZoomLevel = 0;
    _annotationsToAnnotationViews = [NSMapTable strongToStrongObjectsMapTable];
    _objectsToAnnotations = [NSMapTable strongToStrongObjectsMapTable];
    _imageSize = imageSize;
    _expandAnnotations = YES;

    return self;
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(Fair *)fair change:(NSDictionary *)change context:(void *)context
{
    if ([keyPath isEqualToString:ar_keypath(Fair.new, shows)]) {
        [self addShows:fair.shows];
    }
}

- (void)addShows:(NSSet *)shows
{
    // removed shows?
    if (self.shows) {
        NSMutableSet *showsToRemove = [NSMutableSet setWithSet:self.shows];
        [showsToRemove minusSet:shows];
        [self removeShowAnnotations:showsToRemove];
    }

    // added shows?
    self.shows = shows.copy;
    [self addShowAnnotations:self.shows];
    [self mapZoomLevelChanged:self.overlappingZoomLevel];
    [self rebuildPartnerToShowsMap];
}

- (void)setupMapFeatures
{
    [self.map.features each:^(MapFeature *mapFeature) {
        CGPoint pointOnMap = [mapFeature coordinateOnImage:self.map.image];
        NAAnnotation *annotation = [[ARFairMapAnnotation alloc] initWithPoint:pointOnMap representedObject:mapFeature];
        [self.mapView addAnnotation:annotation animated:NO];
        [self.annotationsToAnnotationViews setObject:annotation.view forKey:annotation];
        [self.objectsToAnnotations setObject:annotation forKey:mapFeature];
    }];
}

- (void)mapZoomLevelChanged:(CGFloat)zoomLevel
{
    if (self.mapView.zoomScale >= self.mapView.annotationZoomScaleThreshold && self.expandAnnotations) {
        [self expandAllAnnotations:zoomLevel];
    } else {
        [self reduceAllAnnotations:zoomLevel];
    }
}

- (void)expandOrReduceAllAnnotations
{
    if (self.mapView.zoomScale >= self.mapView.annotationZoomScaleThreshold) {
        [self expandAllAnnotations];
    } else {
        [self reduceAllAnnotations];
    }
}

- (void)removeShowAnnotations:(NSSet *)shows
{
    [shows each:^(PartnerShow *show) {
        for(MapPoint *mapPoint in show.fairLocation.mapPoints) {
            CGPoint pointOnMap = [mapPoint coordinateOnImage:self.map.image];
            NAAnnotation *existingAnnotation = [self annotationForRepresentedObject:show];
            if (existingAnnotation) {
                if (CGPointEqualToPoint(existingAnnotation.point, pointOnMap)) {
                    [self.mapView removeAnnotation:existingAnnotation];
                }
                [self.annotationsToAnnotationViews removeObjectForKey:existingAnnotation];
                [self.objectsToAnnotations removeObjectForKey:show];
            }
        }
    }];
}

- (void)addShowAnnotations:(NSSet *)shows
{
    [shows each:^(PartnerShow *show) {
        for(MapPoint *mapPoint in show.fairLocation.mapPoints) {
            CGPoint pointOnMap = [mapPoint coordinateOnImage:self.map.image];

            // cache will cause old points to be plotted
            NAAnnotation *existingAnnotation = [self annotationForRepresentedObject:show];
            if (existingAnnotation) {
                if (CGPointEqualToPoint(existingAnnotation.point, pointOnMap)) {
                    continue;
                } else {
                    [self.mapView removeAnnotation:existingAnnotation];
                    [self.annotationsToAnnotationViews removeObjectForKey:existingAnnotation];
                    [self.objectsToAnnotations removeObjectForKey:show];
                }
            }

            NAAnnotation *annotation = [[ARFairMapAnnotation alloc] initWithPoint:pointOnMap representedObject:show];
            [self.mapView addAnnotation:annotation animated:NO];
            [self.annotationsToAnnotationViews setObject:annotation.view forKey:annotation];
            [self.objectsToAnnotations setObject:annotation forKey:show];
        }
    }];
}

- (void)reduceAllAnnotations:(CGFloat)zoomLevel
{
    if (zoomLevel >= self.overlappingZoomLevel) {
        return;
    }

    [self reduceAllAnnotations];
    _overlappingZoomLevel = zoomLevel;
}

- (void)reduceAllAnnotations
{
    for (ARFairMapAnnotationView *annotationView in self.annotationViews) {
        if (annotationView.mapFeatureType != ARMapFeatureTypeDefault) {
            continue;
        }
        annotationView.userInteractionEnabled = NO;
        [annotationView reduceToPoint];
    }
}

- (void)expandAllAnnotations:(CGFloat)zoomLevel
{
    if (zoomLevel <= self.overlappingZoomLevel) {
        return;
    }

    [self expandAllAnnotations];
    _overlappingZoomLevel = zoomLevel;
}

- (void)expandAllAnnotations
{
    for (ARFairMapAnnotationView *annotationView in self.annotationViews) {
        annotationView.userInteractionEnabled = YES;
        [annotationView expandToFull];
    }
}

- (BOOL)showIsSaved:(PartnerShow *)show
{
    return [self.favoritedPartnerIDs containsObject:show.partner.partnerID];
}

- (void)zoomToPoint:(MapPoint *)point animated:(BOOL)animated
{
    CGPoint pointOnMap = [point coordinateOnImage:self.map.image];
    [self.mapView setZoomScale:self.mapView.maximumZoomScale animated:animated];
    [self.mapView centerOnPoint:pointOnMap animated:animated];
}

- (void)zoomToFitPoints:(NSArray *)points animated:(BOOL)animated
{
    if (points.count == 0) {
        return;

    } else if (points.count == 1) {
        [self zoomToPoint:points.firstObject animated:animated];

    } else {
        CGPoint topLeft = CGPointMake(FLT_MAX, FLT_MAX);
        CGPoint bottomRight = CGPointMake(-FLT_MAX, -FLT_MAX);

        for (MapPoint *point in points) {
            CGPoint coordinates = [point coordinateOnImage:self.map.image];

            if (topLeft.x > coordinates.x) {
                topLeft.x = coordinates.x;
            }
            if (topLeft.y > coordinates.y) {
                topLeft.y = coordinates.y;
            }

            if (bottomRight.x < coordinates.x) {
                bottomRight.x = coordinates.x;
            }
            if (bottomRight.y < coordinates.y) {
                bottomRight.y = coordinates.y;
            }
        }

        CGPoint centerPoint = (CGPoint){
            .x = topLeft.x + ((bottomRight.x - topLeft.x) / 2),
            .y = topLeft.y + ((bottomRight.y - topLeft.y) / 2)};

        if (animated) {
            [UIView animateWithDuration:0.5 animations:^{
                [self.mapView centerOnPoint:centerPoint animated:NO];
                [self.mapView setZoomScale:self.mapView.minimumZoomScale animated:NO];
            }];

        } else {
            [self.mapView setZoomScale:self.mapView.minimumZoomScale animated:NO];
            [self.mapView centerOnPoint:centerPoint animated:NO];
        }
    }
}

- (void)zoomToFitFavoritePartners:(BOOL)animated
{
    NSArray *favorites = [self.shows select:^BOOL(PartnerShow *show) {
        return [self showIsSaved:show];
    }];

    NSArray *partners = [favorites valueForKeyPath:ar_keypath(PartnerShow.new, partner)];
    [self zoomToFitPartners:partners animated:animated];
}

- (void)selectPartnerShow:(PartnerShow *)partnerShow animated:(BOOL)animated
{
    [self selectPartnerShows:[NSArray arrayWithObject:partnerShow] animated:animated];
}

- (void)selectPartnerShows:(NSArray *)partnerShows animated:(BOOL)animated
{
    [self zoomToFitPartnerShows:partnerShows animated:animated];
}

- (void)rebuildPartnerToShowsMap
{
    __weak typeof(self) wself = self;

    ar_dispatch_async(^{
        __strong typeof (wself) sself = wself;

        NSMapTable *result = [NSMapTable strongToStrongObjectsMapTable];
        for (PartnerShow *show in sself.shows) {
            if (show.partner) {
                NSMutableArray *shows = [result objectForKey:show.partner];
                if (!shows) {
                    shows = [NSMutableArray arrayWithObject:show];
                    [result setObject:shows forKey:show.partner];
                } else {
                    [shows addObject:show];
                }
            }
        }

        ar_dispatch_main_queue(^{
            if (!self) { return; }
            self->_partnerToShowsMap = result;
        });
    });
}

- (void)zoomToFitPartners:(NSArray *)partners animated:(BOOL)animated
{
    if (partners.count == 0) {
        return;
    }

    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_LOW, 0), ^{
        NSMutableSet *highlighted = [NSMutableSet set];

        NSMapTable *partnerToShowsMap = self.partnerToShowsMap;
        for (Partner *partner in partners){
            NSArray *partnerShows = [partnerToShowsMap objectForKey:partner];
            if (partnerShows) {
                [highlighted addObjectsFromArray:partnerShows];
            }
        }

        [self zoomToFitPartnerShows:highlighted.allObjects animated:animated];
    });
}

- (void)zoomToFitPartnerShows:(NSArray *)partnerShows animated:(BOOL)animated
{
    if (partnerShows.count == 0) {
        return;
    }

    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_LOW, 0), ^{
        NSArray *mapPoints = [[partnerShows reject:^BOOL(PartnerShow *show) {
            return show.fairLocation.mapPoints.count == 0;
        }] map:^id(PartnerShow *show) {
            return show.fairLocation.mapPoints.firstObject;
        }];

        dispatch_async(dispatch_get_main_queue(), ^{
            [self setHighlightedShows:[NSSet setWithArray:partnerShows]];
            NSArray *mapFeatureViews = [self mapFeatureViewsForShows:self.highlightedShows.allObjects];
            [self expandToFullForFeatureViews:mapFeatureViews];
            [self zoomToFitPoints:mapPoints animated:animated];
        });
    });
}

- (void)setHighlightedShows:(NSSet *)highlightedShows
{
    NSArray *oldMapFeatureViews = [self mapFeatureViewsForShows:self.highlightedShows.allObjects];

    _highlightedShows = highlightedShows.copy;

    [oldMapFeatureViews each:^(ARFairMapAnnotationView *view) {
        view.annotation.highlighted = NO;
        view.mapFeatureType = view.annotation.featureType;
    }];

    NSArray *newMapFeatureViews = [self mapFeatureViewsForShows:self.highlightedShows.allObjects];
    [newMapFeatureViews each:^(ARFairMapAnnotationView *view) {
        view.annotation.highlighted = YES;
        view.hidden = NO;
        [view expandToFull];
    }];

    [self expandOrReduceAllAnnotations];
}

- (void)setFavoritedPartnerIDs:(NSSet *)favoritedPartnerIDs
{
    _favoritedPartnerIDs = favoritedPartnerIDs.copy;

    // update existing shows
    NSArray *favoriteShows = [self.shows.allObjects select:^BOOL(PartnerShow *show) {
        return [self showIsSaved:show];
    }];

    NSArray *mapFeatureViews = [self mapFeatureViewsForShows:favoriteShows];
    [self setFeatureType:ARMapFeatureTypeSaved forFeatureViews:mapFeatureViews];
    [mapFeatureViews each:^(ARFairMapAnnotationView *view) {
        view.annotation.saved = YES;
        view.hidden = NO;
        [view expandToFull];
    }];

    [self expandOrReduceAllAnnotations];
}

- (void)setFeatureType:(enum ARMapFeatureType)featureType forFeatureViews:(NSArray *)featureViews
{
    [featureViews each:^(ARFairMapAnnotationView *featureView) {
        featureView.mapFeatureType = featureType;
    }];
}

- (void)setFeatureTypeAndExpandToFull:(enum ARMapFeatureType)featureType forFeatureViews:(NSArray *)featureViews
{
    [featureViews each:^(ARFairMapAnnotationView *featureView) {
        [featureView expandToFull];
        featureView.mapFeatureType = featureType;
    }];
}

- (void)expandToFullForFeatureViews:(NSArray *)featureViews
{
    [featureViews each:^(ARFairMapAnnotationView *featureView) {
        [featureView expandToFull];
    }];
}

- (NSArray *)mapFeatureViewsForShows:(NSArray *)shows
{
    NSMutableArray *featureViews = [NSMutableArray array];
    [shows each:^(PartnerShow *show) {
        for(MapPoint *mapPoint in show.fairLocation.mapPoints) {
            CGPoint pointOnMap = [mapPoint coordinateOnImage:self.map.image];
            ARFairMapAnnotationView *featureView = (ARFairMapAnnotationView *) [self viewForPoint:pointOnMap andRepresentedObject:show];
            if (featureView) {
                [featureViews addObject:featureView];
            }
        }
    }];
    return featureViews;
}

- (ARFairMapAnnotation *)annotationForRepresentedObject:(id)representedObject
{
    return [self.objectsToAnnotations objectForKey:representedObject];
}

- (ARFairMapAnnotationView *)viewForPoint:(CGPoint)point andRepresentedObject:(id)representedObject
{
    ARFairMapAnnotation *annotation = [self annotationForRepresentedObject:representedObject];
    if (annotation && CGPointEqualToPoint(point, annotation.point)) {
        return (ARFairMapAnnotationView *)annotation.view;
    }
    return nil;
}

- (NSEnumerator *)annotationViews
{
    return [self.annotationsToAnnotationViews objectEnumerator];
}

- (NSEnumerator *)annotations
{
    return [self.annotationsToAnnotationViews keyEnumerator];
}

@end
