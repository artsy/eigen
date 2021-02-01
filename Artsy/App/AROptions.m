#import "AROptions.h"
#import "ARAppDelegate.h"
#import "ARAppDelegate+Emission.h"

static NSDictionary *options = nil;

// Up here is the NSUserDefault set, and sent into Emission

// UI Tweaks
NSString *const AROptionsBidManagement = @"AROptionsBidManagement";
NSString *const AROptionsEnableMyCollection = @"AROptionsEnableMyCollection";
NSString *const AROptionsLoadingScreenAlpha = @"AROptionsLoadingScreenAlpha";
NSString *const AROptionsShowAnalyticsOnScreen = @"AROptionsShowAnalyticsOnScreen";
NSString *const AROptionsShowMartsyOnScreen = @"AROptionsShowMartsyOnScreen";
NSString *const AROptionsArtistSeries = @"AROptionsArtistSeries";
NSString *const AROptionsNewFirstInquiry = @"AROptionsNewFirstInquiry";
NSString *const AROptionsNewFairPage = @"AROptionsNewFairPage";
NSString *const AROptionsNewInsightsPage = @"AROptionsNewInsightsPage";
NSString *const AROptionsInquiryCheckout = @"AROptionsInquiryCheckout";
NSString *const AROptionsSentryErrorDebug = @"AROptionsSentryErrorDebug";

// UX changes
NSString *const AROptionsDisableNativeLiveAuctions = @"AROptionsDisableNativeLiveAuctions";
NSString *const AROptionsDebugARVIR = @"AROptionsDebugARVIR";

// RN
NSString *const AROptionsStagingReactEnv = @"AROptionsStagingReactEnv";
NSString *const AROptionsDevReactEnv = @"AROptionsDevReactEnv";

// Dev
NSString *const AROptionsPriceTransparency = @"AROptionsPriceTransparency";
NSString *const AROptionsUseReactNativeWebView = @"AROptionsUseReactNativeWebView";


@implementation AROptions

// Down here is the user-facing description

+ (void)initialize
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        options = @{
         AROptionsSentryErrorDebug: @"Enable sentry error button in profile",
         AROptionsDebugARVIR: @"Debug AR View in Room",
         AROptionsDisableNativeLiveAuctions: @"Disable Native Live Auctions",
         AROptionsEnableMyCollection: @"Enable new MyCollection view",
         AROptionsPriceTransparency: @"Price Transparency",
         AROptionsLoadingScreenAlpha: @"Loading screens are transparent",
         AROptionsUseReactNativeWebView: @"Use react native webviews",
         AROptionsInquiryCheckout: @"Enable inquiry checkout",
        };
    });
}

+ (NSArray *)labsOptions
{
    return options.allKeys;
}

+ (NSString *)descriptionForOption:(NSString *)option
{
    return options[option];
}

+ (NSDictionary *)labOptionsMap
{
    NSArray *options = [self labsOptions];
    NSMutableDictionary *mutableOptions = [NSMutableDictionary dictionary];

    for (NSString *option in options) {
        [mutableOptions setObject:@([self boolForOption:option]) forKey:option];
    }
    return [mutableOptions copy];
}

+ (NSArray *)labsOptionsThatRequireRestart
{
    return @[
        AROptionsDisableNativeLiveAuctions,
    ];
}

+ (BOOL)optionExists:(NSString *)option
{
    return [[NSUserDefaults standardUserDefaults] objectForKey:option];
}

+ (BOOL)boolForOption:(NSString *)option
{
    return [[NSUserDefaults standardUserDefaults] boolForKey:option];
}

+ (void)setBool:(BOOL)value forOption:(NSString *)option
{
    [[NSUserDefaults standardUserDefaults] setBool:value forKey:option];
    [[NSUserDefaults standardUserDefaults] synchronize];
    [[ARAppDelegate sharedInstance] updateEmissionOptions];
}

@end
