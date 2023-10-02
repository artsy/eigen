#import "ARDefaults.h"
#import "AROptions.h"
#import "ARAnalyticsConstants.h"

NSString *const ARUserIdentifierDefault = @"ARUserIdentifier";

NSString *const AROAuthTokenDefault = @"AROAuthToken";
NSString *const AROAuthTokenExpiryDateDefault = @"AROAuthTokenExpiryDate";

// Yes, there's inconsitency here. We migrated this to keychain, but wanted
// to keep backwards compatability.
NSString *const ARXAppTokenKeychainKey = @"ARXAppTokenDefault";
NSString *const ARXAppTokenExpiryDateDefault = @"ARXAppTokenExpiryDateDefault";

NSString *const ARAugmentedRealityHasSeenSetup = @"ARAugmentedRealityHasSeenSetup";
NSString *const ARAugmentedRealityHasTriedToSetup = @"ARAugmentedRealityHasTriedToSetup";
NSString *const ARAugmentedRealityCameraAccessGiven = @"ARAugmentedRealityCameraAccessGiven";
NSString *const ARAugmentedRealityHasSuccessfullyRan = @"ARAugmentedRealityHasSuccessfullyRan";


@implementation ARDefaults

+ (void)resetDefaults
{
    // Need to save launch count for analytics
    NSInteger launchCount = [[NSUserDefaults standardUserDefaults] integerForKey:ARAnalyticsAppUsageCountProperty];
    
    [[NSUserDefaults standardUserDefaults] removePersistentDomainForName:[[NSBundle mainBundle] bundleIdentifier]];
    [[NSUserDefaults standardUserDefaults] setInteger:launchCount forKey:ARAnalyticsAppUsageCountProperty];
    [[NSUserDefaults standardUserDefaults] synchronize];
}
@end
