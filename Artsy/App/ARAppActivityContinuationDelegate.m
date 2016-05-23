#import "ARAppActivityContinuationDelegate.h"

#import "ARAppDelegate.h"
#import "ARUserManager.h"
#import "ARSwitchBoard.h"
#import "ARTopMenuViewController.h"
#import "ArtsyAPI.h"

#import <CoreSpotlight/CoreSpotlight.h>

// Only available on iOS 9.
static BOOL IsSpotlightActionTypeAvailable = NO;


@implementation ARAppActivityContinuationDelegate

+ (void)load
{
    IsSpotlightActionTypeAvailable = &CSSearchableItemActionType != NULL;
    [JSDecoupledAppDelegate sharedAppDelegate].activityContinuationDelegate = [[self alloc] init];
}

- (BOOL)application:(UIApplication *)application willContinueUserActivityWithType:(NSString *)userActivityType;
{
    return [userActivityType isEqualToString:NSUserActivityTypeBrowsingWeb] || (IsSpotlightActionTypeAvailable && [userActivityType isEqualToString:CSSearchableItemActionType]) || [userActivityType hasPrefix:@"net.artsy.artsy."];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray *restorableObjects))restorationHandler;
{
    NSURL *URL = nil;
    if (IsSpotlightActionTypeAvailable && [userActivity.activityType isEqualToString:CSSearchableItemActionType]) {
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
        showViewController();
    } else {
        // This is (hopefully) an edge-case where the user did not launch the app yet since installing it, in which case
        // we show on-boarding.
        [(ARAppDelegate *)[[JSDecoupledAppDelegate sharedAppDelegate] appStateDelegate] showOnboarding];
    }

    return YES;
}

@end
