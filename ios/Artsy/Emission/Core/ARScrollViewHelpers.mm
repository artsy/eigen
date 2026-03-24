#import "ARScrollViewHelpers.h"
#import <UIKit/UIKit.h>
#import <React/RCTUIManager.h>
#import <React/RCTScrollViewComponentView.h>

// This is a workaround to make plain C functions not get mangled by C++ compiler, and fix compilation
#ifdef __cplusplus
extern "C" {
#endif
#import "INTUAnimationEngine.h"
#ifdef __cplusplus
}
#endif

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
 * hence smoothZoom which uses a 3rd-party animation engine to update the scroll view's properties manually
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

    // then figure out start and end view ports.

    // So the x, y, w, and h variables that are passed in to this method represent the target viewport relative to the
    // un-zoomed base image.
    // e.g.

    // +-------------------------------------------------------+
    // |                                                       |
    // |                                                       |
    // |                                                       |
    // |                                                       |
    // |      +---------------------------+                    |
    // |      |                           |                    |
    // |      |   current viewport        |                    |
    // |      |                           |                    |
    // |      |                           |                    |
    // +-------------------------------------------------------+
    // |      |                           |                    |
    // |      |          target viewport  |                    |
    // |      |                           |                    |
    // |      |                 +-----+   |                    |
    // |      |                 |     |   |                    |
    // |      |                 |     |   |                    |
    // |      |                 |     |   |                    |
    // |      |                 |     |   |                    |
    // |      |                 |     |   |                    |
    // |      |                 +-----+   |                    |
    // |      |                           |                    |
    // |      |                           |                    |
    // |      |                           |                    |
    // |      |                           |   base image       |
    // +-------------------------------------------------------+
    // |      |                           |                    |
    // |      |                           |                    |
    // |      |                           |                    |
    // |      |                           |                    |
    // |      |                           |                    |
    // |      |                           |                    |
    // |      +---------------------------+                    |
    // |                                                       |
    // |                                                       |
    // |                               zoomable scroll view    |
    // |                                                       |
    // +-------------------------------------------------------+

    // in this situation the current viewport would have a y value of something like -30 while the target view
    // port would have a y value of about +25 because they are relative to the base image and it's original dimensions
    // even if the scroll view if zoomed in or panned around.

    // so to do this zoom we'll calculate the current view port in these terms and then animate it towards the target
    // view port passed in to this method.

    CGFloat currentZoomScale = view.scrollView.zoomScale;

    // frame size is the un-zoomed size of the scroll view
    CGSize frameSize = view.scrollView.frame.size;

    CGPoint startContentOffset = view.scrollView.contentOffset;

    CGRect startViewPort = CGRectMake(startContentOffset.x / currentZoomScale, startContentOffset.y /currentZoomScale, frameSize.width / currentZoomScale, frameSize.height / currentZoomScale);

    CGRect targetViewPort = CGRectMake([x floatValue], [y floatValue], [w floatValue], [h floatValue]);

    __weak RCTScrollViewComponentView *weakScrollView = view;

    [INTUAnimationEngine animateWithDuration:0.34 delay:0 animations:^(CGFloat progress) {
      progress = INTUEaseInOutSine(progress);
      __strong RCTScrollViewComponentView *strongScrollView = weakScrollView;
      if (!strongScrollView) return;

      CGRect nextViewPort = INTUInterpolateCGRect(startViewPort, targetViewPort, progress);

      // now that we have our interpolated view port we need to scale it up

      CGFloat scale = frameSize.width / nextViewPort.size.width;

      strongScrollView.scrollView.zoomScale = scale;
      strongScrollView.scrollView.contentOffset = CGPointMake(nextViewPort.origin.x * scale, nextViewPort.origin.y * scale);
      strongScrollView.scrollView.bounds = CGRectMake(nextViewPort.origin.x * scale, nextViewPort.origin.y * scale, strongScrollView.scrollView.bounds.size.width, strongScrollView.scrollView.bounds.size.height);
      // dispatch a scroll event after the changes were applied so the DeepZoomOverlay can update
      [strongScrollView.scrollView.delegate scrollViewDidScroll:strongScrollView.scrollView];

    } completion:^(BOOL finished) {
      __strong RCTScrollViewComponentView *strongScrollView = weakScrollView;
      if (!strongScrollView) return;
      strongScrollView.scrollView.scrollEnabled = YES;
    }];
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
