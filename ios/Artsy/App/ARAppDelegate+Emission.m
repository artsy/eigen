#import "ARAppDelegate+Emission.h"

#import "ARUserManager.h"
#import "Artist.h"
#import "ArtsyEcho.h"
#import "Gene.h"
#import "ArtsyAPI+Following.h"
#import "ArtsyAPI+Notifications.h"
#import "ARDispatchManager.h"
#import "ARNetworkErrorManager.h"
#import "ARAppConstants.h"
#import "AROptions.h"
#import "ARMenuAwareViewController.h"
#import "ARAppNotificationsDelegate.h"
#import "ARAugmentedVIRSetupViewController.h"
#import "ARAugmentedRealityConfig.h"
#import "ARAugmentedFloorBasedVIRViewController.h"
#import "ARDefaults.h"
#import "ARNavigationController.h"
#import "ARAppStatus.h"
#import "ARRouter.h"
#import "AROptions.h"

#import <react-native-config/ReactNativeConfig.h>
#import "AREmission.h"
#import "ARTemporaryAPIModule.h"
#import "AREventsModule.h"
#import <SDWebImage/SDImageCache.h>

#import <React/RCTUtils.h>
#import <React/RCTDevSettings.h>
#import <objc/runtime.h>
#import "Artsy-Swift.h"

@import Darwin.POSIX.sys.utsname;


@implementation ARAppDelegate (Emission)

- (AREmission *)setupSharedEmission
{
    NSString *userID = [[[ARUserManager sharedManager] currentUser] userID];
    NSString *userEmail = [[[ARUserManager sharedManager] currentUser] email];

    // Clear the auth token for any users who aren't logged in
    if (userID == nil) {
        [ARUserManager clearAccessToken];
    }

    NSString *authenticationToken = [[ARUserManager sharedManager] userAuthenticationToken];

    NSInteger launchCount = [[NSUserDefaults standardUserDefaults] integerForKey:ARAnalyticsAppUsageCountProperty];

    AREmission *emission = [[AREmission alloc] initWithState:@{
        [ARStateKey userID] : (userID ?: [NSNull null]),
        [ARStateKey userEmail] : (userEmail ?: [NSNull null]),
        [ARStateKey authenticationToken] : (authenticationToken ?: [NSNull null]),
        [ARStateKey launchCount] : @(launchCount),
        [ARStateKey userAgent] : ARRouter.userAgent,
    }];

    [emission.notificationsManagerModule afterBootstrap:^{
        [ARRouter setup];
    }];

    [AREmission setSharedInstance:emission];

#pragma mark - Native Module: Push Notification Permissions

    emission.APIModule.directNotificationPermissionPrompter = ^() {
        ARAppNotificationsDelegate *delegate = [[JSDecoupledAppDelegate sharedAppDelegate] remoteNotificationsDelegate];
        [delegate registerForDeviceNotificationsWithApple];
    };

#pragma mark - Native Module: Follow status

    emission.APIModule.notificationReadStatusAssigner = ^(RCTResponseSenderBlock block) {
        [ArtsyAPI markUserNotificationsReadWithSuccess:^(id response) {
            block(@[[NSNull null]]);
        } failure:^(NSError *error) {
            block(@[ RCTJSErrorFromNSError(error)]);
        }];
    };

#pragma mark - Native Module: Events/Analytics
    emission.eventsModule.eventOccurred = ^(NSDictionary *_Nonnull info) {
        NSMutableDictionary *properties = [info mutableCopy];
        if (info[@"action_type"]) {
            // Track event
            [properties removeObjectForKey:@"action_type"];
            [[AREmission sharedInstance] sendEvent:info[@"action_type"] traits:[properties copy]];
        } else if (info[@"action"]) {
            if ([info[@"action"] isEqualToString:@"screen"]) {
                // Screen event from cohesion
                [[AREmission sharedInstance] sendScreenEvent:info[@"context_screen_owner_type"] traits:[properties copy]];
            } else {
                // Track event
                [[AREmission sharedInstance] sendEvent:info[@"action"] traits:[properties copy]];
            }
        } else {
            // Screen event
            [[AREmission sharedInstance] sendScreenEvent:info[@"context_screen"]  traits:[properties copy]];
        }
    };

    return emission;
}

@end
