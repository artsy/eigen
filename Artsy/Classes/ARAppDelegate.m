#ifdef STORE
#define ADMIN_MENU_ENABLED 0
#else
#define ADMIN_MENU_ENABLED 1
#endif

#import <ORKeyboardReactingApplication/ORKeyboardReactingApplication.h>
#import "ARAppWatchCommunicator.h"
#import <iRate/iRate.h>
#import <AFOAuth1Client/AFOAuth1Client.h>
#import <ARAnalytics/ARAnalytics.h>
#import "ARAnalyticsConstants.h"

#import "ARAppDelegate.h"
#import "ARAppDelegate+Analytics.h"
#import "ARUserManager.h"

#import "UIViewController+InnermostTopViewController.h"
#import "ARAdminSettingsViewController.h"
#import "ARQuicksilverViewController.h"
#import "ARRouter.h"
#import "UIViewController+ARStateRestoration.h"
#import "ARNetworkConstants.h"
#import "ArtsyAPI+Private.h"
#import "ARFileUtils.h"

@import FBSDKCoreKit;
@import FBSDKLoginKit;

#import <Keys/ArtsyKeys.h>
#import "AREndOfLineInternalMobileWebViewController.h"
#import "ARDefaults+SiteFeatures.h"

#import <InterAppCommunication/IACManager.h>
#import "ARBackButtonCallbackManager.h"

#if ADMIN_MENU_ENABLED
#import <DHCShakeNotifier/UIWindow+DHCShakeRecognizer.h>
#import <VCRURLConnection/VCR.h>
#endif

// demo
#import "ARDemoSplashViewController.h"
#import "ARShowFeedViewController.h"

@interface ARAppDelegate()
@property (strong, nonatomic, readwrite) NSString *referralURLRepresentation;
@property (strong, nonatomic, readwrite) NSString *landingURLRepresentation;
@end

@implementation ARAppDelegate

static ARAppDelegate *_sharedInstance = nil;

+ (void)load
{
    id delegate = [[self alloc] init];
    [JSDecoupledAppDelegate sharedAppDelegate].appStateDelegate = delegate;
    [JSDecoupledAppDelegate sharedAppDelegate].URLResourceOpeningDelegate = delegate;
}

+ (ARAppDelegate *)sharedInstance
{
    return _sharedInstance;
}

// These methods are swizzled during unit tests. See ARAppDelegate(Testing).

- (BOOL)application:(UIApplication *)application willFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    _sharedInstance = self;

    if (ARIsRunningInDemoMode) {
        [ARUserManager clearUserData];
    }

    [ARDefaults setup];
    [ARRouter setup];

    self.window = [[ARWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    self.viewController = [ARTopMenuViewController sharedController];

    [self.viewController setupRestorationIdentifierAndClass];

    [self setupAdminTools];

    [self setupAnalytics];
    [self setupRatingTool];
    [self countNumberOfRuns];

    self.window.rootViewController = self.viewController;

    [self.window makeKeyAndVisible];

    return YES;
}


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    _landingURLRepresentation = self.landingURLRepresentation ?: @"http://artsy.net";

    [[ARLogger sharedLogger] startLogging];
    [FBSDKSettings setAppID:[ArtsyKeys new].artsyFacebookAppID];
    [self setupXCallbackUrlManager];

    if (ARIsRunningInDemoMode) {

        [self.viewController presentViewController:[[ARDemoSplashViewController alloc] init] animated:NO completion:nil];
        [self performSelector:@selector(finishDemoSplash) withObject:nil afterDelay:1];

    } else if(![[ARUserManager sharedManager] hasExistingAccount]) {

        [self fetchSiteFeatures];
        [self showTrialOnboardingWithState:ARInitialOnboardingStateSlideShow andContext:ARTrialContextNotTrial];
    }

    ARShowFeedViewController *topVC = (id)ARTopMenuViewController.sharedController.rootNavigationController.topViewController;
    [ArtsyAPI getXappTokenWithCompletion:^(NSString *xappToken, NSDate *expirationDate) {

        // Sync clock with server
        [ARSystemTime sync];

        // Start doing the network calls to grab the feed
        [topVC refreshFeedItems];
        [self checkForiOS7Deprecation];
    }];

    return YES;
}

- (void)finishDemoSplash
{
    [self.viewController dismissViewControllerAnimated:YES completion:nil];
}

- (void)finishOnboardingAnimated:(BOOL)animated
{
    [[UIApplication sharedApplication] setStatusBarHidden:NO withAnimation:UIStatusBarAnimationFade];
    [[ARTopMenuViewController sharedController] moveToInAppAnimated:animated];
}

- (void)showTrialOnboardingWithState:(enum ARInitialOnboardingState)state andContext:(enum ARTrialContext)context
{
    AROnboardingViewController *onboardVC = [[AROnboardingViewController alloc] initWithState:state];
    onboardVC.trialContext = context;
    onboardVC.modalPresentationStyle = UIModalPresentationOverFullScreen;
    [self.viewController presentViewController:onboardVC animated:NO completion:nil];
}

- (void)setupXCallbackUrlManager
{

    IACManager *sharedManager = [IACManager sharedManager];
    sharedManager.callbackURLScheme = ARArtsyXCallbackUrlScheme;

    [sharedManager handleAction:@"open" withBlock:^(NSDictionary *inputParameters, IACSuccessBlock success, IACFailureBlock failure) {
        NSString *urlString = inputParameters[@"url"];
        NSURL *url = [NSURL URLWithString:urlString];

        NSDictionary *errorDict;

        if (!urlString.length > 0) {
            errorDict = @{NSLocalizedDescriptionKey: @"No URL was provided. Provide an Artsy URL in the `url` parameter."};
        } else if (!url) {
            errorDict = @{NSLocalizedDescriptionKey: @"The URL provided was malformed. Provide an Artsy URL in the `url` parameter."};
        } else if (![ARRouter isInternalURL:url]) {
            errorDict = @{NSLocalizedDescriptionKey: @"The URL provided was not an Artsy URL. Provide an Artsy URL in the `url` parameter."};
        }

        if (errorDict) {
            failure([NSError errorWithDomain:@"net.artsy.artsy.x-callback-url" code:400 userInfo:errorDict]);
            return;
        }

        UIViewController *viewController = [ARSwitchBoard.sharedInstance loadURL:url];
        if (viewController) {
            // This happens when the URL is routed to a web view.

            [[ARTopMenuViewController sharedController] pushViewController:viewController animated:YES];
        } else {
            // This happens if JLRoutes found a route for the URL.

            viewController = [ARTopMenuViewController sharedController].rootNavigationController.ar_innermostTopViewController;
        }

        ARBackButtonCallbackManager *manager = [[ARBackButtonCallbackManager alloc] initWithViewController:viewController andBackBlock:^{
            success(nil, NO);
            [ARTopMenuViewController sharedController].backButtonCallbackManager = nil;
        }];

        [ARTopMenuViewController sharedController].backButtonCallbackManager = manager;
    }];
}

- (void)setupAdminTools
{
#if ADMIN_MENU_ENABLED

    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(rageShakeNotificationRecieved) name:DHCSHakeNotificationName object:nil];

    if ([AROptions boolForOption:AROptionsUseVCR]) {
        NSURL *url = [NSURL fileURLWithPath:[ARFileUtils cachesPathWithFolder:@"vcr" filename:@"eigen.json"]];
        [VCR loadCassetteWithContentsOfURL:url];
        [VCR start];
    }

    [ORKeyboardReactingApplication registerForCallbackOnKeyDown:ORTildeKey :^{
        [self rageShakeNotificationRecieved];
    }];

    [ORKeyboardReactingApplication registerForCallbackOnKeyDown:ORSpaceKey :^{
        [self showQuicksilver];
    }];

    [ORKeyboardReactingApplication registerForCallbackOnKeyDown:ORDeleteKey :^{
        [ARTopMenuViewController.sharedController.rootNavigationController popViewControllerAnimated:YES];
    }];

#endif
}

- (void)setupRatingTool
{
    [iRate sharedInstance].promptForNewVersionIfUserRated = NO;
    [iRate sharedInstance].verboseLogging = NO;
}

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication
         annotation:(id)annotation
{
    _referralURLRepresentation = sourceApplication;
    _landingURLRepresentation = [url absoluteString];


    // X-Callback-Url
    if ([[IACManager sharedManager] handleOpenURL:url]) {
        return YES;
    }

    // Twitter SSO
    if ([[url absoluteString] hasPrefix:ARTwitterCallbackPath]) {
        NSNotification *notification = nil;
        notification = [NSNotification notificationWithName:kAFApplicationLaunchedWithURLNotification
                                                     object:nil
                                                   userInfo:@{ kAFApplicationLaunchOptionsURLKey:url }];

        [[NSNotificationCenter defaultCenter] postNotification:notification];
        return YES;
    }

    // Facebook
    NSString *fbScheme = [@"fb" stringByAppendingString:[[NSBundle mainBundle] objectForInfoDictionaryKey:@"FacebookAppID"]];

    if ([[url scheme] isEqualToString:fbScheme]) {


        NSAssert(TRUE, @"SHOULD NOT BE CALLED");
        // Call FBAppCall's handleOpenURL:sourceApplication to handle Facebook app responses
//        return [FBAppCall handleOpenURL:url sourceApplication:sourceApplication];
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
        id oldVC = navigationController.viewControllers[count -2];
        if ([oldVC isKindOfClass:[ARQuicksilverViewController class]]) {
            return;
        }
    }

    ARQuicksilverViewController *adminSettings = [[ARQuicksilverViewController alloc] init];
    [navigationController pushViewController:adminSettings animated:YES];
}

- (void)checkForiOS7Deprecation
{
    // To totally deprecate all iOS7 devices
    // set the "iOS7 Redirection URL" featured link's HREF to something like /404/ios7
    // https://admin.artsy.net/set/54e4aab97261692d085a1c00

    // This was added in iOS8
    if (&UIApplicationOpenSettingsURLString != NULL) { return; }

    [ArtsyAPI getOrderedSetWithKey:@"eigen-ios-deprecation-featured-links" success:^(OrderedSet *set) {
        [set getItems:^(NSArray *items) {
            FeaturedLink *link = [items detect:^BOOL(FeaturedLink *link) {
                return [link.title isEqualToString:@"iOS7 Redirection URL"];
            }];

            // By default it be 0 length
            if (link.href.length) {
                UINavigationController *navigationController = ARTopMenuViewController.sharedController.rootNavigationController;
                NSURL *url = [NSURL URLWithString:link.href relativeToURL:[ARRouter baseWebURL]];
                UIViewController *martsyWarning = [[AREndOfLineInternalMobileWebViewController alloc] initWithURL:url];
                [navigationController setViewControllers:@[martsyWarning] animated:NO];
            }

        }];
    } failure:nil];
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    [ARTrialController extendTrial];
    [ARAnalytics startTimingEvent:ARAnalyticsTimePerSession];
}

- (void)applicationWillResignActive:(UIApplication *)application
{
    [ARAnalytics finishTimingEvent:ARAnalyticsTimePerSession];
}

- (void)fetchSiteFeatures
{
    [ArtsyAPI getXappTokenWithCompletion:^(NSString *xappToken, NSDate *expirationDate) {
       [ArtsyAPI getSiteFeatures:^(NSArray *features) {
           [ARDefaults setOnboardingDefaults:features];

       } failure:^(NSError *error) {
           NSLog(@"Couldn't get site features. Error %@", error.localizedDescription);
       }];
    }];
}

-(void)countNumberOfRuns
{
    NSInteger numberOfRuns = [[NSUserDefaults standardUserDefaults] integerForKey:ARAnalyticsAppUsageCountProperty] + 1;
    if (numberOfRuns == 1) {
        [ARAnalytics event:ARAnalyticsFreshInstall];
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
