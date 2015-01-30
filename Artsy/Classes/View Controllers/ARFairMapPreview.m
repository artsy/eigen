#import "ARFairMapPreview.h"
#import "ARTiledImageDataSourceWithImage.h"
#import "ARFairShowMapper.h"
#import "ARFairMapZoomManager.h"

@interface ARFairMapPreview ()
@property (nonatomic, weak, readonly) Map *map;
@property (nonatomic, strong) ARFairShowMapper *showMapper;
@property (nonatomic, strong) ARFairMapZoomManager *mapZoomManager;

@end

@implementation ARFairMapPreview

- (instancetype) initWithFairMap:(Map *)map andFrame:(CGRect)frame
{
    ARTiledImageDataSourceWithImage *ds = [[ARTiledImageDataSourceWithImage alloc] initWithImage:map.image];
    self = [super initWithFrame:frame tiledImageDataSource:ds];
    if (!self) { return nil; }

    self.zoomStep = 2.5;
    self.showsVerticalScrollIndicator = NO;
    self.showsHorizontalScrollIndicator = NO;
    self.backgroundImageURL = [ds.image urlForThumbnailImage];
    self.backgroundColor = [UIColor colorWithHex:0xf6f6f6];
    self.userInteractionEnabled = NO;

    _showMapper = [[ARFairShowMapper alloc] initWithMapView:self map:map imageSize:[ds imageSizeForImageView:nil]];

    _mapZoomManager = [[ARFairMapZoomManager alloc] initWithMap:self dataSource:ds];
    [self.mapZoomManager setMaxMinZoomScalesForCurrentBounds];

    return self;
}

- (void)addShows:(NSArray *)shows animated:(BOOL)animated
{
    [self.showMapper addShows:[NSSet setWithArray:shows]];
    [self.showMapper selectPartnerShows:shows animated:animated];
}

- (void)addShow:(PartnerShow *)show animated:(BOOL)animated
{
    [self addShows:@[show] animated:animated];
}

- (CGSize)intrinsicContentSize
{
    return CGSizeMake(UIViewNoIntrinsicMetric, 150);
}

@end
