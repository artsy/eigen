
#import "ARScrollViewHelpers.h"
#import <UIKit/UIKit.h>
#import "AREmission.h"
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/RCTScrollView.h>
#import <math.h>
#import "INTUAnimationEngine.h"

@interface RCTScrollView (EnclosingScrollView)
-(void)optOutOfParentScrollEvents;
-(void)optOutOfAllScrollEvents;
-(void)optInToAllScrollEvents;
@end

@implementation ARScrollViewHelpers

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(optOutOfParentScrollEvents:(nonnull NSNumber *)tag)
{
    UIView* view = [[AREmission sharedInstance].bridge.uiManager viewForReactTag:tag];

    if ([view isKindOfClass:RCTScrollView.class]) {
        [((RCTScrollView *) view) optOutOfParentScrollEvents];
    }
}

RCT_EXPORT_METHOD(triggerScrollEvent:(nonnull NSNumber *)tag)
{
    UIView* view = [[AREmission sharedInstance].bridge.uiManager viewForReactTag:tag];

    if ([view isKindOfClass:RCTScrollView.class]) {
        [((RCTScrollView *) view) scrollViewDidScroll:((RCTScrollView *) view).scrollView];
    }
}

// x, y, w, and h, are relative to the un-zoomed content
RCT_EXPORT_METHOD(smoothZoom:(nonnull NSNumber *)tag x:(nonnull NSNumber *)x y:(nonnull NSNumber *)y w:(nonnull NSNumber *)w h:(nonnull NSNumber *)h)
{
    UIView* view = [[AREmission sharedInstance].bridge.uiManager viewForReactTag:tag];

    if ([view isKindOfClass:RCTScrollView.class]) {
        __weak RCTScrollView* weakScrollView = (RCTScrollView *) view;

        weakScrollView.scrollView.scrollEnabled = NO;


        CGFloat startZoomScale = weakScrollView.scrollView.zoomScale;
        CGSize baseImageSize = CGSizeMake(weakScrollView.scrollView.contentSize.width / startZoomScale, weakScrollView.scrollView.contentSize.height / startZoomScale);
        CGSize frameSize = weakScrollView.scrollView.frame.size;

        CGFloat marginHorizontal = (frameSize.width - baseImageSize.width) / 2.0;
        CGFloat marginVertical = (frameSize.height - baseImageSize.height) / 2.0;

        CGPoint startContentOffset = weakScrollView.scrollView.contentOffset;



        CGRect baseRect;
        baseRect.size = baseImageSize;
        baseRect.origin = CGPointMake(-marginHorizontal, -marginVertical);



        CGRect startRect = CGRectMake(startContentOffset.x / startZoomScale, startContentOffset.y /startZoomScale, frameSize.width / startZoomScale, frameSize.height / startZoomScale);

        CGRect targetRect = CGRectMake([x floatValue], [y floatValue], [w floatValue], [h floatValue]);

        [INTUAnimationEngine animateWithDuration:0.34 delay:0 animations:^(CGFloat progress) {
            progress = INTUEaseInOutSine(progress);
            __strong RCTScrollView* strongScrollView = weakScrollView;
            if (!strongScrollView) return;

            CGRect rect = INTUInterpolateCGRect(startRect, targetRect, progress);

            CGFloat scale = baseRect.size.width / rect.size.width;

            [strongScrollView optOutOfAllScrollEvents];
            strongScrollView.scrollView.zoomScale = scale;
            strongScrollView.scrollView.contentOffset = CGPointMake(rect.origin.x * scale, rect.origin.y * scale);
            strongScrollView.scrollView.bounds = CGRectMake(rect.origin.x * scale, rect.origin.y * scale, strongScrollView.scrollView.bounds.size.width, strongScrollView.scrollView.bounds.size.height);
            [strongScrollView optInToAllScrollEvents];
            [strongScrollView scrollViewDidScroll:strongScrollView.scrollView];

        } completion:^(BOOL finished) {
            __strong RCTScrollView* strongScrollView = weakScrollView;
            if (!strongScrollView) return;
            strongScrollView.scrollView.scrollEnabled = YES;
            NSLog(@"yo done up in here");
        }];
    }
}

@end
