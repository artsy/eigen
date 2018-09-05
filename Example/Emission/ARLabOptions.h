#import <Foundation/Foundation.h>

extern NSDictionary *AROptionsAnExampleLabOption;

@interface ARLabOptions : NSObject

/// Returns all the current options
+ (NSArray *)labsOptions;
/// A subset of the above that the app should restart upon changing
+ (NSArray *)labsOptionsThatRequireRestart;
/// A dictionary of lab options to true/false as NSNumbers
+ (NSDictionary *)labOptionsMap;
/// So we can provide a UI
+ (NSString *)descriptionForOption:(NSString *)option;

/// Get and set individual options
+ (BOOL)boolForOption:(NSString *)option;
+ (void)setBool:(BOOL)value forOption:(NSString *)option;

@end
