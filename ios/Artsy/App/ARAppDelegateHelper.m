#import "ARAppDelegateHelper.h"
#import "AppDelegate+Echo.h"
#import "AppDelegate+Emission.h"
#import "ARFonts.h"
#import "ARLogger.h"
#import "ARWebViewCacheHost.h"
#import "ARAnalyticsConstants.h"
#import "User.h"
#import "ARUserManager.h"
#import "Keys.h"
#import "ARAppStatus.h"
#import <FBSDKCoreKit/FBSDKCoreKit-Swift.h>
#import <Firebase.h>
#import "BrazeReactBridge.h"
#import "BrazeReactUtils.h"
#import <BrazeUI/BrazeUI-Swift.h>

@interface ARAppDelegateHelper ()
@property (strong, nonatomic, readwrite) NSString *referralURLRepresentation;
@property (strong, nonatomic, readwrite) NSString *landingURLRepresentation;
@property (strong, nonatomic) NSDictionary *initialLaunchOptions;
@end

@implementation ARAppDelegateHelper

static ARAppDelegateHelper *_sharedInstance = nil;
static Braze *_braze = nil;

+ (instancetype)sharedInstance {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _sharedInstance = [[ARAppDelegateHelper alloc] init];
    });
    return _sharedInstance;
}

+ (Braze *)braze {
    return _braze;
}

+ (void)setBraze:(Braze *)braze {
    _braze = braze;
}

- (void)setupWithLaunchOptions:(NSDictionary *)launchOptions {
    self.initialLaunchOptions = launchOptions;
    _landingURLRepresentation = _landingURLRepresentation ?: @"https://artsy.net";
    
    // Setup Echo - will be initialized via categories later
    self.echo = [[ArtsyEcho alloc] init];

    [self forceCacheCustomFonts];

    [self countNumberOfRuns];

    [[ARLogger sharedLogger] startLogging];

    [self setupAnalytics:launchOptions];

    [self setupSharedEmission];

    // Configure Firebase
    BOOL ossUser = [[Keys publicFor:@"OSS"] isEqualToString:@"true"];
    if ([FIRApp defaultApp] == nil && !ossUser) {
        [FIRApp configure];
    }
    
    // Setup Facebook
    [[FBSDKApplicationDelegate sharedInstance] application:[UIApplication sharedApplication]
        didFinishLaunchingWithOptions:launchOptions];

    [ARWebViewCacheHost startup];

    [self registerNewSessionOpened];
}

- (void)applicationDidBecomeActive {
    // Register new session opened
    [self registerNewSessionOpened];
    
    // Update Braze user if logged in
    NSString *currentUserId = [[[ARUserManager sharedManager] currentUser] userID];
    if (currentUserId) {
        [[ARAppDelegateHelper braze] changeUser:currentUserId];
    }
}

- (void)setupAnalytics:(NSDictionary *)launchOptions {
    NSString *brazeAppKey = [Keys secureFor:@"BRAZE_STAGING_APP_KEY_IOS"];
    if (![ARAppStatus isDev]) {
        brazeAppKey = [Keys secureFor:@"BRAZE_PRODUCTION_APP_KEY_IOS"];
    }
    
    NSString *brazeSDKEndPoint = @"sdk.iad-06.braze.com";
    BRZConfiguration *brazeConfiguration = [[BRZConfiguration alloc] initWithApiKey:brazeAppKey endpoint:brazeSDKEndPoint];
    brazeConfiguration.logger.level = BRZLoggerLevelInfo;
    Braze *braze = [BrazeReactBridge initBraze:brazeConfiguration];
    [ARAppDelegateHelper setBraze:braze];
    
    BrazeInAppMessageUI *inAppMessageUI = [[BrazeInAppMessageUI alloc] init];
    braze.inAppMessagePresenter = inAppMessageUI;
    
    [[BrazeReactUtils sharedInstance] populateInitialUrlFromLaunchOptions:launchOptions];
}

- (void)forceCacheCustomFonts {
    __unused UIFont *font = [UIFont serifSemiBoldFontWithSize:12];
    font = [UIFont serifFontWithSize:12];
    font = [UIFont serifItalicFontWithSize:12];
    font = [UIFont sansSerifFontWithSize:12];
}

- (void)countNumberOfRuns {
    NSInteger numberOfRuns = [[NSUserDefaults standardUserDefaults] integerForKey:ARAnalyticsAppUsageCountProperty] + 1;
    [[NSUserDefaults standardUserDefaults] setInteger:numberOfRuns forKey:ARAnalyticsAppUsageCountProperty];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

- (void)registerNewSessionOpened {
    // This will be implemented by the existing categories
}

@end
