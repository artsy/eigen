#import "TakePhotoPromisable.h"
#import <React/RCTBridgeModule.h>
#import <Photos/Photos.h>

@interface TakePhotoPromisable()
@property (nonatomic, copy, nullable, readwrite) RCTPromiseRejectBlock reject;
@property (nonatomic, copy, nullable, readwrite) RCTPromiseResolveBlock resolve;
@property (nonatomic, strong, nullable, readwrite) UIImagePickerController *picker;
@end

@implementation TakePhotoPromisable

- (void)showCameraModal:(UIViewController *)viewController resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject
{
  self.reject = reject;
  self.resolve = resolve;

  // Create a UIImagePicker to show the camera
  UIImagePickerController *picker = [[UIImagePickerController alloc] init];
  picker.sourceType = UIImagePickerControllerSourceTypeCamera;
  picker.cameraCaptureMode = UIImagePickerControllerCameraCaptureModePhoto;
  picker.cameraDevice = UIImagePickerControllerCameraDeviceRear;
  picker.showsCameraControls = YES;
  picker.navigationBarHidden = YES;
  picker.toolbarHidden = YES;
  picker.delegate = self;
  self.picker = picker;

  [viewController presentViewController:picker animated:YES completion:nil];
}

// User took a Photo
- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary<NSString *,id> *)info
{

  // The photo needs to get saved into the Photo roll, so do that first
  UIImage *takenImage = info[UIImagePickerControllerOriginalImage];
  UIImageWriteToSavedPhotosAlbum(takenImage, self, @selector(image:didFinishSavingWithError:contextInfo:), nil);
}

// User Cancelled taking a photo
- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker;
{
  [picker dismissViewControllerAnimated:YES completion:nil];
  _resolve(@NO);
}

// User saved a Photo to the photo roll
- (void)image:(UIImage *)image didFinishSavingWithError:(NSError *)error contextInfo:(void *)contextInfo
{
  // We delay this because it takes time to save the photo, and it looks like it's our app's fault
  // instead it looks like the camera is saving.
  [self.picker dismissViewControllerAnimated:YES completion:nil];

  self.resolve(@YES);
}

@end

