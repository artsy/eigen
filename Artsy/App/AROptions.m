#import "AROptions.h"

static NSDictionary *options = nil;

// Up here is the NSUserDefault set, and sent into Emission

// UI Tweaks
NSString *const AROptionsLoadingScreenAlpha = @"Loading screens are transparent";
NSString *const AROptionsShowAnalyticsOnScreen = @"AROptionsShowAnalyticsOnScreen";
NSString *const AROptionsShowMartsyOnScreen = @"AROptionsShowMartsyOnScreen";

// UX changes
NSString *const AROptionsDisableNativeLiveAuctions = @"Disable Native Live Auctions";
NSString *const AROptionsDebugARVIR = @"Debug AR View in Room";

// RN
NSString *const AROptionsStagingReactEnv = @"Use Staging React ENV";
NSString *const AROptionsDevReactEnv = @"Use Dev React ENV";

// Dev
NSString *const AROptionsUseVCR = @"Use offline recording";

// These variables may need to replicate the options in Emission
// See: https://github.com/artsy/emission/blob/master/Example/Emission/ARLabOptions.m
NSString *const AROptionsForceBuyNow = @"Enable Buy Now Flow via Force";
NSString *const AROptionsBuyNow = @"enableBuyNowMakeOffer";

NSString *const AROptionsMakeOffer = @"Enable Make Offer";

NSString *const AROptionsRNArtwork = @"Enable React Native Artwork view";

@implementation AROptions

// Down here is the user-facing description

+ (void)initialize
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        options = @{
         AROptionsDisableNativeLiveAuctions: @"Disable Native Live Auctions",
         AROptionsDebugARVIR: @"Debug AR View in Room",
         
         AROptionsBuyNow: @"Enable Eigen/Emission Buy Now integration",
         AROptionsForceBuyNow: @"Enable Buy Now purchase flow via Force",
         AROptionsMakeOffer: @"Enable Make Offer via Force",
         AROptionsRNArtwork: AROptionsRNArtwork,
         
         AROptionsLoadingScreenAlpha: @"Loading screens are transparent",
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
        if ([self optionExists:option]) {
            [mutableOptions setObject:@([self boolForOption:option]) forKey:option];
        }
    }
    return [mutableOptions copy];
}

+ (NSArray *)labsOptionsThatRequireRestart
{
    return @[
        AROptionsDisableNativeLiveAuctions,
        AROptionsForceBuyNow,   
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
}

@end
