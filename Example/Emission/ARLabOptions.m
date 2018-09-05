
#import "ARLabOptions.h"

NSString *const AROptionsAnExampleLabOption = @"An Example Lab Option";

@implementation ARLabOptions

+ (NSArray *)labsOptions
{
  return @[
    AROptionsAnExampleLabOption,
  ];
}

+ (NSArray *)labsOptionsThatRequireRestart
{
  return @[];
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
