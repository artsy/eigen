#import <NAMapKit/NATiledImageMapView.h>

@interface ARFairMapPreview : NATiledImageMapView

- (id)initWithFairMap:(Map *)map andFrame:(CGRect)frame;

- (void)addShow:(PartnerShow *)show animated:(BOOL)animated;
- (void)addShows:(NSArray *)shows animated:(BOOL)animated;

@end
