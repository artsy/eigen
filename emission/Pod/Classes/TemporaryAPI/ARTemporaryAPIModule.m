#import "ARTemporaryAPIModule.h"
#import <UserNotifications/UserNotifications.h>
#import <Emission/AREmission.h>


@implementation ARTemporaryAPIModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(requestDirectNotificationPermissions)
{
    /* Used in settings screen to directly ask user for push permissions */
    dispatch_async(dispatch_get_main_queue(), ^{
        self.directNotificationPermissionPrompter();
    });
}


RCT_EXPORT_METHOD(requestPrepromptNotificationPermissions)
{
    /* Used on login with some additional logic before requesting permissions */
    dispatch_async(dispatch_get_main_queue(), ^{
        self.prepromptNotificationPermissionPrompter();
    });
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

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getUserEmail)
{
    return [[AREmission sharedInstance] stateStringForKey:[ARStateKey userEmail]];
}

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

@end
