//
//  ARPermissions.m
//  Emission
//
//  Created by Brian Beckerle on 7/30/20.
//

#import "ARPermissions.h"
#import <UserNotifications/UserNotifications.h>

@implementation ARPermissions

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(fetchNotificationPermissions:(RCTResponseSenderBlock)callback)
{
    UNUserNotificationCenter *notifCenter = [UNUserNotificationCenter currentNotificationCenter];
    [notifCenter getNotificationSettingsWithCompletionHandler:^(UNNotificationSettings * _Nonnull settings) {
        UNAuthorizationStatus *status = [settings authorizationStatus];
        if (status == UNAuthorizationStatusAuthorized) {
            callback(@[[NSNull null], @YES]);
        } else {
            callback(@[[NSNull null], @NO]);
        }
    }];
}

@end

