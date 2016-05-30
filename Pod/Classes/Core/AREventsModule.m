#import "AREventsModule.h"

#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/UIView+React.h>
#import <React/RCTRootView.h>

@implementation AREventsModule

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(postEvent:(nonnull NSNumber *)reactTag info:(nonnull NSDictionary *)info)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    UIView *rootView = [self.bridge.uiManager viewForReactTag:reactTag];
    while (rootView.superview && ![rootView isKindOfClass:RCTRootView.class]) {
      rootView = rootView.superview;
    }
    UIViewController *viewController = rootView.reactViewController;
    
    self.eventOccurred(viewController, info);
  });
}

@end