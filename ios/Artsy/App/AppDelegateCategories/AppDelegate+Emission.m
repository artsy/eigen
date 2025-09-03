#import "AppDelegate+Emission.h"
#import "ArtsyAPI+Notifications.h"
#import "ARRouter.h"
#import "AREmission.h"
#import "ARTemporaryAPIModule.h"
#import "ARUserManager.h"
#import "User.h"
#import "ARAnalyticsConstants.h"

@import Darwin.POSIX.sys.utsname;


@implementation ARAppDelegateHelper (Emission)

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

    return emission;
}

@end
