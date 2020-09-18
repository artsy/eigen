#import "ARSwitchBoardModule.h"
#import "ARMediaPreviewController.h"

#import <MessageUI/MFMailComposeViewController.h>
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/UIView+React.h>
#import <React/RCTRootView.h>


// Invoked on the main thread.
typedef void(^ARSwitchBoardPresentInternalViewController)(UIViewController *fromViewController, UIView * _Nonnull originatingView);

@interface ARSwitchBoardModule () <MFMailComposeViewControllerDelegate>
@end

@implementation ARSwitchBoardModule

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

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


RCT_EXPORT_METHOD(updateShouldHideBackButton:(BOOL)shouldHide)
{
  self.updateShouldHideBackButton(shouldHide);
}



- (dispatch_queue_t)methodQueue;
{
  return dispatch_get_main_queue();
}

- (void)invokeCallback:(ARSwitchBoardPresentViewController)callback
              reactTag:(nonnull NSNumber *)reactTag
                 route:(nonnull NSString *)route;
{
  [self invokeCallback:^(UIViewController *fromViewController, id _) {
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
    // Note that reactViewController could be nil if the top-level component is not backed by a ARComponentViewController.
    callback(viewController, originatingView);
}


@end
