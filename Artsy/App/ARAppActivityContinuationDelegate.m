#import "ARAppActivityContinuationDelegate.h"

#import "ARAppDelegate+Analytics.h"
#import "ARUserManager.h"
#import "ArtsyAPI.h"

#import <CoreSpotlight/CoreSpotlight.h>
#import <Emission/AREmission.h>
#import <Adjust/Adjust.h>

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
            NSURL *convertedUrl = [Adjust convertUniversalLink:decodedURL scheme:@"artsy"];
            if (convertedUrl) {
                [Adjust appWillOpenUrl:decodedURL];
                
                // ensure the path includes our quirk of needing three slashes
                NSString *convertedPath = [convertedUrl absoluteString];
                NSString *fixedPath = [convertedPath stringByReplacingOccurrencesOfString:@"artsy://" withString:@"artsy:///"];
                [[AREmission sharedInstance] navigate:fixedPath];
            } else {
                [[AREmission sharedInstance] navigate:[decodedURL absoluteString]];
            }
        }
    });
    return YES;
}

static void
DecodeURL(NSURL *URL, void (^callback)(NSURL *URL)) {
    // TODO: Decode Braze url
    callback(URL);
}

@end
