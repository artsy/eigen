#import <Foundation/Foundation.h>


// All the options as consts
extern NSString *const AROptionsLoadingScreenAlpha;
extern NSString *const AROptionsUseVCR;
extern NSString *const AROptionsSettingsMenu;
extern NSString *const AROptionsTappingPartnerSendsToPartner;
extern NSString *const AROptionsShowAnalyticsOnScreen;
extern NSString *const AROptionsShowMartsyOnScreen;
extern NSString *const AROptionsDisableNativeLiveAuctions;
extern NSString *const AROptionsStagingReactEnv;
extern NSString *const AROptionsDevReactEnv;
extern NSString *const AROptionFeedbackLiveAuction;

@interface AROptions : NSObject

/// Returns all the current options
+ (NSArray *)labsOptions;
+ (NSArray *)labsOptionsThatRequireRestart;

/// Get and set individual options
+ (BOOL)boolForOption:(NSString *)option;
+ (void)setBool:(BOOL)value forOption:(NSString *)option;

@end
