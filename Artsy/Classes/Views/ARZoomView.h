@class ARZoomView;

@protocol ARZoomViewDelegate
- (void)zoomViewFinished:(ARZoomView *)zoomView;
@end


@interface ARZoomView : UIScrollView <UIScrollViewDelegate>

@property (nonatomic, strong, readonly) Image *image;
@property (nonatomic, strong) UIImage *backgroundImage;
@property (nonatomic, weak) id<ARZoomViewDelegate> zoomDelegate;

- (instancetype)initWithImage:(Image *)image frame:(CGRect)frame;

- (void)performBlockWhileIgnoringContentOffsetChanges:(dispatch_block_t)block;

- (CGPoint)centerContentOffsetForZoomScale:(CGFloat)zoomScale minimumSize:(CGSize)minimumSize;
- (CGPoint)centerContentOffsetForZoomScale:(CGFloat)zoomScale;
- (void)setMaxMinZoomScalesForCurrentFrame;
- (void)setMaxMinZoomScalesForSize:(CGSize)size;
- (CGFloat)scaleForFullScreenZoomInSize:(CGSize)size;
- (void)removeZoomViewForTransition;
- (void)finish;

@end
