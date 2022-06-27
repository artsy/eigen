#import "ARPHPhotoPickerModule.h"
#import <RNImageCropPicker/Compression.h>
#import <RNImageCropPicker/ImageCropPicker.h>
#import <RNImageCropPicker/UIImage+Extension.h>

typedef NS_ENUM(NSUInteger, ARPHPhotoPickerError) {
    ARPHPhotoPickerErrorOSVersionUnsupported = 0,
    ARPHPhotoPickerErrorLoadFailed,
    ARPHPhotoPickerErrorSaveFailed,
};

@interface ARPHPhotoPickerModule()

@property (nonatomic, copy) RCTPromiseRejectBlock reject;
@property (nonatomic, copy) RCTPromiseResolveBlock resolve;

@end

/*!
 @discussion: Native Module for showing PHPhotoPicker introduced in iOS 14
 */

@implementation ARPHPhotoPickerModule

static NSString *ErrorDomain = @"net.artsy.ARPHPhotoPicker";

static NSString *UnsupportedOSErrorMessage = @"PHPhotoPicker unavailable before iOS 14.";
static NSString *LoadFailedErrorMessage = @"Failed to load photos from picker.";
static NSString *SaveFailedErrorMessage = @"Failed to save photos locally.";

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(requestPhotos:(BOOL)allowMultiple
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    self.resolve = resolve;
    self.reject = reject;
    if (@available(iOS 14.0, *)) {
        [self presentPhotoPickerAllowMultiple:allowMultiple];
    } else {
        // We should be checking OS version and using a react-native
        // photo picker on typescript side, this should never happen.
        // See requestPhotos.ts
        NSError *unsupportedOSVersion = [NSError errorWithDomain: ErrorDomain code:ARPHPhotoPickerErrorOSVersionUnsupported userInfo:@{ NSLocalizedDescriptionKey: UnsupportedOSErrorMessage }];
        _reject(ErrorDomain, UnsupportedOSErrorMessage, unsupportedOSVersion);
    }
}

- (void)presentPhotoPickerAllowMultiple:(BOOL)allowMultiple API_AVAILABLE(ios(14)) {
    dispatch_async(dispatch_get_main_queue(), ^{
        PHPickerConfiguration *config = [[PHPickerConfiguration alloc] init];
        config.selectionLimit = allowMultiple ? 10 : 1;
        config.filter = [PHPickerFilter imagesFilter];
        PHPickerViewController *picker = [[PHPickerViewController alloc] initWithConfiguration:config];
        picker.delegate = self;
        UIViewController *currentVC = RCTPresentedViewController();
        [currentVC presentViewController:picker animated:true completion:nil];
    });
}

#pragma mark - PHPickerViewControllerDelegate

- (void)picker:(PHPickerViewController *)picker didFinishPicking:(NSArray<PHPickerResult *> *)results API_AVAILABLE(ios(14)) {
    dispatch_async(dispatch_get_main_queue(), ^{
        [picker dismissViewControllerAnimated:true completion:nil];
    });

    if (results.count == 0) {
        _resolve(@[]);
    } else {
        NSMutableArray *images = [[NSMutableArray alloc] init];
        Compression *compression = [[Compression alloc] init];
        dispatch_group_t imageLoadGroup = dispatch_group_create();
        for (PHPickerResult *result in results) {
            if ([result.itemProvider canLoadObjectOfClass:UIImage.class]) {
                dispatch_group_enter(imageLoadGroup);
                [result.itemProvider loadObjectOfClass:[UIImage class] completionHandler:^(__kindof id<NSItemProviderReading> _Nullable object, NSError * _Nullable error) {
                    if ([object isKindOfClass:[UIImage class]]) {
                        UIImage *image = (UIImage*)object;
                        NSDictionary *compressionOption = @{ @"compressImageQuality": @1.0 };
                        ImageResult *imageResult = [compression compressImage:[image fixOrientation] withOptions:compressionOption];
                        NSString *filePath = [self persistFile:imageResult.data];
                        NSDictionary *imageDict = [self dictFromImageResult:imageResult filePath:filePath];
                        [images addObject:imageDict];
                    }
                    dispatch_group_leave(imageLoadGroup);
                }];
            }
        }

        double delayInSeconds = 3.0;
        dispatch_time_t timeout = dispatch_time(DISPATCH_TIME_NOW, delayInSeconds * NSEC_PER_SEC);
        dispatch_group_wait(imageLoadGroup, timeout);

        if (results.count == 0) {
            NSError *loadFailedError = [NSError errorWithDomain:ErrorDomain code:ARPHPhotoPickerErrorLoadFailed userInfo:@{ NSLocalizedDescriptionKey: LoadFailedErrorMessage }];
            _reject(ErrorDomain, LoadFailedErrorMessage, loadFailedError);
        } else {
            _resolve(images);
        }
    }
}

/*!
 @discussion: Helper functions for passing images across the bridge, must first persist to a temporary directory locally,
  then convert to a dictionary with properties or Image type defined in react-native-image-crop-picker
  Derived from code in https://github.com/ivpusic/react-native-image-crop-picker
 */

- (NSDictionary *)dictFromImageResult:(ImageResult *)result filePath:(NSString *)filePath {
    return @{
      @"path": filePath,
      @"size": [NSNumber numberWithUnsignedInteger:result.data.length],
      @"width": result.width,
      @"height": result.height,
      @"mime": result.mime
    };
}

- (NSString *)persistFile:(NSData*)data {
    // create temp file
    NSString *tmpDirFullPath = [self getTmpDirectory];
    NSString *filePath = [tmpDirFullPath stringByAppendingString:[[NSUUID UUID] UUIDString]];
    filePath = [filePath stringByAppendingString:@".jpg"];

    // save cropped file
    BOOL status = [data writeToFile:filePath atomically:YES];
    if (!status) {
        NSError *failedToSave = [NSError errorWithDomain:ErrorDomain code:ARPHPhotoPickerErrorSaveFailed userInfo:@{ NSLocalizedDescriptionKey: SaveFailedErrorMessage }];
        _reject(ErrorDomain, SaveFailedErrorMessage, failedToSave);
        return nil;
    }

    return filePath;
}

- (NSString *)getTmpDirectory {
    NSString *tempDirectory = @"ar-image-temp-dir/";
    NSString *tempFullPath = [NSTemporaryDirectory() stringByAppendingString:tempDirectory];

    BOOL isDir;
    BOOL exists = [[NSFileManager defaultManager] fileExistsAtPath:tempFullPath isDirectory:&isDir];
    if (!exists) {
        [[NSFileManager defaultManager] createDirectoryAtPath:tempFullPath
                                  withIntermediateDirectories:YES attributes:nil error:nil];
    }
    return tempFullPath;
}

@end
