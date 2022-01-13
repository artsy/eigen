#import "AppClipLinkingManager.h"
#import "SceneDelegate.h"

@interface AppClipLinkingManager ()

@end

@implementation AppClipLinkingManager
- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
  return @[];
}

RCT_EXPORT_METHOD(getInitialLink:(RCTPromiseResolveBlock) resolve:(RCTPromiseRejectBlock)reject) {
  UIScene *scene =  UIApplication.sharedApplication.connectedScenes.allObjects.firstObject;
  SceneDelegate *sceneDelegate = (SceneDelegate *)scene.delegate;
  if (sceneDelegate.initialLinkUrl) {
      resolve(sceneDelegate.initialLinkUrl);
    } else {
      reject(@"event_failure", @"no event id returned", nil);
    }
}
@end
