#import <UIKit/UIKit.h>
#import <React/RCTBridgeModule.h>

@interface AREmissionCameraController : UIImagePickerController

- (instancetype)initWithResolver:(RCTPromiseResolveBlock)resolve
                        rejecter:(RCTPromiseRejectBlock)reject;

@end
