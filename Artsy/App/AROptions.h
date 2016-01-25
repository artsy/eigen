// All the options as consts
extern NSString *const AROptionsLoadingScreenAlpha;
extern NSString *const AROptionsUseVCR;
extern NSString *const AROptionsSettingsMenu;
extern NSString *const AROptionsTappingPartnerSendsToPartner;
extern NSString *const AROptionsUseNativeAuctions;


@interface AROptions : NSObject

/// Returns all the current options
+ (NSArray *)labsOptions;

/// Get and set individual options
+ (BOOL)boolForOption:(NSString *)option;
+ (void)setBool:(BOOL)value forOption:(NSString *)option;

@end
