#import "ARTakeCameraPhotoModule.h"

#import <AVFoundation/AVFoundation.h>
#import <MobileCoreServices/MobileCoreServices.h>

#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <React/UIView+React.h>
#import <React/RCTRootView.h>


typedef NS_ENUM(NSUInteger, ARTakeCameraPhotoError) {
    ARTakeCameraPhotoErrorDeviceNotAvailable = 0,
    ARTakeCameraPhotoErrorMediaNotAvailable,
    ARTakeCameraPhotoErrorMediaAccessDenied,
    ARTakeCameraPhotoErrorSaveFailed,
};


static NSArray<NSString *> *ErrorStringCodes = nil;
static NSArray<NSString *> *ErrorMessages = nil;
static NSArray<NSString *> *ErrorJSKeys = nil;


@interface _ARTakeCameraPickerController : UIImagePickerController <UIImagePickerControllerDelegate, UINavigationControllerDelegate>

@property (nonatomic, copy, readonly) RCTPromiseRejectBlock reject;
@property (nonatomic, copy, readonly) RCTPromiseResolveBlock resolve;

- (instancetype)initWithResolver:(RCTPromiseResolveBlock)resolve
                        rejecter:(RCTPromiseRejectBlock)reject;

@end


@implementation ARTakeCameraPhotoModule

@synthesize bridge = _bridge;

// RN Ceremony
+ (NSString *)moduleName;
{
    return nil;
}

+ (BOOL)requiresMainQueueSetup;
{
    return NO;
}

+ (void)load;
{
    // Normally done with the RCT_EXPORT_MODULE macro, but that overrides `load`, which we need too.
    RCT_EXTERN void RCTRegisterModule(Class);
    RCTRegisterModule(self);

    ErrorStringCodes = @[
        @"CAMERA_UNAVAILABLE",             // ARTakeCameraPhotoErrorDeviceNotAvailable
        @"CAMERA_PHOTO_MEDIA_UNAVAILABLE", // ARTakeCameraPhotoErrorMediaNotAvailable
        @"CAMERA_ACCESS_DENIED",           // ARTakeCameraPhotoErrorMediaAccessDenied
        @"CAMERA_SAVE_FAILED",             // ARTakeCameraPhotoErrorSaveFailed
    ];
    
    ErrorMessages = @[
        @"No available camera",            // ARTakeCameraPhotoErrorDeviceNotAvailable
        @"Camera can’t take photos",       // ARTakeCameraPhotoErrorMediaNotAvailable
        @"Camera access denied",           // ARTakeCameraPhotoErrorMediaAccessDenied
        @"Saving to Camera Roll failed",   // ARTakeCameraPhotoErrorSaveFailed
    ];
    
    ErrorJSKeys = @[
        @"cameraNotAvailable",             // ARTakeCameraPhotoErrorDeviceNotAvailable
        @"imageMediaNotAvailable",         // ARTakeCameraPhotoErrorMediaNotAvailable
        @"cameraAccessDenied",             // ARTakeCameraPhotoErrorMediaAccessDenied
        @"saveFailed",                     // ARTakeCameraPhotoErrorSaveFailed
    ];
}

+ (NSString *)errorMessageForCode:(ARTakeCameraPhotoError)errorCode;
{
    NSString *message = ErrorMessages[errorCode];
//    NSAssert(message, @"Unknown ARTakeCameraPhotoError code `%lu`", errorCode);
    return message;
}

+ (NSString *)errorCodeAsString:(ARTakeCameraPhotoError)errorCode;
{
    NSString *code = ErrorStringCodes[errorCode];
//    NSAssert(code, @"Unknown ARTakeCameraPhotoError code `%lu`", errorCode);
    return code;
}

+ (NSError *)errorWithCode:(ARTakeCameraPhotoError)errorCode;
{
    return [self errorWithCode:errorCode underlyingError:nil];
}

+ (NSError *)errorWithCode:(ARTakeCameraPhotoError)errorCode underlyingError:(NSError *)underlyingError;
{
    NSMutableDictionary *userInfo = [NSMutableDictionary dictionaryWithObject:[self errorMessageForCode:errorCode]
                                                                       forKey:NSLocalizedDescriptionKey];
    if (underlyingError) {
        userInfo[NSUnderlyingErrorKey] = underlyingError;
    }
    return [NSError errorWithDomain:@"net.artsy.emission.ARTakeCameraPhotoError"
                               code:errorCode
                           userInfo:[userInfo copy]];
}

- (NSDictionary *)constantsToExport;
{
    return @{
        @"errorCodes": [NSDictionary dictionaryWithObjects:ErrorStringCodes forKeys:ErrorJSKeys],
    };
}

RCT_EXPORT_METHOD(triggerCameraModal:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    if (![UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypeCamera]) {
        reject(
            [ARTakeCameraPhotoModule errorCodeAsString:ARTakeCameraPhotoErrorDeviceNotAvailable],
            [ARTakeCameraPhotoModule errorMessageForCode:ARTakeCameraPhotoErrorDeviceNotAvailable],
            [ARTakeCameraPhotoModule errorWithCode:ARTakeCameraPhotoErrorDeviceNotAvailable]
        );
        return;
    }

    NSArray *supportedMedia = [UIImagePickerController availableMediaTypesForSourceType:UIImagePickerControllerSourceTypeCamera];
    if ([supportedMedia indexOfObject:(NSString *)kUTTypeImage] == NSNotFound) {
        reject(
            [ARTakeCameraPhotoModule errorCodeAsString:ARTakeCameraPhotoErrorMediaNotAvailable],
            [ARTakeCameraPhotoModule errorMessageForCode:ARTakeCameraPhotoErrorMediaNotAvailable],
            [ARTakeCameraPhotoModule errorWithCode:ARTakeCameraPhotoErrorMediaNotAvailable]
        );
        return;
    }

    [self hasPermissionToAccessCamera:^(BOOL hasAccess) {
        if (!hasAccess) {
            reject(
               [ARTakeCameraPhotoModule errorCodeAsString:ARTakeCameraPhotoErrorMediaAccessDenied],
               [ARTakeCameraPhotoModule errorMessageForCode:ARTakeCameraPhotoErrorMediaAccessDenied],
               [ARTakeCameraPhotoModule errorWithCode:ARTakeCameraPhotoErrorMediaAccessDenied]
            );
            return;
        }
        dispatch_async(dispatch_get_main_queue(), ^{
            UIView *rootView = [self.bridge.uiManager viewForReactTag:reactTag];
            while (rootView.superview && ![rootView isKindOfClass:RCTRootView.class]) {
                rootView = rootView.superview;
            }
            _ARTakeCameraPickerController *picker = [[_ARTakeCameraPickerController alloc] initWithResolver:resolve rejecter:reject];
            [rootView.reactViewController presentViewController:picker animated:YES completion:nil];
        });
    }];
}

- (void)hasPermissionToAccessCamera:(void (^)(BOOL hasAccess))completion;
{
    AVAuthorizationStatus status = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
    switch (status) {
        case AVAuthorizationStatusAuthorized:
            completion(YES);
            break;

        case AVAuthorizationStatusNotDetermined:
            [AVCaptureDevice requestAccessForMediaType:AVMediaTypeVideo completionHandler:completion];
            break;

        case AVAuthorizationStatusDenied:
        case AVAuthorizationStatusRestricted:
            completion(NO);
            break;
    }
}

@end


@implementation _ARTakeCameraPickerController

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
        self.reject(
           [ARTakeCameraPhotoModule errorCodeAsString:ARTakeCameraPhotoErrorSaveFailed],
           [ARTakeCameraPhotoModule errorMessageForCode:ARTakeCameraPhotoErrorSaveFailed],
           [ARTakeCameraPhotoModule errorWithCode:ARTakeCameraPhotoErrorSaveFailed underlyingError:error]
        );
    } else {
        self.resolve(@YES);
    }
    [self dismissViewControllerAnimated:YES completion:nil];
}

@end

