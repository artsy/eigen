#import <AuthenticationServices/AuthenticationServices.h>
#import <SafariServices/SafariServices.h>
#import <FBSDKCoreKit/FBSDKCoreKit-Swift.h>
#import <Firebase.h>
#import <BrazeKit/BrazeKit-Swift.h>
#import "BrazeReactBridge.h"
#import "BrazeReactUtils.h"

#import <CodePush/CodePush.h>
#import <AppCenterReactNative.h>

#import "ARAppDelegate.h"
#import "ARAppDelegate+Emission.h"
#import "ARAppDelegate+Echo.h"
#import "ARAppNotificationsDelegate.h"
#import "ARUserManager.h"
#import "ARFonts.h"
#import <Analytics/SEGAnalytics.h>
#import "ARAnalyticsConstants.h"
#import "User.h"

#import "ARWebViewCacheHost.h"
#import "ARAppStatus.h"
#import "ARLogger.h"

#import "AREmission.h"
#import "ARPHPhotoPickerModule.h"
#import "ARCocoaConstantsModule.h"

#import <react-native-config/ReactNativeConfig.h>
#import <ObjectiveSugar/ObjectiveSugar.h>
#import <React/RCTBundleURLProvider.h>
#import "AREmission.h"
#import "ARNotificationsManager.h"
#import <React/RCTLinkingManager.h>

@interface ARAppDelegate ()
@property (strong, nonatomic, readwrite) NSString *referralURLRepresentation;
@property (strong, nonatomic, readwrite) NSString *landingURLRepresentation;
@property (strong, nonatomic, readwrite) NSDictionary *initialLaunchOptions;

@end

#if defined(FB_SONARKIT_ENABLED) && (!defined(CI_DISABLE_FLIPPER) || (CI_DISABLE_FLIPPER != 1))
#import <FlipperKit/FlipperClient.h>
#import <FlipperPerformancePlugin.h>
#endif

@implementation ARAppDelegate

static ARAppDelegate *_sharedInstance = nil;

+ (void)load
{
    _sharedInstance = [[self alloc] init];
    [JSDecoupledAppDelegate sharedAppDelegate].appStateDelegate = _sharedInstance;
    [JSDecoupledAppDelegate sharedAppDelegate].appDefaultOrientationDelegate = (id)_sharedInstance;
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
    self.echo = [[ArtsyEcho alloc] init];
    [self setupEcho];

    self.initialLaunchOptions = launchOptions;
    return YES;
}

/// This is called when we are going to present a user interface, which
/// is both on traditional app launch, and every time we are backgrounded and back.

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    [self setupForAppLaunch:nil];
}

- (void)setupForAppLaunch:(NSDictionary *)launchOptions
{
    // In case everything's already set up
    if (self.window) {
        return;
    }

    // Temp Fix for: https://github.com/artsy/eigen/issues/602
    [self forceCacheCustomFonts];

    [JSDecoupledAppDelegate sharedAppDelegate].remoteNotificationsDelegate = [[ARAppNotificationsDelegate alloc] init];

    [self countNumberOfRuns];

    _landingURLRepresentation = self.landingURLRepresentation ?: @"https://artsy.net";

    [[ARLogger sharedLogger] startLogging];

    AREmission *emission = [self setupSharedEmission];

    [AppCenterReactNative register];

    RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
    self.bridge = bridge;
    [emission setBridge:bridge];

    self.moduleName = @"eigen";

    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    NSDictionary *initProps = @{};
    self.initialProps = initProps;

    // prevent dark mode
    self.window.overrideUserInterfaceStyle = UIUserInterfaceStyleLight;

    [ARWebViewCacheHost startup];
    [self registerNewSessionOpened];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  #if defined(FB_SONARKIT_ENABLED) && (!defined(CI_DISABLE_FLIPPER) || (CI_DISABLE_FLIPPER != 1))
    FlipperClient *client = [FlipperClient sharedClient];
    [client addPlugin:[FlipperPerformancePlugin new]];
  #endif

    [self setupForAppLaunch:launchOptions];

    [self setupAnalytics:application withLaunchOptions:launchOptions];

    [[FBSDKApplicationDelegate sharedInstance] application:application
        didFinishLaunchingWithOptions:launchOptions];


    BOOL ossUser = [[ReactNativeConfig envFor:@"OSS"] isEqualToString:@"true"];
    if ([FIRApp defaultApp] == nil && !ossUser) {
        [FIRApp configure];
    }

    return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (void)setupAnalytics:(UIApplication *)application withLaunchOptions:(NSDictionary *)launchOptions
{
    NSString *brazeAppKey = [ReactNativeConfig envFor:@"BRAZE_STAGING_APP_KEY_IOS"];
    if (![ARAppStatus isDev]) {
        brazeAppKey = [ReactNativeConfig envFor:@"BRAZE_PRODUCTION_APP_KEY_IOS"];
    }

    NSString *brazeSDKEndPoint = @"sdk.iad-06.braze.com";
    BRZConfiguration *brazeConfiguration = [[BRZConfiguration alloc] initWithApiKey:brazeAppKey endpoint:brazeSDKEndPoint];
    brazeConfiguration.logger.level = BRZLoggerLevelInfo;
    Braze *braze = [BrazeReactBridge initBraze:brazeConfiguration];
    [ARAppDelegate setBraze:braze];

    NSString *segmentWriteKey = [ReactNativeConfig envFor:@"SEGMENT_STAGING_WRITE_KEY_IOS"];
    if (![ARAppStatus isDev]) {
        segmentWriteKey = [ReactNativeConfig envFor:@"SEGMENT_PRODUCTION_WRITE_KEY_IOS"];
    }

    SEGAnalyticsConfiguration *configuration = [SEGAnalyticsConfiguration configurationWithWriteKey:segmentWriteKey];
    configuration.trackApplicationLifecycleEvents = YES;
    configuration.trackPushNotifications = YES;
    configuration.trackDeepLinks = YES;
    [SEGAnalytics setupWithConfiguration:configuration];
    [[BrazeReactUtils sharedInstance] populateInitialUrlFromLaunchOptions:launchOptions];
}

- (void)registerNewSessionOpened {}

// This happens every time we come _back_ to the app from the background
- (void)applicationWillEnterForeground:(UIApplication *)application
{
    [self registerNewSessionOpened];

    NSString *currentUserId = [[[ARUserManager sharedManager] currentUser] userID];
    if (currentUserId) {
        [[ARAppDelegate braze] changeUser: currentUserId];
    }
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
    // MANUALLY track lifecycle event. Segment already does this if
    // trackLifecycleSessions: true
}

- (ARAppNotificationsDelegate *)remoteNotificationsDelegate;
{
    return (ARAppNotificationsDelegate *)[[JSDecoupledAppDelegate sharedAppDelegate] remoteNotificationsDelegate];
}

- (void)forceCacheCustomFonts
{
    __unused UIFont *font = [UIFont serifSemiBoldFontWithSize:12];
    font = [UIFont serifFontWithSize:12];
    font = [UIFont serifItalicFontWithSize:12];
    font = [UIFont sansSerifFontWithSize:12];
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options
{
    NSString *sourceApplication = options[UIApplicationOpenURLOptionsSourceApplicationKey];
    id annotation = options[UIApplicationOpenURLOptionsAnnotationKey];

    _landingURLRepresentation = [url absoluteString];

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
    return [RCTLinkingManager application:app openURL:url options:options];
}

- (void)countNumberOfRuns
{
    NSInteger numberOfRuns = [[NSUserDefaults standardUserDefaults] integerForKey:ARAnalyticsAppUsageCountProperty] + 1;

    [[NSUserDefaults standardUserDefaults] setInteger:numberOfRuns forKey:ARAnalyticsAppUsageCountProperty];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
    return [CodePush bundleURL];
#endif
}

- (NSArray<id<RCTBridgeModule>> *)extraModulesForBridge:(RCTBridge *)bridge
{
    return @[
        [[AREmission sharedInstance] eventsModule],
        [[AREmission sharedInstance] APIModule],
        [ARPHPhotoPickerModule new],
        [[AREmission sharedInstance] notificationsManagerModule],
        [ARCocoaConstantsModule new],
    ];
}

#pragma mark - AppDelegate.braze

static Braze *_braze = nil;

+ (Braze *)braze {
  return _braze;
}

+ (void)setBraze:(Braze *)braze {
  _braze = braze;
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
