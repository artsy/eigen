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

// TODO: Believe this should be an observable property in the same way selectedTab was
// Otherwise when you change notification permissions while on the profile push screen
// the setting get stale under trigger pull to refresh
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

