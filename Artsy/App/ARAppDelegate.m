#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <FBSDKLoginKit/FBSDKLoginKit.h>
#import <ORKeyboardReactingApplication/ORKeyboardReactingApplication.h>
#import <AFOAuth1Client/AFOAuth1Client.h>
#import <UICKeyChainStore/UICKeyChainStore.h>
#import <SailthruMobile/SailthruMobile.h>

#import <ARAnalytics/ARAnalytics.h>
#import "ARAnalyticsConstants.h"

#import "ARAppDelegate.h"
#import "ARAppDelegate+Analytics.h"
#import "ARAppDelegate+Emission.h"
#import "ARAppDelegate+Echo.h"
#import "ARAppDelegate+TestScenarios.h"
#import "ARAppNotificationsDelegate.h"
#import "ARAppConstants.h"
#import "ARFonts.h"
#import "ARUserManager.h"
#import "AROptions.h"

#import "UIViewController+InnermostTopViewController.h"
#import "ARAdminSettingsViewController.h"
#import "ARRouter.h"
#import "ARNetworkConstants.h"
#import "ArtsyAPI+Private.h"
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

#import <react-native-config/ReactNativeConfig.h>

#import <DHCShakeNotifier/UIWindow+DHCShakeRecognizer.h>
#import <ObjectiveSugar/ObjectiveSugar.h>
#import <React/RCTDevSettings.h>
#import <Emission/AREmission.h>
#import <Emission/ARNotificationsManager.h>

#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>

static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif


@interface ARAppDelegate ()
@property (strong, nonatomic, readwrite) NSString *referralURLRepresentation;
@property (strong, nonatomic, readwrite) NSString *landingURLRepresentation;
@property (strong, nonatomic, readwrite) NSDictionary *initialLaunchOptions;
@property (strong, nonatomic, readwrite) SailthruMobile *sailThru;

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
    if ([[NSProcessInfo processInfo] environment][@"TEST_SCENARIO"]) {
        [self setupIntegrationTests];
    }

    self.echo = [[ArtsyEcho alloc] init];
    [self setupEcho];

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

    self.sailThru = [SailthruMobile new];
    [self.sailThru setAutoIntegrationEnabled:NO];
    [self.sailThru setShouldClearBadgeOnLaunch:NO];
    [self.sailThru startEngine:[ReactNativeConfig envFor:@"SAILTHRU_KEY"] withAuthorizationOption:STMPushAuthorizationOptionNoRequest];


    // Temp Fix for: https://github.com/artsy/eigen/issues/602
    [self forceCacheCustomFonts];

    // This cannot be moved after the view setup code, as it
    // relies on swizzling alloc on new objects, thus should be
    // one of the first things that happen.
    [self setupAnalytics];

    [JSDecoupledAppDelegate sharedAppDelegate].remoteNotificationsDelegate = [[ARAppNotificationsDelegate alloc] init];

    self.window = [[ARWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];

    [self setupAdminTools];

    [self countNumberOfRuns];

    _landingURLRepresentation = self.landingURLRepresentation ?: @"https://artsy.net";

    [[ARLogger sharedLogger] startLogging];

    [self setupEmission];
    self.viewController = [[ARComponentViewController alloc] initWithEmission:nil moduleName:@"Main" initialProperties:@{}];
    self.window.rootViewController = self.viewController;
    [self.window makeKeyAndVisible];

    if (@available(iOS 13.0, *)) {
      // prevent dark mode
      self.window.overrideUserInterfaceStyle = UIUserInterfaceStyleLight;
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
#ifdef FB_SONARKIT_ENABLED
    InitializeFlipper(application);
#endif

    [self setupForAppLaunch];

    FBSDKApplicationDelegate *fbAppDelegate = [FBSDKApplicationDelegate sharedInstance];
    [fbAppDelegate application:application didFinishLaunchingWithOptions:launchOptions];
    return YES;
}


- (void)registerNewSessionOpened
{
    [ARAnalytics startTimingEvent:ARAnalyticsTimePerSession];
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

- (void)killSwitch;
{
    Message *killSwitchVersion = ARAppDelegate.sharedInstance.echo.messages[@"KillSwitchBuildMinimum"];
    NSString *echoMinimumBuild = killSwitchVersion.content;
    if (echoMinimumBuild != nil && [echoMinimumBuild length] > 0) {
        NSDictionary *infoDictionary = [[[NSBundle mainBundle] infoDictionary] mutableCopy];
        NSString *buildVersion = infoDictionary[@"CFBundleShortVersionString"];

        if ([buildVersion compare:echoMinimumBuild options:NSNumericSearch] == NSOrderedAscending) {
            UIAlertController *alert = [UIAlertController
                                         alertControllerWithTitle:@"New app version required"
                                         message:@"Please update your Artsy app to continue."
                                         preferredStyle:UIAlertControllerStyleAlert];
            UIAlertAction* linkToAppButton = [UIAlertAction
                                              actionWithTitle:@"Download"
                                              style:UIAlertActionStyleDefault
                                              handler:^(UIAlertAction * action) {
                                                  NSString *iTunesLink = @"https://apps.apple.com/us/app/artsy-buy-sell-original-art/id703796080";
                                                  [[UIApplication sharedApplication] openURL:[NSURL URLWithString:iTunesLink] options:@{} completionHandler:nil];
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

    // And update emission's auth state
    [[AREmission sharedInstance] updateState:@{
        [ARStateKey userID]: [[[ARUserManager sharedManager] currentUser] userID],
        [ARStateKey authenticationToken]: [[ARUserManager sharedManager] userAuthenticationToken],
    }];

    ar_dispatch_main_queue(^{
        if ([User currentUser]) {
            [ARSpotlight indexAllUsersFavorites];
            [self setupAdminTools];
        }

        if (!([[NSUserDefaults standardUserDefaults] integerForKey:AROnboardingUserProgressionStage] == AROnboardingStageOnboarding)) {
            ARAppNotificationsDelegate *remoteNotificationsDelegate = [[JSDecoupledAppDelegate sharedAppDelegate] remoteNotificationsDelegate];
            [remoteNotificationsDelegate registerForDeviceNotificationsWithContext:ARAppNotificationsRequestContextOnboarding];
        }
    });
}

- (void)setupAdminTools
{
    if (!ARAppStatus.isBetaDevOrAdmin) {
        return;
    }

    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(rageShakeNotificationRecieved) name:DHCSHakeNotificationName object:nil];

    [ORKeyboardReactingApplication registerForCallbackOnKeyDown:ORTildeKey:^{
        [self rageShakeNotificationRecieved];
    }];
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

    [self trackDeeplinkWithTarget:url referrer:_referralURLRepresentation];

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
            [[AREmission sharedInstance] navigate:urlString];
            return YES;

        } else {
            return NO;
        }
    }

    [[AREmission sharedInstance] navigate:[url absoluteString]];

    return YES;
}

- (void)rageShakeNotificationRecieved
{
    if (![UIDevice isPad]) {
        // For some reason the supported orientation isn’t respected when this is pushed on top
        // of a landscape VIR view.
        //
        // Since this is a debug/admin only issue, it’s safe to use private API here.
        [[UIDevice currentDevice] setValue:@(UIInterfaceOrientationPortrait) forKey:@"orientation"];
    }
    ARAdminSettingsViewController *adminSettings = [[ARAdminSettingsViewController alloc] initWithStyle:UITableViewStyleGrouped];

    SerifModalWebNavigationController *navController = [[SerifModalWebNavigationController alloc] initWithRootViewController:adminSettings];

    [self.window.rootViewController presentViewController:navController animated:YES completion:nil];
}

- (void)countNumberOfRuns
{
    NSInteger numberOfRuns = [[NSUserDefaults standardUserDefaults] integerForKey:ARAnalyticsAppUsageCountProperty] + 1;
    if (numberOfRuns == 1) {
        [ARAnalytics event:ARAnalyticsFreshInstall];
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
