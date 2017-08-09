#import "ARTakeCameraPhotoModule.h"

#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/UIView+React.h>
#import <React/RCTRootView.h>

@implementation ARTakeCameraPhotoModule

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(triggerCameraModal:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        UIView *rootView = [self.bridge.uiManager viewForReactTag:reactTag];
        while (rootView.superview && ![rootView isKindOfClass:RCTRootView.class]) {
            rootView = rootView.superview;
        }
        self.triggerCreatingACameraPhoto(rootView.reactViewController, resolve, reject);
    });
}

@end

