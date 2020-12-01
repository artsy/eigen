#import "ARTemporaryAPIModule.h"
#import <UserNotifications/UserNotifications.h>
#import <PhotosUI/PhotosUI.h>
#import <React/RCTUtils.h>

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
    NSLog(@"Request photos from temporary api module");
    [self presentPhotoPicker];
}

- (void)presentPhotoPicker API_AVAILABLE(ios(14)) {
    NSLog(@"Called present photo picker");
    PHPickerConfiguration *config = [[PHPickerConfiguration alloc] init];
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
