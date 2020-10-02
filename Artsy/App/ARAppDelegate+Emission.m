#import "ARAppDelegate+Emission.h"

#import "ARUserManager.h"
#import "Artist.h"
#import "ArtsyEcho.h"
#import "Gene.h"
#import "ArtsyAPI+Following.h"
#import "ArtsyAPI+Notifications.h"
#import "ARDispatchManager.h"
#import "ARNetworkErrorManager.h"
#import "ARTopMenuViewController.h"
#import "ARAppConstants.h"
#import "AROptions.h"
#import "ARMenuAwareViewController.h"
#import "ARAppNotificationsDelegate.h"
#import "ARAugmentedVIRSetupViewController.h"
#import "ARAugmentedRealityConfig.h"
#import "ARAugmentedFloorBasedVIRViewController.h"
#import "ARInternalMobileWebViewController.h"
#import "ARDefaults.h"
#import "ARNavigationController.h"
#import "ARTopMenuViewController.h"
#import "ARAppStatus.h"
#import "ARRouter.h"
#import "ARReactPackagerHost.h"
#import "AROptions.h"
#import "ARAuthValidator.h"

#import <react-native-config/ReactNativeConfig.h>
#import <Emission/AREmission.h>
#import <Emission/ARTemporaryAPIModule.h>
#import <Emission/AREventsModule.h>
#import <Emission/ARTakeCameraPhotoModule.h>
#import <Emission/ARRefineOptionsModule.h>
#import "AREigenMapContainerViewController.h"
#import <SDWebImage/SDImageCache.h>

#import <React/RCTUtils.h>
#import <React/RCTDevSettings.h>
#import <objc/runtime.h>
#import <ARAnalytics/ARAnalytics.h>
#import "ARAdminNetworkModel.h"
#import "Artsy-Swift.h"

@import Darwin.POSIX.sys.utsname;


@implementation ARAppDelegate (Emission)

- (void)setupEmission;
{
    if ([AROptions boolForOption:AROptionsStagingReactEnv]) {
        NSURL *packagerURL = [ARAdminNetworkModel fileURLForLatestCommitJavaScript];
        [self setupSharedEmissionWithPackagerURL:packagerURL];

    } else if ([AROptions boolForOption:AROptionsDevReactEnv]) {
        NSString *bundleUrlString = [NSString stringWithFormat:@"http://%@:8081/index.ios.bundle?platform=ios&dev=true", [ARReactPackagerHost hostname]];
        NSURL *packagerURL = [NSURL URLWithString:bundleUrlString];
        [self setupSharedEmissionWithPackagerURL:packagerURL];

    } else {
        // The normal flow for users
        [self setupSharedEmissionWithPackagerURL:nil];
    }
}

/*
deviceId taken from https://github.com/react-native-community/react-native-device-info/blob/d08f7f6db0407de5dc5252ebf2aa2ec58bd78dfc/ios/RNDeviceInfo/RNDeviceInfo.m
The MIT License (MIT)
Copyright (c) 2015 Rebecca Hughes
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
- (NSString *)deviceId;
{
    struct utsname systemInfo;
    uname(&systemInfo);
    NSString *deviceId = [NSString stringWithCString:systemInfo.machine
                                            encoding:NSUTF8StringEncoding];
    if ([deviceId isEqualToString:@"i386"] || [deviceId isEqualToString:@"x86_64"]) {
        deviceId = [NSString stringWithFormat:@"%s", getenv("SIMULATOR_MODEL_IDENTIFIER")];
    }
    return deviceId;
}

- (void)setupSharedEmissionWithPackagerURL:(NSURL *)packagerURL;
{
    NSString *userID = [[[ARUserManager sharedManager] currentUser] userID];
    NSString *authenticationToken = [[ARUserManager sharedManager] userAuthenticationToken];

    NSString *sentryDSN = nil;
    if (![ARAppStatus isDev]) {
        sentryDSN = [ReactNativeConfig envFor:[ARAppStatus isBeta] ? @"SEGMENT_STAGING_DSN" : @"SEGMENT_PRODUCTION_DSN"];
    }

    // Don't let the JS raise an error about Sentry's DSN being a stub on OSS builds
    if ([sentryDSN isEqualToString:@"-"]) {
        sentryDSN = nil;
    }

    NSString *gravity = [[ARRouter baseApiURL] absoluteString];
    NSString *metaphysics = [ARRouter baseMetaphysicsApiURLString];

    // Grab echo features and make that the base of all options
    ArtsyEcho *aero = [[ArtsyEcho alloc] init];
    [aero setup];

    NSString *env;
    NSString *stripePublishableKey;
    NSString *liveAuctionsURL;
    if ([AROptions boolForOption:ARUseStagingDefault]) {
        env = @"staging";
        stripePublishableKey = [aero.messages[@"StripeStagingPublishableKey"] content];
        liveAuctionsURL = @"https://live-staging.artsy.net";
    } else {
        env = @"production";
        stripePublishableKey = [aero.messages[@"StripeProductionPublishableKey"] content];
        liveAuctionsURL = @"https://live.artsy.net";
    }

    NSArray *fairSlugs = [aero legacyFairSlugs];
    NSArray *fairProfileSlugs = [aero legacyFairProfileSlugs];

    NSInteger launchCount = [[NSUserDefaults standardUserDefaults] integerForKey:ARAnalyticsAppUsageCountProperty];
    AROnboardingUserProgressStage onboardingState = [[NSUserDefaults standardUserDefaults] integerForKey:AROnboardingUserProgressionStage];

    NSDictionary *options = [self getOptionsForEmission:[aero featuresMap] labOptions:[AROptions labOptionsMap]];

    AREmission *emission = [[AREmission alloc] initWithState:@{
                                                                 [ARStateKey userID] : (userID ?: [NSNull null]),
                                                                 [ARStateKey authenticationToken] : (authenticationToken ?: [NSNull null]),
                                                                 [ARStateKey launchCount] : @(launchCount),
                                                                 [ARStateKey onboardingState] : onboardingState == AROnboardingStageDefault ? @"none" : onboardingState == AROnboardingStageOnboarded ? @"complete" : @"incomplete",
                                                                 [ARStateKey sentryDSN] : (sentryDSN ?: [NSNull null]),
                                                                 [ARStateKey stripePublishableKey] : (stripePublishableKey ?: [NSNull null]),
                                                                 [ARStateKey gravityURL] : gravity,
                                                                 [ARStateKey metaphysicsURL] : metaphysics,
                                                                 [ARStateKey predictionURL] : liveAuctionsURL,
                                                                 [ARStateKey webURL] : [[ARRouter baseWebURL] absoluteString],
                                                                 [ARStateKey userAgent] : ARRouter.userAgent,
                                                                 [ARStateKey env] : env,
                                                                 [ARStateKey options] : options,
                                                                 [ARStateKey legacyFairSlugs] : fairSlugs,
                                                                 [ARStateKey legacyFairProfileSlugs] : fairProfileSlugs,
                                                                 [ARStateKey deviceId] : self.deviceId
    } packagerURL:packagerURL];

    // Disable default React Native dev menu shake motion handler
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        RCTSwapInstanceMethods([UIWindow class], @selector(RCT_motionEnded:withEvent:), @selector(motionEnded:withEvent:));
    });

    [AREmission setSharedInstance:emission];

#pragma mark - Native Module: Push Notification Permissions

    emission.APIModule.notificationPermissionPrompter = ^() {
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

#pragma mark - Native Module: Refine filter

    emission.refineModule.triggerRefine = ^(NSDictionary *_Nonnull initial, NSDictionary *_Nonnull current, UIViewController *_Nonnull controller, RCTPromiseResolveBlock resolve, RCTPromiseRejectBlock reject) {
        [RefineSwiftCoordinator showRefineSettingForGeneSettings:controller
                                                         initial:initial
                                                         current:current
                                                      completion:^(NSDictionary<NSString *,id> * _Nullable newRefineSettings) {
            resolve(newRefineSettings);
        }];
    };

    emission.APIModule.authValidationChecker = ^() {
        if ([User currentUser]) {
            [ARAuthValidator validateAuthCredentialsAreCorrect];
        };
    };


#pragma mark - Native Module: Events/Analytics
    emission.eventsModule.eventOccurred = ^(NSDictionary *_Nonnull info) {
        NSMutableDictionary *properties = [info mutableCopy];
        if (info[@"action_type"] ) {
            // Track event
            [properties removeObjectForKey:@"action_type"];
            [ARAnalytics event:info[@"action_type"] withProperties:[properties copy]];
        } else if (info[@"action"]) {
            // Track event
            [ARAnalytics event:info[@"action"] withProperties:[properties copy]];
        } else {
            // Screen event
            [properties removeObjectForKey:@"context_screen"];
            [ARAnalytics pageView:info[@"context_screen"]  withProperties:[properties copy]];
        }
    };
}

- (void)updateEmissionOptions
{
    ArtsyEcho *aero = [[ArtsyEcho alloc] init];
    [aero setup];
    [[AREmission sharedInstance] updateState:@{[ARStateKey options] : [self getOptionsForEmission:[aero featuresMap] labOptions:[AROptions labOptionsMap]]}];
}

- (NSDictionary *)getOptionsForEmission:(NSDictionary *)echoFeatures labOptions:(NSDictionary *)labOptions
{
    // Set up all the difference places we get settings to merge into one place
    NSMutableDictionary *options = [NSMutableDictionary dictionary];

    [options addEntriesFromDictionary:echoFeatures];

    // Lab options come last (as they are admin/dev controlled, giving them a chance to override)
    [options addEntriesFromDictionary:labOptions];

    options[@"AROptionsPriceTransparency"] = @([options[@"AROptionsPriceTransparency"] boolValue] || [labOptions[AROptionsPriceTransparency] boolValue]);
    options[@"AROptionsArtistSeries"] = @([options[@"AROptionsArtistSeries"] boolValue] || [labOptions[AROptionsArtistSeries] boolValue]);

    return options;
}

@end
