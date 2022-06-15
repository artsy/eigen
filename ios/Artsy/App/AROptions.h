#import <Foundation/Foundation.h>

// All the options as consts
extern NSString *const AROptionsDebugARVIR;
extern NSString *const AROptionsDisableNativeLiveAuctions;
extern NSString *const AROptionsShowMartsyOnScreen;

@interface AROptions : NSObject

/// Returns all the current options
+ (NSArray *)labsOptions;
// For UIs
+ (NSString *)descriptionForOption:(NSString *)option;
/// A dictionary of lab options to true/false as NSNumbers for Emission basically

/// Get and set individual options
+ (BOOL)boolForOption:(NSString *)option;
+ (void)setBool:(BOOL)value forOption:(NSString *)option;
/// Gives you the ability to verify something exists

@end
