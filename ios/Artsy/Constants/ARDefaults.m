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

+ (void)resetDefaults
{
    // Need to save launch count for analytics
    NSInteger launchCount = [[NSUserDefaults standardUserDefaults] integerForKey:ARAnalyticsAppUsageCountProperty];
    
    // Preserve notification related settings
    BOOL hasSeenNotificationPrompt = [[NSUserDefaults standardUserDefaults] boolForKey:ARPushNotificationsSettingsPromptSeen];
    BOOL hasSeenNotificationDialogue = [[NSUserDefaults standardUserDefaults] boolForKey:ARPushNotificationsAppleDialogueSeen];
    BOOL userPushNotificationDecision = [[NSUserDefaults standardUserDefaults] boolForKey:ARPushNotificationsAppleDialogueRejected];
    
    [[NSUserDefaults standardUserDefaults] removePersistentDomainForName:[[NSBundle mainBundle] bundleIdentifier]];
    
    [[NSUserDefaults standardUserDefaults] setInteger:launchCount forKey:ARAnalyticsAppUsageCountProperty];
    [[NSUserDefaults standardUserDefaults] setBool:hasSeenNotificationPrompt forKey:ARPushNotificationsSettingsPromptSeen];
    [[NSUserDefaults standardUserDefaults] setBool:hasSeenNotificationDialogue forKey:ARPushNotificationsAppleDialogueSeen];
    [[NSUserDefaults standardUserDefaults] setBool:userPushNotificationDecision forKey:ARPushNotificationsAppleDialogueRejected];
    
    [[NSUserDefaults standardUserDefaults] synchronize];
}
@end
