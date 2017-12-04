#import <UIKit/UIKit.h>
#import <React/RCTBridgeModule.h>

@interface ARTakePhotoPromisable: NSObject

+ (void)presentModalCameraView:(UIViewController *)presentingViewController
                      resolver:(RCTPromiseResolveBlock)resolve
                      rejecter:(RCTPromiseRejectBlock)reject;

@end
