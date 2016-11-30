#import "ARLogger.h"
#import "ARZoomView.h"

#import "Image.h"
#import "ARFeedImageLoader.h"
#import "ARTiledImageDataSourceWithImage.h"

#import "UIDevice-Hardware.h"

#import <ARAnalytics/ARAnalytics.h>

static const CGFloat ARZoomMultiplierForDoubleTap = 1.5;


@interface ARTiledImageViewWithBreadcrumb : ARTiledImageView
@end


@implementation ARTiledImageViewWithBreadcrumb

- (void)dealloc;
{
    ARLog(@"ARTiledImageView (%p) is deallocating on thread: %@", (__bridge void *)self, [NSThread currentThread]);
}

- (instancetype)initWithDataSource:(NSObject<ARTiledImageViewDataSource> *)dataSource minimumSize:(CGSize)minimumSize
{
    if ((self = [super initWithDataSource:dataSource minimumSize:minimumSize])) {
        ARLog(@"ARTiledImageView (%p) initialized for data source (%p)", (__bridge void *)self, (__bridge void *)dataSource);
    }
    return self;
}

- (void)drawRect:(CGRect)rect;
{
    ARLog(@"ARTiledImageView (%p)   starts rendering on thread: %@", (__bridge void *)self, [NSThread currentThread]);
    [super drawRect:rect];
    ARLog(@"ARTiledImageView (%p) finished rendering on thread: %@", (__bridge void *)self, [NSThread currentThread]);
}

@end


@interface ARZoomView ()

@property (nonatomic, assign) BOOL overrideContentOffsetChanges;
@property (nonatomic, strong) UIButton *closeButton;
@property (nonatomic, strong) ARTiledImageView *zoomableView;
@property (nonatomic, strong) UIImageView *backgroundView;
@property (nonatomic, strong) ARTiledImageDataSourceWithImage *tileDataSource;

@end


@implementation ARZoomView

- (instancetype)initWithImage:(Image *)image frame:(CGRect)frame
{
    NSAssert([image canZoom:frame.size], @"Don't instantiate zoom views for images that don't need tiles in Eigen");

    self = [super initWithFrame:frame];
    if (!self) {
        return nil;
    }

    _image = image;
    self.scrollsToTop = NO;
    self.delegate = self;
    self.decelerationRate = UIScrollViewDecelerationRateFast;

    [self setupWithEventualFrame:frame];

    // Needs to be reset after setting anchorPoint
    self.frame = frame;

    return self;
}

- (void)setupWithEventualFrame:(CGRect)eventualFrame
{
    self.showsHorizontalScrollIndicator = NO;
    self.showsVerticalScrollIndicator = NO;
    self.backgroundColor = [UIColor clearColor];

    UITapGestureRecognizer *doubleTapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(doubleTap:)];
    doubleTapGesture.numberOfTapsRequired = 2;
    [self addGestureRecognizer:doubleTapGesture];

    UITapGestureRecognizer *twoFingerTapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(twoFingerTap:)];
    twoFingerTapGesture.numberOfTapsRequired = 1;
    twoFingerTapGesture.numberOfTouchesRequired = 2;
    [self addGestureRecognizer:twoFingerTapGesture];

    UITapGestureRecognizer *singleTapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(singleTap:)];
    [singleTapGesture requireGestureRecognizerToFail:doubleTapGesture];
    [singleTapGesture requireGestureRecognizerToFail:twoFingerTapGesture];
    [self addGestureRecognizer:singleTapGesture];

    CGSize minimumSize;
    if ([UIDevice isPad]) {
        CGFloat minimumEdge = MAX(CGRectGetWidth(eventualFrame), CGRectGetHeight(eventualFrame));
        minimumSize = CGSizeMake(minimumEdge, minimumEdge);
    } else {
        minimumSize = eventualFrame.size;
    }

    _tileDataSource = [[ARTiledImageDataSourceWithImage alloc] initWithImage:_image];
    _zoomableView = [[ARTiledImageViewWithBreadcrumb alloc] initWithDataSource:_tileDataSource minimumSize:minimumSize];
    _backgroundView = [[UIImageView alloc] initWithFrame:_zoomableView.frame];

    [[ARFeedImageLoader alloc] loadImageAtAddress:[_image baseImageURL] desiredSize:ARFeedItemImageSizeLarge forImageView:_backgroundView customPlaceholder:nil];

    [self addSubview:_backgroundView];
    [self addSubview:_zoomableView];
    [self setMaxMinZoomScalesForCurrentFrame];

    if ([UIDevice isPhone]) {
        self.layer.anchorPoint = CGPointMake(.5, 0);
    }
    self.zoomScale = self.minimumZoomScale;
}

- (void)removeZoomViewForTransition
{
    [_zoomableView removeFromSuperview];
    _zoomableView = nil;
}

- (void)finish
{
    _zoomableView.alpha = 0;
}

- (void)setBackgroundImage:(UIImage *)backgroundImage
{
    _backgroundView.image = backgroundImage;
    _backgroundImage = backgroundImage;
}

- (UIView *)viewForZoomingInScrollView:(UIScrollView *)scrollView
{
    return (_zoomableView) ? _zoomableView : _backgroundView;
}

- (void)performBlockWhileIgnoringContentOffsetChanges:(dispatch_block_t)block
{
    NSParameterAssert(block);
    self.overrideContentOffsetChanges = YES;
    block();
    self.overrideContentOffsetChanges = NO;
}

- (void)scrollViewDidZoom:(UIScrollView *)scrollView
{
    //so the background view doesnt show over the edges
    _backgroundView.frame = _zoomableView.frame;

    //close if the zoom goes below minimumZoomScale
    CGFloat fullScreenScale = [self scaleForFullScreenZoomInSize:self.frame.size];
    if (self.zoomScale < (fullScreenScale * .95)) {
        [self.zoomDelegate zoomViewFinished:self];
    }
}

- (CGFloat)scaleForFullScreenZoomInSize:(CGSize)size
{
    CGSize imageSize = CGSizeMake(_image.maxTiledWidth, _image.maxTiledHeight);

    CGFloat xScale = size.width / imageSize.width;
    CGFloat yScale = size.height / imageSize.height;
    return MIN(1.f, MAX(xScale, yScale));
}

- (void)setContentOffset:(CGPoint)contentOffset
{
    // Changing the zoomScale in an animation block makes the contentOffset "jump" at the beginning of the animation.
    if (self.overrideContentOffsetChanges) {
        ARActionLog(@"Ignoring contentOffset change: %@", NSStringFromCGPoint(contentOffset));
    } else {
        [super setContentOffset:contentOffset];
    }
}

- (CGPoint)centerContentOffsetForZoomScale:(CGFloat)zoomScale minimumSize:(CGSize)minimumSize
{
    CGSize imageSize = [self.tileDataSource imageSizeForImageView:self.zoomableView];
    imageSize.height *= zoomScale;
    imageSize.width *= zoomScale;

    CGPoint point = CGPointMake(-(MIN(minimumSize.width - imageSize.width, 0) / 2.0), -(MIN(minimumSize.height - imageSize.height, 0)) / 2.0);
    return point;
}

- (CGPoint)centerContentOffsetForZoomScale:(CGFloat)zoomScale
{
    CGSize minimumSize = self.frame.size;
    return [self centerContentOffsetForZoomScale:zoomScale minimumSize:minimumSize];
}

- (void)setMaxMinZoomScalesForCurrentFrame
{
    [self setMaxMinZoomScalesForSize:self.frame.size];
}

- (void)setMaxMinZoomScalesForSize:(CGSize)size
{
    CGSize imageSize = CGSizeMake(_image.maxTiledWidth, _image.maxTiledHeight);

    // calculate min/max zoomscale
    CGFloat xScale = size.width / imageSize.width;   // the scale needed to perfectly fit the image width-wise
    CGFloat yScale = size.height / imageSize.height; // the scale needed to perfectly fit the image height-wise
    CGFloat minScale = MIN(xScale, yScale);          // use minimum of these to allow the image to become fully visible

    CGFloat maxScale = 1.0;

    // don't let minScale exceed maxScale. (If the image is smaller than the screen, we don't want to force it to be zoomed.)
    if (minScale > maxScale) {
        minScale = maxScale;
    }

    self.maximumZoomScale = maxScale;
    self.minimumZoomScale = minScale;
}

#pragma mark -
#pragma mark Responding to gestures

- (void)doubleTap:(UITapGestureRecognizer *)tapGesture
{
    if (self.zoomScale == self.maximumZoomScale) {
        [self.zoomDelegate zoomViewFinished:self];

    } else {
        CGPoint tapCenter = [tapGesture locationInView:_zoomableView];
        CGFloat newScale = MIN(self.zoomScale * ARZoomMultiplierForDoubleTap, self.maximumZoomScale);
        CGRect maxZoomRect = [self rectAroundPoint:tapCenter atZoomScale:newScale];
        [self zoomToRect:maxZoomRect animated:YES];
    }
}

- (void)twoFingerTap:(UITapGestureRecognizer *)tapGesture
{
    if (self.zoomScale == self.minimumZoomScale) {
        [self setZoomScale:self.maximumZoomScale animated:YES];

    } else {
        CGPoint tapCenter = [tapGesture locationInView:_zoomableView];
        CGFloat newScale = MAX(self.zoomScale / ARZoomMultiplierForDoubleTap, self.minimumZoomScale);
        CGRect minZoomRect = [self rectAroundPoint:tapCenter atZoomScale:newScale];
        [self zoomToRect:minZoomRect animated:YES];
    }
}

- (void)singleTap:(UITapGestureRecognizer *)gesture
{
    [self.zoomDelegate zoomViewFinished:self];
}


#pragma mark helpers

- (CGRect)rectAroundPoint:(CGPoint)point atZoomScale:(CGFloat)zoomScale
{
    // Define the shape of the zoom rect.
    CGSize boundsSize = self.bounds.size;

    // Modify the size according to the requested zoom level.
    // For example, if we're zooming in to 0.5 zoom, then this will increase the bounds size
    // by a factor of two.
    CGSize scaledBoundsSize = CGSizeMake(boundsSize.width / zoomScale,
                                         boundsSize.height / zoomScale);

    CGRect rect = CGRectMake(point.x - scaledBoundsSize.width / 2,
                             point.y - scaledBoundsSize.height / 2,
                             scaledBoundsSize.width,
                             scaledBoundsSize.height);

    return rect;
}

- (UIImage *)artworkImage
{
    return self.backgroundView.image;
}

- (void)dealloc
{
    self.zoomableView = nil;
    self.backgroundView = nil;
}

@end
