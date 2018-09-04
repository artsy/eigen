#import <Foundation/Foundation.h>

extern NSString *const AROptionsAnExampleLabOption;

@interface ARLabOptions : NSObject

/// Returns all the current options
+ (NSArray *)labsOptions;
/// A subset of the above that the app should restart upon changing
+ (NSArray *)labsOptionsThatRequireRestart;

/// Get and set individual options
+ (BOOL)boolForOption:(NSString *)option;
+ (void)setBool:(BOOL)value forOption:(NSString *)option;

@end
