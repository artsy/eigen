#import "ARAppActivityContinuationDelegate.h"
@import CoreSpotlight;

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
    return [userActivityType isEqualToString:NSUserActivityTypeBrowsingWeb]
            || (IsSpotlightActionTypeAvailable && [userActivityType isEqualToString:CSSearchableItemActionType])
                || [userActivityType hasPrefix:@"net.artsy.artsy."];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray *restorableObjects))restorationHandler;
{
    NSURL *URL = nil;
    if (IsSpotlightActionTypeAvailable && [userActivity.activityType isEqualToString:CSSearchableItemActionType]) {
        URL = [NSURL URLWithString:userActivity.userInfo[CSSearchableItemActivityIdentifier]];
    } else {
        URL = userActivity.webpageURL;
    }

    UIViewController *viewController = [ARSwitchBoard.sharedInstance loadURL:URL];
    if (viewController) {
        [[ARTopMenuViewController sharedController] pushViewController:viewController];
    }

    return YES;
}

@end
