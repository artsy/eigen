#import "ARSwitchBoardModule.h"
#import "ARMediaPreviewController.h"

#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/UIView+React.h>
#import <React/RCTRootView.h>


// Invoked on the main thread.
typedef void(^ARSwitchBoardPresentInternalViewController)(UIViewController * _Nonnull fromViewController, UIView * _Nonnull originatingView);

@implementation ARSwitchBoardModule

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(presentArtworksSet:(nonnull NSNumber *)reactTag artworkIDs:(nonnull NSArray<NSString *> *)artworkIDs initialIndex:(nonnull NSNumber *)index)
{
    UIView *originatingView = [self.bridge.uiManager viewForReactTag:reactTag];
    UIView *rootView = originatingView;
    while (rootView.superview && ![rootView isKindOfClass:RCTRootView.class]) {
        rootView = rootView.superview;
    }
    UIViewController *viewController = rootView.reactViewController;
    NSParameterAssert(viewController);

    self.presentArtworkSet(viewController, artworkIDs, index);
}


RCT_EXPORT_METHOD(presentNavigationViewController:(nonnull NSNumber *)reactTag route:(nonnull NSString *)route)
{
  [self invokeCallback:self.presentNavigationViewController reactTag:reactTag route:route];
}

RCT_EXPORT_METHOD(dismissNavigationViewController:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [self invokeCallback:^(UIViewController *fromViewController, id _) {
        [fromViewController.navigationController popViewControllerAnimated:YES];
        resolve(nil);
    } reactTag:reactTag];
}

RCT_EXPORT_METHOD(presentModalViewController:(nonnull NSNumber *)reactTag route:(nonnull NSString *)route)
{
  [self invokeCallback:self.presentModalViewController reactTag:reactTag route:route];
}

RCT_EXPORT_METHOD(dismissModalViewController:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [self invokeCallback:^(UIViewController *fromViewController, id _) {
        [fromViewController dismissViewControllerAnimated:YES completion:^{
            resolve(nil);
        }];
    } reactTag:reactTag];
}

RCT_EXPORT_METHOD(presentMediaPreviewController:(nonnull NSNumber *)reactTag route:(nonnull NSURL *)route mimeType:(nonnull NSString *)mimeType cacheKey:(nullable NSString *)cacheKey)
{
    [self invokeCallback:^(UIViewController *fromViewController, UIView *originatingView) {
        [[ARMediaPreviewController mediaPreviewControllerWithRemoteURL:route
                                                              mimeType:mimeType
                                                              cacheKey:cacheKey
                                                    hostViewController:fromViewController
                                                       originatingView:originatingView] presentPreview];
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
  [self invokeCallback:^(UIViewController * _Nonnull fromViewController, id _) {
    callback(fromViewController, route);
  } reactTag:reactTag];
}

- (void)invokeCallback:(ARSwitchBoardPresentInternalViewController)callback
              reactTag:(nonnull NSNumber *)reactTag
{
    UIView *originatingView = [self.bridge.uiManager viewForReactTag:reactTag];
    UIView *rootView = originatingView;
    while (rootView.superview && ![rootView isKindOfClass:RCTRootView.class]) {
        rootView = rootView.superview;
    }
    UIViewController *viewController = rootView.reactViewController;
    NSParameterAssert(viewController);
    callback(viewController, originatingView);
}

@end
