#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <FBSDKLoginKit/FBSDKLoginKit.h>
#import <ORKeyboardReactingApplication/ORKeyboardReactingApplication.h>
#import <iRate/iRate.h>
#import <AFOAuth1Client/AFOAuth1Client.h>
#import <UICKeyChainStore/UICKeyChainStore.h>
#import <Adjust/Adjust.h>

#import <ARAnalytics/ARAnalytics.h>
#import "ARAnalyticsConstants.h"

#import "ARAppDelegate.h"
#import "ARAppDelegate+Analytics.h"
#import "ARAppDelegate+Emission.h"
#import "ARAppDelegate+TestScenarios.h"
#import "ARAppNotificationsDelegate.h"
#import "ARAppConstants.h"
#import "ARFonts.h"
#import "ARUserManager.h"
#import "AROptions.h"
#import "ARSwitchBoard.h"
#import "ARTopMenuViewController.h"

#import "UIViewController+InnermostTopViewController.h"
#import "ARAdminSettingsViewController.h"
#import "ARQuicksilverViewController.h"
#import "ARRouter.h"
#import "ARNetworkConstants.h"
#import "ArtsyAPI+Private.h"
#import "ArtsyAPI+SiteFunctions.h"
#import "ARFileUtils.h"
#import "ARSpotlight.h"
#import "ARWebViewCacheHost.h"
#import "ARAppStatus.h"
#import "Artsy-Swift.h"
#import "ARSystemTime.h"
#import "ARDispatchManager.h"
#import "ARLogger.h"
#import "FeaturedLink.h"
#import "OrderedSet.h"
#import "ArtsyAPI+OrderedSets.h"
#import "ARAuthValidator.h"

#import "UIDevice-Hardware.h"
#import "ArtsyEcho.h"

#import <Keys/ArtsyKeys.h>
#import "AREndOfLineInternalMobileWebViewController.h"

#import <DHCShakeNotifier/UIWindow+DHCShakeRecognizer.h>
#import <VCRURLConnection/VCR.h>
#import <ObjectiveSugar/ObjectiveSugar.h>
#import <React/RCTDevSettings.h>

// demo
#import "ARDemoSplashViewController.h"


@interface ARAppDelegate ()
@property (strong, nonatomic, readwrite) NSString *referralURLRepresentation;
@property (strong, nonatomic, readwrite) NSString *landingURLRepresentation;
@property (strong, nonatomic, readwrite) NSDictionary *initialLaunchOptions;

@end


@implementation ARAppDelegate

static ARAppDelegate *_sharedInstance = nil;

+ (void)load
{
    _sharedInstance = [[self alloc] init];
    [JSDecoupledAppDelegate sharedAppDelegate].appStateDelegate = _sharedInstance;
    [JSDecoupledAppDelegate sharedAppDelegate].appDefaultOrientationDelegate = (id)_sharedInstance;

    // TODO Until we drop iOS 8 support, we can’t really conform to the `JSApplicationURLResourceOpeningDelegate`
    // protocol, as it means we would have to implement `application:openURL:options:` which seems tricky if we still
    // have to implement `application:openURL:sourceApplication:annotation:` as well.
    [JSDecoupledAppDelegate sharedAppDelegate].URLResourceOpeningDelegate = (id)_sharedInstance;
}

+ (ARAppDelegate *)sharedInstance
{
    return _sharedInstance;
}

// Because we‘ve locked the launch screen on iPhone to portrait mode, we now have to unlock all of them again such that
// VCs get to decide the allowed orientations, specifically for the view in room VC.
- (NSUInteger)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window
{
    return UIInterfaceOrientationMaskAll;
}

/// These are the pre-requisites for doing any background networking with Eigen.

- (BOOL)application:(UIApplication *)application willFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    if (ARIsRunningInDemoMode) {
        [[ARUserManager sharedManager] disableSharedWebCredentials];
        [ARUserManager clearUserData];
    }

    if ([[NSProcessInfo processInfo] environment][@"TEST_SCENARIO"]) {
        [self setupIntegrationTests];
    }

    [ARDefaults setup];
    [ARRouter setup];

    self.initialLaunchOptions = launchOptions;
    return YES;
}

/// This is called when we are going to present a user interface, which
/// is both on traditional app launch, and every time we are backgrounded and back.

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    [self setupForAppLaunch];
}

- (void)setupForAppLaunch
{
    // In case everything's already set up
    if (self.window) {
        return;
    }

    // Temp Fix for: https://github.com/artsy/eigen/issues/602
    [self forceCacheCustomFonts];

    // This cannot be moved after the view setup code, as it
    // relies on swizzling alloc on new objects, thus should be
    // one of the first things that happen.
    [self setupAnalytics];

    [JSDecoupledAppDelegate sharedAppDelegate].remoteNotificationsDelegate = [[ARAppNotificationsDelegate alloc] init];

    self.window = [[ARWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];

    [self setupAdminTools];

    [self setupRatingTool];
    [self countNumberOfRuns];

    _landingURLRepresentation = self.landingURLRepresentation ?: @"https://artsy.net";

    [[ARLogger sharedLogger] startLogging];

    // This has to be checked *before* creating the first Xapp token.
    NSInteger numberOfRuns = [[NSUserDefaults standardUserDefaults] integerForKey:ARAnalyticsAppUsageCountProperty];

    BOOL shouldShowOnboarding;

    BOOL firstTimeUser = (numberOfRuns == 1);
    BOOL hasAccount = [[ARUserManager sharedManager] hasExistingAccount];
    AROnboardingUserProgressStage onboardingState = [[NSUserDefaults standardUserDefaults] integerForKey:AROnboardingUserProgressionStage];

    if (firstTimeUser && !hasAccount && (onboardingState == AROnboardingStageDefault)) {
        // you are a fresh install - you will be onboarding and we set the enum to check when you come back
        [[NSUserDefaults standardUserDefaults] setInteger:AROnboardingStageOnboarding forKey:AROnboardingUserProgressionStage];
        shouldShowOnboarding = YES;
    } else if (onboardingState == AROnboardingStageOnboarding) {
        // you're coming back midway through your onboarding - we force you to complete it
        shouldShowOnboarding = YES;
    } else if (hasAccount) {
        // so if you're not onboarding, you've either already completed it or opened the app before
        shouldShowOnboarding = NO;
    } else {
        // fallback, if the user has no account, they have to log in / onboard to prevent crash
        shouldShowOnboarding = YES;
    }

    if (ARIsRunningInDemoMode) {
        [self.viewController presentViewController:[[ARDemoSplashViewController alloc] init] animated:NO completion:nil];
        [self performSelector:@selector(finishDemoSplash) withObject:nil afterDelay:1];

    } else if (shouldShowOnboarding) {
        // In case the user has not signed-in yet, this will register as an anonymous device on the Artsy API.
        // This way we can use the Artsy API for onboarding searches and suggestsions
        // From there onwards, once the user account is created, technically everything should be done with user authentication.
        [ArtsyAPI getXappTokenWithCompletion:^(NSString *xappToken, NSDate *expirationDate) {
            // Sync clock with server
            [ARSystemTime sync];
        }];

        if (hasAccount) {
            // you've created an account, but haven't finished personalisation
            [self showOnboardingWithState:ARInitialOnboardingStatePersonalization];
        } else {
            // you're new - welcome! we onboard you
            [self showOnboarding];
        }

    } else {
        // Default logged in setup path
        [self startupApp];

        if ([User currentUser]) {
            [ARAuthValidator validateAuthCredentialsAreCorrect];
            [ARSpotlight indexAllUsersFavorites];
        };
    }
    [self.window makeKeyAndVisible];

    NSDictionary *remoteNotification = self.initialLaunchOptions[UIApplicationLaunchOptionsRemoteNotificationKey];
    if (remoteNotification) {
        // The app was not running, so considering it to be in the UIApplicationStateInactive state.
        [self.remoteNotificationsDelegate applicationDidReceiveRemoteNotification:remoteNotification
                                                               inApplicationState:UIApplicationStateInactive];
    }

    [ARWebViewCacheHost startup];
    [self registerNewSessionOpened];
    ar_dispatch_after(1, ^{
        [self killSwitch];
    });
}

/// This is called when the app is almost done launching
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    /// Make sure we set up here so there is an ARTopMenuViewController for routing when launching from a universal link
    [self setupForAppLaunch];

    FBSDKApplicationDelegate *fbAppDelegate = [FBSDKApplicationDelegate sharedInstance];
    [fbAppDelegate application:application didFinishLaunchingWithOptions:launchOptions];
    return YES;
}


- (void)startupApp
{
    [self setupEmission];
    self.viewController = [ARTopMenuViewController sharedController];
    self.window.rootViewController = self.viewController;
}

- (void)registerNewSessionOpened
{
    [ARAnalytics startTimingEvent:ARAnalyticsTimePerSession];

    if ([User currentUser]) {
        [self.remoteNotificationsDelegate fetchNotificationCounts];
    }
}

/// This happens every time we come _back_ to the app from the background

- (void)applicationWillEnterForeground:(UIApplication *)application
{
    [self registerNewSessionOpened];
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
    [ARAnalytics finishTimingEvent:ARAnalyticsTimePerSession];
}

- (ARAppNotificationsDelegate *)remoteNotificationsDelegate;
{
    return [[JSDecoupledAppDelegate sharedAppDelegate] remoteNotificationsDelegate];
}

- (void)showOnboarding;
{
    [self showOnboardingWithState:ARInitialOnboardingStateSlideShow];
}

- (void)killSwitch;
{
    Message *killSwitchVersion = ARSwitchBoard.sharedInstance.echo.messages[@"KillSwitchBuildMinimum"];
    if(killSwitchVersion.content != nil){
        NSDictionary *infoDictionary = [[[NSBundle mainBundle] infoDictionary] mutableCopy];
        NSString *buildVersion = infoDictionary[@"CFBundleShortVersionString"];
        NSString *echoMinimumBuild = killSwitchVersion.content;
        
        if ([buildVersion compare:echoMinimumBuild options:NSNumericSearch] == NSOrderedDescending) {
            UIAlertController *alert = [UIAlertController
                                         alertControllerWithTitle:@"Version out of date"
                                         message:@"Please update your Artsy app."
                                         preferredStyle:UIAlertControllerStyleAlert];
            UIAlertAction* linkToAppButton = [UIAlertAction
                                              actionWithTitle:@"Download"
                                              style:UIAlertActionStyleDefault
                                              handler:^(UIAlertAction * action) {
                                                  NSString *iTunesLink = @"https://apps.apple.com/us/app/artsy-buy-sell-original-art/id703796080";
                                                  [[UIApplication sharedApplication] openURL:[NSURL URLWithString:iTunesLink]];
                                                  // We wait 1 second to make sure the view controller hierarchy has been set up.
                                                  ar_dispatch_after(1, ^{
                                                      exit(0);
                                                  });
                                              }];
            
            [alert addAction:linkToAppButton];
            
            [self.window.rootViewController presentViewController:alert animated:YES completion:nil];
        }
    }
}

- (void)showOnboardingWithState:(enum ARInitialOnboardingState)state
{
    AROnboardingViewController *onboardVC = [[AROnboardingViewController alloc] initWithState:state];
    self.window.rootViewController = onboardVC;
}

- (void)finishDemoSplash
{
    [self.viewController dismissViewControllerAnimated:YES completion:nil];
}

- (void)forceCacheCustomFonts
{
    __unused UIFont *font = [UIFont serifBoldItalicFontWithSize:12];
    font = [UIFont serifBoldFontWithSize:12];
    font = [UIFont serifSemiBoldFontWithSize:12];
    font = [UIFont serifFontWithSize:12];
    font = [UIFont serifItalicFontWithSize:12];
    font = [UIFont sansSerifFontWithSize:12];
    font = [UIFont smallCapsSerifFontWithSize:12];
}

- (void)finishOnboarding:(AROnboardingViewController *)viewController animated:(BOOL)animated
{
    // We now have a proper Artsy user, not just a local temporary ID
    // So we have to re-identify the analytics user
    // to ensure we start sending the Gravity ID as well as the local temporary ID
    [ARUserManager identifyAnalyticsUser];

    // And set up emission
    [self startupApp];

    ar_dispatch_main_queue(^{
        if ([User currentUser]) {
            [self.remoteNotificationsDelegate fetchNotificationCounts];
            [ARSpotlight indexAllUsersFavorites];
            [self setupAdminTools];
        }
    });
}

- (void)setupAdminTools
{
    if (!ARAppStatus.isBetaDevOrAdmin) {
        return;
    }

    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(rageShakeNotificationRecieved) name:DHCSHakeNotificationName object:nil];

    if ([AROptions boolForOption:AROptionsUseVCR]) {
        NSURL *url = [NSURL fileURLWithPath:[ARFileUtils cachesPathWithFolder:@"vcr" filename:@"eigen.json"]];
        [VCR loadCassetteWithContentsOfURL:url];
        [VCR start];
    }

    [ORKeyboardReactingApplication registerForCallbackOnKeyDown:ORTildeKey:^{
        [self rageShakeNotificationRecieved];
    }];

    [ORKeyboardReactingApplication registerForCallbackOnKeyDown:ORSpaceKey:^{
        [self showQuicksilver];
    }];

    [ORKeyboardReactingApplication registerForCallbackOnKeyDown:ORDeleteKey:^{
        [ARTopMenuViewController.sharedController.rootNavigationController popViewControllerAnimated:YES];
    }];
}

- (void)setupRatingTool
{
    BOOL isLoggedIn = [[ARUserManager sharedManager] hasExistingAccount];
    if (isLoggedIn) {
        [iRate sharedInstance].promptForNewVersionIfUserRated = NO;
        [iRate sharedInstance].verboseLogging = NO;
    }
}

// For pre-iOS 10
- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication
         annotation:(id)annotation
{
    return [self application:application openURL:url options: @{
        UIApplicationOpenURLOptionsSourceApplicationKey: sourceApplication ?: @"",
        UIApplicationOpenURLOptionsAnnotationKey: annotation  ?: @""
    }];
}

// For iOS 10
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options
{
    NSString *sourceApplication = options[UIApplicationOpenURLOptionsSourceApplicationKey];
    id annotation = options[UIApplicationOpenURLOptionsAnnotationKey];

    _referralURLRepresentation = options[UIApplicationOpenURLOptionsSourceApplicationKey];
    _landingURLRepresentation = [url absoluteString];

    [self lookAtURLForAnalytics:url];


    // Twitter SSO
    if ([[url absoluteString] hasPrefix:ARTwitterCallbackPath]) {
        NSNotification *notification = nil;
        notification = [NSNotification notificationWithName:kAFApplicationLaunchedWithURLNotification
                                                     object:nil
                                                   userInfo:@{kAFApplicationLaunchOptionsURLKey : url}];

        [[NSNotificationCenter defaultCenter] postNotification:notification];
        return YES;
    }

    // Facebook
    NSString *fbScheme = [@"fb" stringByAppendingString:[[NSBundle mainBundle] objectForInfoDictionaryKey:@"FacebookAppID"]];

    if ([[url scheme] isEqualToString:fbScheme]) {
        // Call FBAppCall's handleOpenURL:sourceApplication to handle Facebook app responses
        FBSDKApplicationDelegate *fbAppDelegate = [FBSDKApplicationDelegate sharedInstance];

        // If they this returns true it means Facebook handled the URL
        if ([fbAppDelegate application:app openURL:url sourceApplication:sourceApplication annotation:annotation]) {
            return YES;
        }

        // OK, so it could be a link from the app, which looks like:
        // fb308278682573501://authorize?target_url=https%3A%2F%2Fwww.artsy.net%2Farticle%2Fartsy-editorial-peruvian-artists-mansion-idyllic-art-filled-hotel
        NSURLComponents *components = [NSURLComponents componentsWithString:url.absoluteString];
        NSURLQueryItem *target = [components.queryItems find:^BOOL(NSURLQueryItem *object) {
            return [object.name isEqualToString:@"target_url"];
        }];

        if (target) {
            url = [NSURL URLWithString: target.value];
        }
    }

    if ([url isFileURL]) {
        // AirDrop receipt
        NSData *fileData = [NSData dataWithContentsOfURL:url];
        NSDictionary *data = [NSJSONSerialization JSONObjectWithData:fileData options:0 error:nil];
        NSString *urlString = [data valueForKey:@"url"];

        if (urlString) {
            _landingURLRepresentation = urlString;

            UIViewController *viewController = [ARSwitchBoard.sharedInstance loadURL:[NSURL URLWithString:urlString]];
            if (viewController) {
                [[ARTopMenuViewController sharedController] pushViewController:viewController];
            }
            return YES;

        } else {
            return NO;
        }
    }

    UIViewController *viewController = [ARSwitchBoard.sharedInstance loadURL:url];
    if (viewController) {
        [[ARTopMenuViewController sharedController] pushViewController:viewController];
    }

    return YES;
}

- (void)rageShakeNotificationRecieved
{
    UINavigationController *navigationController = ARTopMenuViewController.sharedController.rootNavigationController;

    if (![navigationController.topViewController isKindOfClass:ARAdminSettingsViewController.class]) {
        if (![UIDevice isPad]) {
            // For some reason the supported orientation isn’t respected when this is pushed on top
            // of a landscape VIR view.
            //
            // Since this is a debug/admin only issue, it’s safe to use private API here.
            [[UIDevice currentDevice] setValue:@(UIInterfaceOrientationPortrait) forKey:@"orientation"];
        }
        ARAdminSettingsViewController *adminSettings = [[ARAdminSettingsViewController alloc] initWithStyle:UITableViewStyleGrouped];
        [navigationController pushViewController:adminSettings animated:YES];
    }
    
}

- (void)showQuicksilver
{
    UINavigationController *navigationController = ARTopMenuViewController.sharedController.rootNavigationController;

    // As this is hooked up to return everywhere, it shouldn't be able to
    // call itself when it's just finished showing
    NSInteger count = navigationController.viewControllers.count;

    if (count > 1) {
        id oldVC = navigationController.viewControllers[count - 2];
        if ([oldVC isKindOfClass:[ARQuicksilverViewController class]]) {
            return;
        }
    }

    ARQuicksilverViewController *adminSettings = [[ARQuicksilverViewController alloc] init];
    [navigationController pushViewController:adminSettings animated:YES];
}

- (void)countNumberOfRuns
{
    NSInteger numberOfRuns = [[NSUserDefaults standardUserDefaults] integerForKey:ARAnalyticsAppUsageCountProperty] + 1;
    if (numberOfRuns == 1) {
        [ARAnalytics event:ARAnalyticsFreshInstall];
        [Adjust trackEvent:[ADJEvent eventWithEventToken:ARAdjustFirstUserInstall]];
    }

    if (numberOfRuns == 3) {
        [[ARUserManager sharedManager] tryStoreSavedCredentialsToWebKeychain];
    }

    [[NSUserDefaults standardUserDefaults] setInteger:numberOfRuns forKey:ARAnalyticsAppUsageCountProperty];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

@end


@implementation ARWindow

- (void)sendEvent:(UIEvent *)event
{
    [super sendEvent:event];

    if (event.type == UIEventTypeTouches) {
        self.lastTouchPoint = [[[event allTouches] anyObject] locationInView:self];
    }
}

@end
