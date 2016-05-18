#import "ARSwitchBoardModule.h"

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

- (void)invokeCallback:(ARSwitchBoardPresentViewController)callback
              reactTag:(nonnull NSNumber *)reactTag
                 route:(nonnull NSString *)route;
{
  dispatch_async(self.bridge.uiManager.methodQueue, ^{
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
      UIView *rootView = viewRegistry[reactTag];
      while (rootView.superview && ![rootView isKindOfClass:RCTRootView.class]) {
        rootView = rootView.superview;
      }
      UIViewController *viewController = rootView.reactViewController;
      NSParameterAssert(viewController);
      dispatch_async(dispatch_get_main_queue(), ^{
        callback(viewController, route);
      });
    }];
  });
}

@end
