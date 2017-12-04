#import "ARTakePhotoPromisable.h"

#import <Photos/Photos.h>
#import <objc/runtime.h>

@interface ARTakePhotoPromisable() <UIImagePickerControllerDelegate, UINavigationControllerDelegate>
@property (nonatomic, copy, readonly) RCTPromiseRejectBlock reject;
@property (nonatomic, copy, readonly) RCTPromiseResolveBlock resolve;
@end

@implementation ARTakePhotoPromisable

+ (void)presentModalCameraView:(UIViewController *)presentingViewController
                      resolver:(RCTPromiseResolveBlock)resolve
                      rejecter:(RCTPromiseRejectBlock)reject;
{
    UIImagePickerController *picker = [[UIImagePickerController alloc] init];
    picker.sourceType = UIImagePickerControllerSourceTypeCamera;
    picker.cameraCaptureMode = UIImagePickerControllerCameraCaptureModePhoto;
    picker.cameraDevice = UIImagePickerControllerCameraDeviceRear;
    picker.showsCameraControls = YES;
    picker.navigationBarHidden = YES;
    picker.toolbarHidden = YES;

    ARTakePhotoPromisable *promisable = [[ARTakePhotoPromisable alloc] initWithResolver:resolve rejecter:reject];
    picker.delegate = promisable;
    // Tie the lifetime of the promisable object to the picker.
    objc_setAssociatedObject(picker, _cmd, promisable, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    
    [presentingViewController presentViewController:picker animated:YES completion:nil];
}

- (instancetype)initWithResolver:(RCTPromiseResolveBlock)resolve
                        rejecter:(RCTPromiseRejectBlock)reject;
{
    if ((self = [super init])) {
        _reject = reject;
        _resolve = resolve;

    }
    return self;
}

- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker;
{
    [picker dismissViewControllerAnimated:YES completion:nil];
    self.resolve(@NO);
}

- (void)imagePickerController:(UIImagePickerController *)picker
didFinishPickingMediaWithInfo:(NSDictionary<NSString *,id> *)info;
{
    UIImageWriteToSavedPhotosAlbum(
        info[UIImagePickerControllerOriginalImage],
        self,
        @selector(imageWrittenToSavedPhotosAlbum:didFinishSavingWithError:imagePickerController:),
        (__bridge void * _Nullable)picker
    );
}

- (void)imageWrittenToSavedPhotosAlbum:(UIImage *)image
              didFinishSavingWithError:(NSError *)error
                 imagePickerController:(UIImagePickerController *)picker;
{
    if (error) {
        self.reject(@"TAKE_PHOTO", @"Failed to save photo to the photo roll.", error);
    } else {
        self.resolve(@YES);
    }
    [picker dismissViewControllerAnimated:YES completion:nil];
}

@end

