#import "ARDefaults.h"
#import <Foundation/Foundation.h>

NSString *const ARForceUseRNPDefault = @"ARForceUseRNPDefault";

NSString *const ARUseStagingDefault = @"ARUseStagingDefault";
NSString *const ARUsePREmissionDefault = @"ARUsePREmissionDefault";
NSString *const ARPREmissionIDDefault = @"ARPREmissionIDDefault";

NSString *const ARStagingAPIURLDefault = @"ARStagingAPIURLDefault";
NSString *const ARStagingWebURLDefault = @"ARStagingWebURLDefault";
NSString *const ARStagingMetaphysicsURLDefault = @"ARStagingMetaphysicsURLDefault";
NSString *const ARRNPackagerHostDefault = @"ARStagingRNPackagerHostDefault";


@implementation ARDefaults

+ (void)setup
{
  BOOL useStagingDefault;
#if DEBUG
  useStagingDefault = YES;
#else
  useStagingDefault = NO;
#endif

  [[NSUserDefaults standardUserDefaults] registerDefaults:@{
    ARUseStagingDefault : @(useStagingDefault),
    ARStagingAPIURLDefault : @"https://stagingapi.artsy.net",
    ARStagingWebURLDefault : @"https://staging.artsy.net",
    ARStagingMetaphysicsURLDefault : @"http://metaphysics-staging.artsy.net",
    ARRNPackagerHostDefault : @"localhost",
  }];
}

+ (void)resetDefaults
{
  [[NSUserDefaults standardUserDefaults] removePersistentDomainForName:[[NSBundle mainBundle] bundleIdentifier]];
  [[NSUserDefaults standardUserDefaults] synchronize];
}

@end
