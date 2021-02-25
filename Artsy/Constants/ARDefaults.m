#import "ARDefaults+SiteFeatures.h"
#import "ARDefaults.h"
#import "AROptions.h"

NSString *const ARUserIdentifierDefault = @"ARUserIdentifier";


NSString *const ARAppleDisplayNameKeychainKey = @"ARAppleDisplayNameKeychainKey";
NSString *const ARAppleEmailKeyChainKey = @"ARAppleEmailKeyChainKey";

NSString *const ARUsernameKeychainKey = @"ARUsernameKeychainKey";
NSString *const ARPasswordKeychainKey = @"ARPasswordKeychainKey";
NSString *const AROAuthTokenDefault = @"AROAuthToken";
NSString *const AROAuthTokenExpiryDateDefault = @"AROAuthTokenExpiryDate";

// Yes, there's inconsitency here. We migrated this to keychain, but wanted
// to keep backwards compatability.
NSString *const ARXAppTokenKeychainKey = @"ARXAppTokenDefault";
NSString *const ARXAppTokenExpiryDateDefault = @"ARXAppTokenExpiryDateDefault";

NSString *const AROnboardingUserProgressionStage = @"eigen-onboard-user-progression-stage";

NSString *const ARPushNotificationsAppleDialogueSeen = @"eigen-push-seen-dialogue";
NSString *const ARPushNotificationsAppleDialogueRejected = @"eigen-push-reject-dialogue";
NSString *const ARPushNotificationsSettingsPromptSeen = @"eigen-push-seen-settings-dialogue";
NSString *const ARPushNotificationFollowArtist = @"eigen-push-followed-artist";
NSString *const ARPushNotificationsDialogueLastSeenDate = @"eigen-push-seen-dialogue-date";

NSString *const AREmissionHeadVersionDefault = @"emission-head-version";

NSString *const ARAugmentedRealityHasSeenSetup = @"ARAugmentedRealityHasSeenSetup";
NSString *const ARAugmentedRealityHasTriedToSetup = @"ARAugmentedRealityHasTriedToSetup";
NSString *const ARAugmentedRealityCameraAccessGiven = @"ARAugmentedRealityCameraAccessGiven";
NSString *const ARAugmentedRealityHasSuccessfullyRan = @"ARAugmentedRealityHasSuccessfullyRan";


@implementation ARDefaults

+ (void)setup
{
    [[NSUserDefaults standardUserDefaults] registerDefaults:@{
        AROnboardingUserProgressionStage : @(0),
    }];
}

+ (void)resetDefaults
{
    [[NSUserDefaults standardUserDefaults] removePersistentDomainForName:[[NSBundle mainBundle] bundleIdentifier]];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

@end
