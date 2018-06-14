#import "AROptions.h"

NSString *const AROptionsLoadingScreenAlpha = @"Loading screens are transparent";
NSString *const AROptionsUseVCR = @"Use offline recording";
NSString *const AROptionsSettingsMenu = @"Enable user settings";
NSString *const AROptionsTappingPartnerSendsToPartner = @"Partner name in feed goes to partner";
NSString *const AROptionsShowAnalyticsOnScreen = @"AROptionsShowAnalyticsOnScreen";
NSString *const AROptionsShowMartsyOnScreen = @"AROptionsShowMartsyOnScreen";
NSString *const AROptionsDisableNativeLiveAuctions = @"Disable Native Live Auctions";
NSString *const AROptionsStagingReactEnv = @"Use Staging React ENV";
NSString *const AROptionsDevReactEnv = @"Use Dev React ENV";
NSString *const AROptionsDebugARVIR = @"Debug AR View in Room";
NSString *const AROptionsUseNewBidFlow = @"Use new Bid Flow";

@implementation AROptions

+ (NSArray *)labsOptions
{
    return @[
        AROptionsUseVCR,
        AROptionsSettingsMenu,
        AROptionsTappingPartnerSendsToPartner,
        AROptionsDisableNativeLiveAuctions,
        
        AROptionsDebugARVIR,
        AROptionsUseNewBidFlow
    ];
}

+ (NSArray *)labsOptionsThatRequireRestart
{
    return @[
        AROptionsDisableNativeLiveAuctions,
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
