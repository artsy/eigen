#import "AROptions.h"
#import "ARAppDelegateHelper.h"
#import "AppDelegate+Emission.h"

static NSDictionary *options = nil;

// Up here is the NSUserDefault set, and sent into Emission

// UI Tweaks
NSString *const AROptionsShowMartsyOnScreen = @"AROptionsShowMartsyOnScreen";

// UX changes
NSString *const AROptionsDisableNativeLiveAuctions = @"AROptionsDisableNativeLiveAuctions";
NSString *const AROptionsDebugARVIR = @"AROptionsDebugARVIR";


@implementation AROptions

// Down here is the user-facing description

+ (void)initialize
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        options = @{
          AROptionsDebugARVIR: @"Debug AR View in Room",
          AROptionsDisableNativeLiveAuctions: @"Disable Native Live Auctions",
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
