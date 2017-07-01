#import "ARSwitchBoardModule.h"
#import "ARMediaPreviewController.h"

#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/UIView+React.h>
#import <React/RCTRootView.h>

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
    [self invokeCallback:^(UIViewController *vc, NSString *_) { [vc dismissViewControllerAnimated:YES completion:nil]; } reactTag:reactTag];
}

RCT_EXPORT_METHOD(presentMediaPreviewController:(nonnull NSNumber *)reactTag route:(nonnull NSURL *)route cacheKey:(nullable NSString *)cacheKey fileExtension:(nullable NSString *)fileExtension)
{
    [self invokeCallback:^(UIViewController *fromViewController, id _) {
        ARMediaPreviewController *previewController = [[ARMediaPreviewController alloc] initWithRemoteURL:route
                                                                                                 cacheKey:cacheKey
                                                                                            fileExtension:fileExtension];
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
  UIView *rootView = [self.bridge.uiManager viewForReactTag:reactTag];
  while (rootView.superview && ![rootView isKindOfClass:RCTRootView.class]) {
    rootView = rootView.superview;
  }
  UIViewController *viewController = rootView.reactViewController;
  NSParameterAssert(viewController);
  callback(viewController, route);
}

- (void)invokeCallback:(ARSwitchBoardPresentViewController)callback
              reactTag:(nonnull NSNumber *)reactTag
{
    [self invokeCallback:callback reactTag:reactTag route:@""];
}

@end
