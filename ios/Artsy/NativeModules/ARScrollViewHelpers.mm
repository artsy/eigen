#import "ARScrollViewHelpers.h"
#import <UIKit/UIKit.h>
#import <React/RCTUIManager.h>
#import <React/RCTScrollViewComponentView.h>
#import <QuartzCore/QuartzCore.h>
#import <math.h>

// Ease-in-out sine: equivalent to INTUEaseInOutSine
static CGFloat ARSmoothZoomEaseInOutSine(CGFloat t) {
  return -(cos(M_PI * t) - 1.0) / 2.0;
}

// Linear interpolation of CGRect components: equivalent to INTUInterpolateCGRect
static CGRect ARSmoothZoomInterpolateCGRect(CGRect a, CGRect b, CGFloat t) {
  return CGRectMake(
    a.origin.x + (b.origin.x - a.origin.x) * t,
    a.origin.y + (b.origin.y - a.origin.y) * t,
    a.size.width  + (b.size.width  - a.size.width)  * t,
    a.size.height + (b.size.height - a.size.height) * t
  );
}

// Private helper class that drives the smooth-zoom animation via CADisplayLink.
// Holds its own strong reference so it stays alive for the duration of the animation.
@interface ARSmoothZoomAnimator : NSObject
- (instancetype)initWithScrollView:(RCTScrollViewComponentView *)view
                     startViewPort:(CGRect)start
                    targetViewPort:(CGRect)target
                          duration:(CFTimeInterval)duration
                         frameSize:(CGSize)frameSize;
- (void)start;
@end

@implementation ARSmoothZoomAnimator {
  CADisplayLink *_displayLink;
  __weak RCTScrollViewComponentView *_scrollView;
  CGRect _startViewPort;
  CGRect _targetViewPort;
  CFTimeInterval _duration;
  CFTimeInterval _startTime;
  CGSize _frameSize;
  // Keep a strong self-reference so the animator isn't deallocated mid-animation.
  ARSmoothZoomAnimator *_selfRetain;
}

- (instancetype)initWithScrollView:(RCTScrollViewComponentView *)view
                     startViewPort:(CGRect)start
                    targetViewPort:(CGRect)target
                          duration:(CFTimeInterval)duration
                         frameSize:(CGSize)frameSize
{
  if (!(self = [super init])) return nil;
  _scrollView    = view;
  _startViewPort = start;
  _targetViewPort = target;
  _duration      = duration;
  _frameSize     = frameSize;
  return self;
}

- (void)start
{
  _selfRetain  = self; // prevent deallocation until done
  _startTime   = CACurrentMediaTime();
  _displayLink = [CADisplayLink displayLinkWithTarget:self selector:@selector(tick:)];
  [_displayLink addToRunLoop:[NSRunLoop mainRunLoop] forMode:NSRunLoopCommonModes];
}

- (void)tick:(CADisplayLink *)link
{
  __strong RCTScrollViewComponentView *scrollView = _scrollView;
  if (!scrollView) {
    [self finish];
    return;
  }

  CFTimeInterval elapsed     = CACurrentMediaTime() - _startTime;
  CGFloat        rawProgress = (CGFloat)MIN(elapsed / _duration, 1.0);
  CGFloat        progress    = ARSmoothZoomEaseInOutSine(rawProgress);

  CGRect  nextViewPort = ARSmoothZoomInterpolateCGRect(_startViewPort, _targetViewPort, progress);
  CGFloat scale        = _frameSize.width / nextViewPort.size.width;

  scrollView.scrollView.zoomScale      = scale;
  scrollView.scrollView.contentOffset  = CGPointMake(nextViewPort.origin.x * scale, nextViewPort.origin.y * scale);
  scrollView.scrollView.bounds         = CGRectMake(
    nextViewPort.origin.x * scale,
    nextViewPort.origin.y * scale,
    scrollView.scrollView.bounds.size.width,
    scrollView.scrollView.bounds.size.height
  );
  [scrollView.scrollView.delegate scrollViewDidScroll:scrollView.scrollView];

  if (rawProgress >= 1.0) {
    [self finish];
  }
}

- (void)finish
{
  [_displayLink invalidate];
  _displayLink = nil;

  __strong RCTScrollViewComponentView *scrollView = _scrollView;
  if (scrollView) {
    scrollView.scrollView.scrollEnabled = YES;
  }

  _selfRetain = nil; // allow deallocation
}

@end


@implementation ARScrollViewHelpers

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(triggerScrollEvent:(nonnull NSNumber *)tag)
{
  RCTScrollViewComponentView *view = (id)[self.bridge.uiManager viewForReactTag:tag];

  if ([view isKindOfClass:RCTScrollViewComponentView.class]) {
    [view.scrollView.delegate scrollViewDidScroll:view.scrollView];
  }
}

/**
 * smoothZoom is needed because the native zoomToRect method on UIScrollView does not trigger scroll events
 * Meanwhile, we use scroll events to update the position of elements in the DeepZoomOverlay. So if we
 * use zoomToRect only one scroll event is dispatched for the end state and the components jump suddenly.
 * hence smoothZoom which uses CADisplayLink to update the scroll view's properties manually
 * triggering a single scroll event for each step in the animation.
 */
// x, y, w, and h, are relative to the un-zoomed content
RCT_EXPORT_METHOD(smoothZoom:(nonnull NSNumber *)tag x:(nonnull NSNumber *)x y:(nonnull NSNumber *)y w:(nonnull NSNumber *)w h:(nonnull NSNumber *)h)
{
  RCTScrollViewComponentView *view = (id)[self.bridge.uiManager viewForReactTag:tag];

  if ([view isKindOfClass:RCTScrollViewComponentView.class]) {
    // first disable scrolling so the user can't interrupt the animation
    // TODO: (this doesn't seem to actually work, needs more investigation)
    view.scrollView.scrollEnabled = NO;

    CGFloat  currentZoomScale   = view.scrollView.zoomScale;
    CGSize   frameSize          = view.scrollView.frame.size;
    CGPoint  startContentOffset = view.scrollView.contentOffset;

    CGRect startViewPort = CGRectMake(
      startContentOffset.x / currentZoomScale,
      startContentOffset.y / currentZoomScale,
      frameSize.width  / currentZoomScale,
      frameSize.height / currentZoomScale
    );
    CGRect targetViewPort = CGRectMake([x floatValue], [y floatValue], [w floatValue], [h floatValue]);

    ARSmoothZoomAnimator *animator = [[ARSmoothZoomAnimator alloc]
      initWithScrollView:view
           startViewPort:startViewPort
          targetViewPort:targetViewPort
                duration:0.34
               frameSize:frameSize];
    [animator start];
  }
}

/**
 * syncResetZoom immediately resets the scroll view to zoomScale=1 with the given contentOffset,
 * without animation. This ensures the native view is in a clean state before being returned
 * to Fabric's view pool, preventing stale zoom state from leaking into the next fullscreen session.
 */
RCT_EXPORT_METHOD(syncResetZoom:(nonnull NSNumber *)tag contentOffsetX:(nonnull NSNumber *)x contentOffsetY:(nonnull NSNumber *)y)
{
  RCTScrollViewComponentView *view = (id)[self.bridge.uiManager viewForReactTag:tag];

  if ([view isKindOfClass:RCTScrollViewComponentView.class]) {
    view.scrollView.zoomScale = 1.0;
    view.scrollView.contentOffset = CGPointMake([x floatValue], [y floatValue]);
    [view.scrollView.delegate scrollViewDidScroll:view.scrollView];
  }
}

@end
