#import "ARAppActivityContinuationDelegate.h"

#import "ARAppDelegate+Analytics.h"
#import "ARUserManager.h"
#import "ARSwitchBoard.h"
#import "ARTopMenuViewController.h"
#import "ArtsyAPI.h"

#import <CoreSpotlight/CoreSpotlight.h>

@implementation ARAppActivityContinuationDelegate

+ (void)load
{
    [JSDecoupledAppDelegate sharedAppDelegate].activityContinuationDelegate = [[self alloc] init];
}

- (BOOL)application:(UIApplication *)application willContinueUserActivityWithType:(NSString *)userActivityType;
{
    return [userActivityType isEqualToString:NSUserActivityTypeBrowsingWeb] || ([userActivityType isEqualToString:CSSearchableItemActionType]) || [userActivityType hasPrefix:@"net.artsy.artsy."];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray *restorableObjects))restorationHandler;
{
    NSURL *URL = nil;
    if ([userActivity.activityType isEqualToString:CSSearchableItemActionType]) {
        URL = [NSURL URLWithString:userActivity.userInfo[CSSearchableItemActivityIdentifier]];
    } else {
        URL = userActivity.webpageURL;
    }

    dispatch_block_t showViewController = ^{
        UIViewController *viewController = [ARSwitchBoard.sharedInstance loadURL:URL];
        if (viewController) {
            [[ARTopMenuViewController sharedController] pushViewController:viewController];
        }
    };

    if ([[ARUserManager sharedManager] hasExistingAccount]) {
        [[ARAppDelegate sharedInstance] lookAtURLForAnalytics:URL];
        showViewController();
    } else {
        // This is (hopefully) an edge-case where the user did not launch the app yet since installing it, in which case
        // we show on-boarding.
        [[ARAppDelegate sharedInstance] showOnboarding];
    }

    return YES;
}

@end
