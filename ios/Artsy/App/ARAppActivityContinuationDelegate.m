#import "ARAppActivityContinuationDelegate.h"

#import "ARUserManager.h"
#import "ArtsyAPI.h"

#import <CoreSpotlight/CoreSpotlight.h>
#import "AREmission.h"
#import <React/RCTLinkingManager.h>

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
        // Show the screen they clicked on
        if ([[ARUserManager sharedManager] hasExistingAccount]) {
            [RCTLinkingManager application:application
                      continueUserActivity:userActivity
                        restorationHandler:restorationHandler];
        }
    });
    return YES;
}

static void
DecodeURL(NSURL *URL, void (^callback)(NSURL *URL)) {
    if ([URL.host isEqualToString:@"click.artsy.net"]) {
        NSURLSessionDataTask *task = [[NSURLSession sharedSession] dataTaskWithURL:URL completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
            if (response.URL) {
                callback(response.URL);
            }
        }];
        [task resume];
    } else {
        callback(URL);
    }
}

@end
