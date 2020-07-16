#import "AROptions.h"

static NSDictionary *options = nil;

// Up here is the NSUserDefault set, and sent into Emission

// UI Tweaks
NSString *const AROptionsEnableMyCollection = @"AROptionsEnableMyCollection";
NSString *const AROptionsFilterCollectionsArtworks = @"AROptionsFilterCollectionsArtworks";
NSString *const AROptionsHomeHero = @"AROptionsHomeHero";
NSString *const AROptionsLoadingScreenAlpha = @"Loading screens are transparent";
NSString *const AROptionsLotConditionReport = @"AROptionsLotConditionReport";
NSString *const AROptionsShowAnalyticsOnScreen = @"AROptionsShowAnalyticsOnScreen";
NSString *const AROptionsShowMartsyOnScreen = @"AROptionsShowMartsyOnScreen";
NSString *const AROptionsViewingRooms = @"AROptionsViewingRooms";

// UX changes
NSString *const AROptionsDisableNativeLiveAuctions = @"Disable Native Live Auctions";
NSString *const AROptionsDebugARVIR = @"Debug AR View in Room";

// RN
NSString *const AROptionsStagingReactEnv = @"Use Staging React ENV";
NSString *const AROptionsDevReactEnv = @"Use Dev React ENV";

// Dev
NSString *const AROptionsUseVCR = @"Use offline recording";

NSString *const AROptionsPriceTransparency = @"Price Transparency";

@implementation AROptions

// Down here is the user-facing description

+ (void)initialize
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        options = @{
         AROptionsDebugARVIR: @"Debug AR View in Room",
         AROptionsDisableNativeLiveAuctions: @"Disable Native Live Auctions",
         AROptionsEnableMyCollection: @"Enable new MyCollection view",
         AROptionsFilterCollectionsArtworks: @"Filter Collections Artworks",
         AROptionsHomeHero: @"Show Home Hero Unit",
         AROptionsLotConditionReport : @"Lot Condition Report",
         AROptionsViewingRooms: @"Show Viewing Rooms",

         AROptionsPriceTransparency: AROptionsPriceTransparency,
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
        [mutableOptions setObject:@([self boolForOption:option]) forKey:option];
    }
    return [mutableOptions copy];
}

+ (NSArray *)labsOptionsThatRequireRestart
{
    return @[
        AROptionsDisableNativeLiveAuctions,
        AROptionsViewingRooms,
        AROptionsHomeHero
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
