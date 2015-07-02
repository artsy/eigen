#import "ARFairMapAnnotation.h"
#import "ARFairMapAnnotationView.h"
#import "UIView+HitTestExpansion.h"


@interface ARFairMapAnnotation ()
@property (nonatomic, readonly) ARFairMapAnnotationView *view;
@end


@implementation ARFairMapAnnotation

@dynamic view;

- (id)initWithPoint:(CGPoint)point representedObject:(id)representedObject
{
    self = [super initWithPoint:point];
    if (self) {
        _representedObject = representedObject;
        _saved = NO;
        _highlighted = NO;
    }
    return self;
}

- (id)copyWithZone:(NSZone *)zone
{
    return [[ARFairMapAnnotation allocWithZone:zone] initWithPoint:self.point representedObject:self.representedObject];
}

- (BOOL)isEqual:(id)object
{
    if ([object isKindOfClass:self.class]) {
        return CGPointEqualToPoint(self.point, [object point]) && [self.representedObject isEqual:[object representedObject]];
    }
    return [super isEqual:object];
}

- (UIView *)createViewOnMapView:(NAMapView *)mapView
{
    ARFairMapAnnotationView *view = [[ARFairMapAnnotationView alloc] initWithMapView:mapView forAnnotation:self];
    enum ARMapFeatureType featureType = self.featureType;
    view.mapFeatureType = featureType;
    view.href = self.href;
    view.displayTitle = self.title;

    self.mapViewDelegate = mapView.mapViewDelegate;

    if (featureType == ARMapFeatureTypeDefault) {
        [view reduceToPoint];
    }

    [view ar_extendHitTestSizeByWidth:0 andHeight:5];
    [view addTarget:self action:@selector(tappedOnAnnotation:) forControlEvents:UIControlEventTouchUpInside];

    return view;
}

- (enum ARMapFeatureType)featureType
{
    if ([self.representedObject isKindOfClass:PartnerShow.class]) {
        if (self.highlighted) {
            return ARMapFeatureTypeHighlighted;
        } else if (self.saved) {
            return ARMapFeatureTypeSaved;
        } else {
            return ARMapFeatureTypeDefault;
        }
    } else if ([self.representedObject isKindOfClass:MapFeature.class]) {
        return [self.representedObject featureType];
    } else {
        return ARMapFeatureTypeGenericEvent;
    }
}

- (NSString *)href
{
    if ([self.representedObject isKindOfClass:MapFeature.class]) {
        return [self.representedObject href];
    }

    return nil;
}

- (NSString *)title
{
    if ([self.representedObject isKindOfClass:PartnerShow.class]) {
        PartnerShow *partnerShow = self.representedObject;
        return partnerShow.partner.shortName ?: partnerShow.partner.name;
    } else if ([self.representedObject isKindOfClass:MapFeature.class]) {
        MapFeature *mapFeature = self.representedObject;
        return mapFeature.name;
    } else {
        return @"";
    }
}

- (NSString *)subTitle
{
    if ([self.representedObject isKindOfClass:PartnerShow.class]) {
        return [self.representedObject locationInFair];
    } else if ([self.representedObject isKindOfClass:MapFeature.class]) {
        return @"";
    } else {
        return @"";
    }
}

- (void)tappedOnAnnotation:(id)sender
{
    [self.mapViewDelegate mapView:self.mapView tappedOnAnnotation:self];
}

- (void)setHighlighted:(BOOL)highlighted
{
    _highlighted = highlighted;
    [self updateFeatureView];
}

- (void)setSaved:(BOOL)saved
{
    _saved = saved;
    [self updateFeatureView];
}

- (void)updateFeatureView
{
    self.view.mapFeatureType = self.featureType;
}

- (void)updatePosition
{
    [self.view updatePosition];
}

@end
