#import <UIKit/UIKit.h>
#import <React/RCTBridgeModule.h>

@interface ARTakePhotoPromisable: NSObject<UIImagePickerControllerDelegate, UINavigationControllerDelegate>

- (void)showCameraModal:(UIViewController *)viewController resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject;

@end
