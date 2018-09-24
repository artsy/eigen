#import "AROptions.h"

static NSDictionary *options = nil;


// UI Tweaks
NSString *const AROptionsLoadingScreenAlpha = @"Loading screens are transparent";
NSString *const AROptionsShowAnalyticsOnScreen = @"AROptionsShowAnalyticsOnScreen";
NSString *const AROptionsShowMartsyOnScreen = @"AROptionsShowMartsyOnScreen";

// UX changes
NSString *const AROptionsDisableNativeLiveAuctions = @"Disable Native Live Auctions";
NSString *const AROptionsDebugARVIR = @"Debug AR View in Room";
NSString *const AROptionsHideBackButtonOnScroll = @"Hide the Back Button in Zoom image";

// RN
NSString *const AROptionsStagingReactEnv = @"Use Staging React ENV";
NSString *const AROptionsDevReactEnv = @"Use Dev React ENV";

// Dev
NSString *const AROptionsUseVCR = @"Use offline recording";
NSString *const AROptionsSettingsMenu = @"Enable user settings";

// Replicating the options in Emission
// See: https://github.com/artsy/emission/blob/master/Example/Emission/ARLabOptions.m
NSString *const AROptionsForceBuyNow = @"enableBuyNowMakeOffer";

// The case change

@implementation AROptions

+ (void)initialize
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        options = @{
         AROptionsSettingsMenu: @"Enable user settings",
         AROptionsShowAnalyticsOnScreen: @"Show on-screen analytics",
         AROptionsShowMartsyOnScreen: @"Show when on a Martsy page",
         AROptionsDisableNativeLiveAuctions: @"Disable Native Live Auctions",
         AROptionsDebugARVIR: @"Debug AR View in Room",
         AROptionsForceBuyNow: @"Enable Buy Now Flow",
         AROptionsHideBackButtonOnScroll: @"Hide the Back Button in Zoom image",
         AROptionsStagingReactEnv: @"Use Staging React ENV",
         AROptionsDevReactEnv: @"Use Dev React ENV",
         AROptionsLoadingScreenAlpha: @"Loading screens are transparent",
         AROptionsUseVCR: @"Use offline recording",
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
        AROptionsForceBuyNow
    ];
}

+ (BOOL)boolForOption:(NSString *)option
{
    return [[NSUserDefaults standardUserDefaults] boolForKey:option];
}

+ (void)setBool:(BOOL)value forOption:(NSString *)option
{
    [[NSUserDefaults standardUserDefaults] setBool:value forKey:option];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

@end
