#import "ARAppActivityContinuationDelegate.h"

#import "ARAppDelegate+Analytics.h"
#import "ARUserManager.h"
#import "ARSwitchBoard.h"
#import "ARTopMenuViewController.h"
#import "ArtsyAPI.h"
#import "ArtsyAPI+Sailthru.h"

#import <CoreSpotlight/CoreSpotlight.h>

static  NSString *SailthruLinkDomain = @"link.artsy.net";

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

    DecodeURL(URL, ^(NSURL *decodedURL) {
        // Always let analytics know there's a URL being received
        [[ARAppDelegate sharedInstance] trackDeeplinkWithTarget:decodedURL referrer:userActivity.referrerURL.absoluteString];

        // Show the screen they clicked on
        if ([[ARUserManager sharedManager] hasExistingAccount]) {
            UIViewController *viewController = [ARSwitchBoard.sharedInstance loadURL:decodedURL];
            if (viewController) {
                [[ARTopMenuViewController sharedController] pushViewController:viewController];
            }
        }
    });
    return YES;
}

static void
DecodeURL(NSURL *URL, void (^callback)(NSURL *URL)) {
    if ([URL.host isEqualToString:SailthruLinkDomain]) {
        [ArtsyAPI getDecodedURLAndRegisterClick:URL completion:callback];
    } else {
        callback(URL);
    }
}

@end
