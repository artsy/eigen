#import "AROptions.h"

NSString *const AROptionsLoadingScreenAlpha = @"Loading screens are transparent";
NSString *const AROptionsUseVCR = @"Use offline recording";
NSString *const AROptionsSettingsMenu = @"Enable user settings";
NSString *const AROptionsTappingPartnerSendsToPartner = @"Partner name in feed goes to partner";
NSString *const AROptionsUseNativeAuctions = @"Use Native Auction View";
NSString *const AROptionsUseNativeWorksForYou = @"Use Native Works For You View";


@implementation AROptions

+ (NSArray *)labsOptions
{
    return @[
        AROptionsUseVCR,
        AROptionsSettingsMenu,
        AROptionsTappingPartnerSendsToPartner,
        AROptionsUseNativeAuctions,
        AROptionsUseNativeWorksForYou
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
