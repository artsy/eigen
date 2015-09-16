#import "ARAppActivityContinuationDelegate.h"
@import CoreSpotlight;

@implementation ARAppActivityContinuationDelegate

+ (void)load
{
    [JSDecoupledAppDelegate sharedAppDelegate].activityContinuationDelegate = [[self alloc] init];
}

- (BOOL)application:(UIApplication *)application willContinueUserActivityWithType:(NSString *)userActivityType;
{
    return [userActivityType isEqualToString:NSUserActivityTypeBrowsingWeb]
            || (NSClassFromString(@"CSSearchableIndex") && [userActivityType isEqualToString:CSSearchableItemActionType])
                || [userActivityType hasPrefix:@"net.artsy.artsy."];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray *restorableObjects))restorationHandler;
{
    NSURL *URL = nil;
    if ((NSClassFromString(@"CSSearchableIndex") && [userActivity.activityType isEqualToString:CSSearchableItemActionType])) {
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
