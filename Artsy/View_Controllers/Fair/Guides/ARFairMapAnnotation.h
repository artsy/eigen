#import <NAMapKit/NAAnnotation.h>
#import "MapFeature.h"

@interface ARFairMapAnnotation : NAAnnotation <NSCopying>

- (id)initWithPoint:(CGPoint)point representedObject:(id)representedObject;

@property (nonatomic, strong) id representedObject;
@property (nonatomic, readonly) ARMapFeatureType featureType;
@property (nonatomic, readonly) NSString *href;
@property (nonatomic, readonly) NSString *title;
@property (nonatomic, readonly) NSString *subTitle;
@property (nonatomic, assign) BOOL saved;
@property (nonatomic, assign) BOOL highlighted;

@end
