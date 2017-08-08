#import <UIKit/UIKit.h>
#import <React/RCTBridgeModule.h>

// This is a C&P'd version from Eigen, it doesn't need to have every feature, but it is better for testing
// that you can still use a real camera on device.

@interface TakePhotoPromisable: NSObject<UIImagePickerControllerDelegate, UINavigationControllerDelegate>

- (void)showCameraModal:(UIViewController *)viewController resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;

@end
