#import "ARTemporaryAPIModule.h"
#import <UserNotifications/UserNotifications.h>
#import "AREmission.h"
#import "ArtsyAPI+Notifications.h"
#import "React/RCTUtils.h"

@implementation ARTemporaryAPIModule

RCT_EXPORT_MODULE();

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

RCT_EXPORT_METHOD(markNotificationsRead:(RCTResponseSenderBlock)block)
{
    [ArtsyAPI markUserNotificationsReadWithSuccess:^(id response) {
        block(@[[NSNull null]]);
    } failure:^(NSError *error) {
        block(@[ RCTJSErrorFromNSError(error)]);
    }];
}

RCT_EXPORT_METHOD(setApplicationIconBadgeNumber:(nonnull NSNumber *)count)
{
    __block int icount = [count intValue];
    dispatch_async(dispatch_get_main_queue(), ^{
        [UIApplication sharedApplication].applicationIconBadgeNumber = icount;
    });
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getUserEmail)
{
    return [[AREmission sharedInstance] stateStringForKey:[ARStateKey userEmail]];
}

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

@end
