#import "ARSwitchBoardModule.h"
#import "ARMediaPreviewController.h"

#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/UIView+React.h>
#import <React/RCTRootView.h>

// Invoked on the main thread.
typedef void(^ARSwitchBoardPresentInternalViewController)(UIViewController * _Nonnull fromViewController);

@implementation ARSwitchBoardModule

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(presentNavigationViewController:(nonnull NSNumber *)reactTag route:(nonnull NSString *)route)
{
  [self invokeCallback:self.presentNavigationViewController reactTag:reactTag route:route];
}

RCT_EXPORT_METHOD(presentModalViewController:(nonnull NSNumber *)reactTag route:(nonnull NSString *)route)
{
  [self invokeCallback:self.presentModalViewController reactTag:reactTag route:route];
}

RCT_EXPORT_METHOD(dismissModalViewController:(nonnull NSNumber *)reactTag)
{
    [self invokeCallback:^(UIViewController *fromViewController) {
      [fromViewController dismissViewControllerAnimated:YES completion:nil];
    } reactTag:reactTag];
}

RCT_EXPORT_METHOD(presentMediaPreviewController:(nonnull NSNumber *)reactTag route:(nonnull NSURL *)route mimeType:(nonnull NSString *)mimeType cacheKey:(nullable NSString *)cacheKey)
{
    [self invokeCallback:^(UIViewController *fromViewController) {
        ARMediaPreviewController *previewController = [[ARMediaPreviewController alloc] initWithRemoteURL:route
                                                                                                 mimeType:mimeType
                                                                                                 cacheKey:cacheKey];
        if (fromViewController.navigationController) {
            [fromViewController.navigationController pushViewController:previewController animated:YES];
        } else {
            [fromViewController presentViewController:previewController animated:YES completion:nil];
        }
    } reactTag:reactTag];
}

- (dispatch_queue_t)methodQueue;
{
  return dispatch_get_main_queue();
}

- (void)invokeCallback:(ARSwitchBoardPresentViewController)callback
              reactTag:(nonnull NSNumber *)reactTag
                 route:(nonnull NSString *)route;
{
  [self invokeCallback:^(UIViewController * _Nonnull fromViewController) {
    callback(fromViewController, route);
  } reactTag:reactTag];
}

- (void)invokeCallback:(ARSwitchBoardPresentInternalViewController)callback
              reactTag:(nonnull NSNumber *)reactTag
{
    UIView *rootView = [self.bridge.uiManager viewForReactTag:reactTag];
    while (rootView.superview && ![rootView isKindOfClass:RCTRootView.class]) {
        rootView = rootView.superview;
    }
    UIViewController *viewController = rootView.reactViewController;
    NSParameterAssert(viewController);
    callback(viewController);
}

@end
