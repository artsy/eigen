// MARK: Formatter Exempt

#import "ARAppDelegate+Analytics.h"
#import "ARAnalyticsConstants.h"
#import <Mantle/NSDictionary+MTLManipulationAdditions.h>
#import <AFNetworking/AFHTTPRequestOperation.h>
#import <Emission/AREmission.h>

#import "AROptions.h"
#import "Artsy-Swift.h"

#import "Artist.h"
#import "Artwork.h"
#import "ARDefaults.h"
#import "ARUserManager.h"
#import "Fair.h"
#import "FairOrganizer.h"
#import "Gene.h"
#import "Partner.h"
#import "PartnerShow.h"
#import "Profile.h"
// #import "ARAnalyticsVisualizer.h"
// #import "ARSailthruIntegration.h"
#import "ARAppNotificationsDelegate.h"

// View Controllers
#import "ARInternalMobileWebViewController.h"
#import "ARSignUpSplashViewController.h"
#import "ARPersonalizeViewController.h"
#import "AROnboardingPersonalizeTableViewController.h"
#import "ARPriceRangeViewController.h"
#import "ARViewInRoomViewController.h"
#import "ARSharingController.h"
#import "ARNavigationController.h"
// #import "ARSentryAnalyticsProvider.h"
#import "ARAugmentedRealityConfig.h"
#import "ARAugmentedVIRSetupViewController.h"
#import "ARAugmentedFloorBasedVIRViewController.h"


// Views
#import "ARAppStatus.h"

#import <react-native-config/ReactNativeConfig.h>
#import <Sentry/SentryClient.h>

// Note the Eigen Schema:
// https://docs.google.com/spreadsheets/u/1/d/1bLbeOgVFaWzLSjxLOBDNOKs757-zBGoLSM1lIz3OPiI/edit#gid=497747862

@implementation ARAppDelegate (Analytics)

- (void)trackDeeplinkWithTarget:(NSURL *)url referrer:(NSString *)referrer {
    NSString *concreteReferrer = referrer ? referrer : @"unknown";
    [[AREmission sharedInstance] sendEvent:ARAnalyticsDeepLinkOpened traits:@{
        @"link" : url.absoluteString,
        @"referrer": concreteReferrer,
    }];
}

- (void)setupAnalytics
{
    //EVERYTHING HERE IS MARKED FOR DELETION


    // NSString *sentryEnv = [ReactNativeConfig envFor:@"SENTRY_DSN"];

    // if (ARAppStatus.isDev) {
    //     sentryEnv = nil;
    // }

    // For OSS builds don't ship the sentry env
    // if (sentryEnv && ![sentryEnv isEqualToString:@"-"]) {
    //     id sentry = [[ARSentryAnalyticsProvider alloc] initWithDSN:sentryEnv];
    //     [ARAnalytics setupProvider:sentry];
    // }

    // if ([AROptions boolForOption:AROptionsShowAnalyticsOnScreen]) {
    //     ARAnalyticsVisualizer *visualizer = [ARAnalyticsVisualizer new];
    //     [ARAnalytics setupProvider:visualizer];
    // }

    // [ARAnalytics setupProvider:[ARSailthruIntegration new]];

    // [ARAnalytics incrementUserProperty:ARAnalyticsAppUsageCountProperty byInt:1];

    // switch ([[[UIScreen mainScreen] traitCollection] userInterfaceStyle]) {
    //     case UIUserInterfaceStyleUnspecified:
    //         [ARAnalytics setUserProperty:@"user interface style" toValue:@"unspecified"];
    //         break;
    //     case UIUserInterfaceStyleLight:
    //         [ARAnalytics setUserProperty:@"user interface style" toValue:@"light"];
    //         break;
    //     case UIUserInterfaceStyleDark:
    //         [ARAnalytics setUserProperty:@"user interface style" toValue:@"dark"];
    //         break;
    // }
}

@end
