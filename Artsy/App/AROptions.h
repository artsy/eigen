#import <Foundation/Foundation.h>


// All the options as consts
extern NSString *const AROptionsBidManagement;
extern NSString *const AROptionsDebugARVIR;
extern NSString *const AROptionsDevReactEnv;
extern NSString *const AROptionsDisableNativeLiveAuctions;
extern NSString *const AROptionsEnableMyCollection;
extern NSString *const AROptionsLoadingScreenAlpha;
extern NSString *const AROptionsPriceTransparency;
extern NSString *const AROptionsShowAnalyticsOnScreen;
extern NSString *const AROptionsShowMartsyOnScreen;
extern NSString *const AROptionsStagingReactEnv;
extern NSString *const AROptionsTappingPartnerSendsToPartner;
extern NSString *const AROptionsArtistSeries;
extern NSString *const AROptionsNewSalePage;
extern NSString *const AROptionsNewFirstInquiry;
extern NSString *const AROptionsUseReactNativeWebView;
extern NSString *const AROptionsNewShowPage;
extern NSString *const AROptionsNewFairPage;


@interface AROptions : NSObject

/// Returns all the current options
+ (NSArray *)labsOptions;
// Special cases
+ (NSArray *)labsOptionsThatRequireRestart;
// For UIs
+ (NSString *)descriptionForOption:(NSString *)option;
/// A dictionary of lab options to true/false as NSNumbers for Emission basically
+ (NSDictionary *)labOptionsMap;

/// Get and set individual options
+ (BOOL)boolForOption:(NSString *)option;
+ (void)setBool:(BOOL)value forOption:(NSString *)option;
/// Gives you the ability to verify something exists
+ (BOOL)optionExists:(NSString *)option;


@end
