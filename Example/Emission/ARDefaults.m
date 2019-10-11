#import "ARDefaults.h"
#import <Foundation/Foundation.h>

NSString *const ARForceUseRNPDefault = @"ARForceUseRNPDefault";
NSString *const ARJumpStraightIntoStorybooks = @"ARJumpStraightIntoStorybooks";

NSString *const ARUseStagingDefault = @"ARUseStagingDefault";
NSString *const ARUsePREmissionDefault = @"ARUsePREmissionDefault";
NSString *const ARPREmissionIDDefault = @"ARPREmissionIDDefault";

NSString *const ARStagingAPIURLDefault = @"ARStagingAPIURLDefault";
NSString *const ARStagingWebURLDefault = @"ARStagingWebURLDefault";
NSString *const ARStagingMetaphysicsURLDefault = @"ARStagingMetaphysicsURLDefault";
NSString *const ARStagingPredictionURLDefault = @"ARStagingPredictionURLDefault";
NSString *const ARStagingVolleyURLDefault = @"ARStagingVolleyURLDefault";
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

  NSString *ipPath = [[NSBundle mainBundle] pathForResource:@"ip" ofType:@"txt"];
  NSString *ipGuess = [[NSString stringWithContentsOfFile:ipPath encoding:NSUTF8StringEncoding error:nil]
             stringByTrimmingCharactersInSet:[NSCharacterSet newlineCharacterSet]];
  NSString *host = ipGuess ? ipGuess : @"localhost";

  [[NSUserDefaults standardUserDefaults] registerDefaults:@{
    ARUseStagingDefault : @(useStagingDefault),
    ARStagingAPIURLDefault : @"https://stagingapi.artsy.net",
    ARStagingWebURLDefault : @"https://staging.artsy.net",
    ARStagingMetaphysicsURLDefault : @"https://metaphysics-staging.artsy.net/v2",
    ARStagingPredictionURLDefault : @"https://live-staging.artsy.net",
    ARStagingVolleyURLDefault : @"https://volley-staging.artsy.net/report",
    ARRNPackagerHostDefault : host,
  }];
}

+ (void)resetDefaults
{
  [[NSUserDefaults standardUserDefaults] removePersistentDomainForName:[[NSBundle mainBundle] bundleIdentifier]];
  [[NSUserDefaults standardUserDefaults] synchronize];
}

@end
