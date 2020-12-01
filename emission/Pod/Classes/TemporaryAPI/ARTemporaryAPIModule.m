#import "ARTemporaryAPIModule.h"
#import <UserNotifications/UserNotifications.h>
#import <PhotosUI/PhotosUI.h>
#import <React/RCTUtils.h>
#import <RNImageCropPicker/Compression.h>
#import <RNImageCropPicker/ImageCropPicker.h>
#import <RNImageCropPicker/UIImage+Extension.h>

@interface ARTemporaryAPIModule()
@property (nonatomic, strong) RCTResponseSenderBlock photoResponseBlock;
@end

@implementation ARTemporaryAPIModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(requestNotificationPermissions)
{
    /* In eigen, this should request push notification permissions */
    self.notificationPermissionPrompter();
}

RCT_EXPORT_METHOD(fetchNotificationPermissions:(RCTResponseSenderBlock)callback)
{
    UNUserNotificationCenter *notifCenter = [UNUserNotificationCenter currentNotificationCenter];
    [notifCenter getNotificationSettingsWithCompletionHandler:^(UNNotificationSettings * _Nonnull settings) {
        UNAuthorizationStatus status = [settings authorizationStatus];
        switch (status) {
            case UNAuthorizationStatusAuthorized:
                callback(@[[NSNull null], @"authorized"]);
                break;
            case UNAuthorizationStatusDenied:
                callback(@[[NSNull null], @"denied"]);
                break;
            case UNAuthorizationStatusNotDetermined:
                callback(@[[NSNull null], @"notDetermined"]);
                break;
        }
    }];
}

RCT_EXPORT_METHOD(requestPhotos:(RCTResponseSenderBlock)callback)
{
    self.photoResponseBlock = callback;
    [self presentPhotoPicker];
}

- (void)presentPhotoPicker API_AVAILABLE(ios(14)) {
    PHPickerConfiguration *config = [[PHPickerConfiguration alloc] init];
    config.selectionLimit = 10;
    config.filter = [PHPickerFilter imagesFilter];
    PHPickerViewController *picker = [[PHPickerViewController alloc] initWithConfiguration:config];
    picker.delegate = self;
    UIViewController *currentVC = RCTPresentedViewController();
    dispatch_async(dispatch_get_main_queue(), ^{
        [currentVC presentViewController:picker animated:true completion:nil];
    });
}


#pragma mark - PHPickerViewControllerDelegate
- (void)picker:(PHPickerViewController *)picker
didFinishPicking:(NSArray<PHPickerResult *> *)results  API_AVAILABLE(ios(14)) {
    UIViewController *currentVC = RCTPresentedViewController();
    [currentVC dismissViewControllerAnimated:true completion:nil];

    if (results.count == 0) {
         NSError *noPhotosError = [NSError errorWithDomain:@"PhotoPicker" code:404 userInfo:@{ NSLocalizedDescriptionKey: @"No photos returned." }];
        _photoResponseBlock(@[RCTJSErrorFromNSError(noPhotosError)]);
    } else {
        NSMutableArray *imagePaths = [[NSMutableArray alloc] init];
        Compression *compression = [[Compression alloc] init];
        dispatch_group_t imageLoadGroup = dispatch_group_create();
        for (PHPickerResult *result in results) {
            if ([result.itemProvider canLoadObjectOfClass:UIImage.class]) {
                dispatch_group_enter(imageLoadGroup);
                [result.itemProvider loadObjectOfClass:[UIImage class] completionHandler:^(__kindof id<NSItemProviderReading> _Nullable object, NSError * _Nullable error) {
                    if ([object isKindOfClass:[UIImage class]]) {
                        UIImage *image = (UIImage*)object;
                        ImageResult *imageResult = [compression compressImage:[image fixOrientation] withOptions:nil];
                        NSString *filePath = [self persistFile:imageResult.data];
                        [imagePaths addObject:filePath];
                    }
                    dispatch_group_leave(imageLoadGroup);
                }];
            }
        }

        double delayInSeconds = 0.5;
        dispatch_time_t timeout = dispatch_time(DISPATCH_TIME_NOW, delayInSeconds * NSEC_PER_SEC);
        dispatch_group_wait(imageLoadGroup, DISPATCH_TIME_FOREVER);
        if (results.count == 0) {
            NSError *noPhotosError = [NSError errorWithDomain:@"PhotoPicker" code:404 userInfo:@{ NSLocalizedDescriptionKey: @"No photos returned." }];
            _photoResponseBlock(@[RCTJSErrorFromNSError(noPhotosError)]);
        } else {
            _photoResponseBlock(@[[NSNull null], imagePaths]);
        }
    }
    _photoResponseBlock = nil;
}

- (NSString *)persistFile:(NSData*)data {
    // create temp file
    NSString *tmpDirFullPath = [self getTmpDirectory];
    NSString *filePath = [tmpDirFullPath stringByAppendingString:[[NSUUID UUID] UUIDString]];
    filePath = [filePath stringByAppendingString:@".jpg"];

    // save cropped file
    BOOL status = [data writeToFile:filePath atomically:YES];
    if (!status) {
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


RCT_EXPORT_METHOD(markNotificationsRead:(RCTResponseSenderBlock)block)
{
    /* In eigen, this should mark the notifications as read using ArtsyAPI */
    self.notificationReadStatusAssigner(block);
}

RCT_EXPORT_METHOD(setApplicationIconBadgeNumber:(nonnull NSNumber *)count)
{
    __block int icount = [count intValue];
    dispatch_async(dispatch_get_main_queue(), ^{
        [UIApplication sharedApplication].applicationIconBadgeNumber = icount;
    });
}

RCT_EXPORT_METHOD(validateAuthCredentialsAreCorrect)
{
    self.authValidationChecker();
}

- (NSDictionary *)constantsToExport
{
    return @{@"appVersion"  : [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"]};

}

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

@end
