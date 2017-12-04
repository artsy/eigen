#import "AREmissionCameraController.h"

#import <Photos/Photos.h>
#import <objc/runtime.h>

@interface AREmissionCameraController () <UIImagePickerControllerDelegate, UINavigationControllerDelegate>
@property (nonatomic, copy, readonly) RCTPromiseRejectBlock reject;
@property (nonatomic, copy, readonly) RCTPromiseResolveBlock resolve;
@end

@implementation AREmissionCameraController

- (instancetype)initWithResolver:(RCTPromiseResolveBlock)resolve
                        rejecter:(RCTPromiseRejectBlock)reject;
{
    if ((self = [super init])) {
        _reject = reject;
        _resolve = resolve;

        self.sourceType = UIImagePickerControllerSourceTypeCamera;
        self.cameraCaptureMode = UIImagePickerControllerCameraCaptureModePhoto;
        self.cameraDevice = UIImagePickerControllerCameraDeviceRear;
        self.showsCameraControls = YES;
        self.navigationBarHidden = YES;
        self.toolbarHidden = YES;
        self.delegate = self;
    }
    return self;
}

- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker;
{
    [self dismissViewControllerAnimated:YES completion:nil];
    self.resolve(@NO);
}

- (void)imagePickerController:(UIImagePickerController *)picker
didFinishPickingMediaWithInfo:(NSDictionary<NSString *,id> *)info;
{
    UIImageWriteToSavedPhotosAlbum(
        info[UIImagePickerControllerOriginalImage],
        self,
        @selector(imageWrittenToSavedPhotosAlbum:didFinishSavingWithError:context:),
        NULL
    );
}

- (void)imageWrittenToSavedPhotosAlbum:(UIImage *)image
              didFinishSavingWithError:(NSError *)error
                               context:(void *)_;
{
    if (error) {
        self.reject(@"TAKE_PHOTO", @"Failed to save photo to the photo roll.", error);
    } else {
        self.resolve(@YES);
    }
    [self dismissViewControllerAnimated:YES completion:nil];
}

@end

