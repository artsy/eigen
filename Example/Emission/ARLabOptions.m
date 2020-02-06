
#import "ARLabOptions.h"

static NSDictionary *options = nil;

@implementation ARLabOptions

+ (void)initialize
{
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    //
    // The keys in this hash are how you can access the value in Emission code:
    //
    // import { options } from "lib/options"
    //
    // if (options.example) {
    //   [something]
    //
    //
    // Then in your test files, you can use jest to mock "lib/options" with your own
    // object.
    //
    options = @{
       @"AROptionsPriceTransparency": @"Price transparency",
       @"AROptionsLotConditionReport": @"Lot Condition Report"
       @"AROptionsFilterCollectionsArtworks": @"Filter Collections Artworks"

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
