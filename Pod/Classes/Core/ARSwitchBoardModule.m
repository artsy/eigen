#import "ARSwitchBoardModule.h"
#import "ARMediaPreviewController.h"

#import <MessageUI/MFMailComposeViewController.h>
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/UIView+React.h>
#import <React/RCTRootView.h>


// Invoked on the main thread.
typedef void(^ARSwitchBoardPresentInternalViewController)(UIViewController * _Nonnull fromViewController, UIView * _Nonnull originatingView);

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

RCT_EXPORT_METHOD(updateShouldHideBackButton:(BOOL)shouldHide)
{
  self.updateShouldHideBackButton(shouldHide);
}

RCT_EXPORT_METHOD(presentEmailComposer:(nonnull NSNumber *)reactTag to:(NSString *)toAddress subject:(NSString *)subject)
{

  [self invokeCallback:^(UIViewController *fromViewController, UIView *originatingView) {
    if ([MFMailComposeViewController canSendMail]) {
      MFMailComposeViewController *composer = [[MFMailComposeViewController alloc] init];
      composer.mailComposeDelegate = self;
      [composer setToRecipients:@[toAddress]];
      [composer setSubject:subject];
      [fromViewController presentViewController:composer animated:YES completion:nil];
    } else {
      UIAlertController *alert = [UIAlertController
                                  alertControllerWithTitle:@"No email configured"
                                  message:[NSString stringWithFormat:@"You don't appear to have any email configured on your device. Please email %@ from another device.", toAddress]
                                  preferredStyle:UIAlertControllerStyleAlert];
      [alert addAction:[UIAlertAction actionWithTitle:@"Ok" style:UIAlertActionStyleCancel handler:nil]];
      [fromViewController presentViewController:alert animated:YES completion:nil];
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

#pragma mark - MFMailComposeViewControllerDelegate

- (void)mailComposeController:(MFMailComposeViewController *)controller didFinishWithResult:(MFMailComposeResult)result error:(nullable NSError *)error
{
  [controller.presentingViewController dismissViewControllerAnimated:YES completion:nil];
}

@end
