#import "ARDefaults+SiteFeatures.h"
#import "ARDefaults.h"

NSString *const ARUserIdentifierDefault = @"ARUserIdentifier";
NSString *const ARUseStagingDefault = @"ARUseStagingDefault";

NSString *const ARStagingAPIURLDefault = @"ARStagingAPIURLDefault";
NSString *const ARStagingWebURLDefault = @"ARStagingWebURLDefault";
NSString *const ARStagingMetaphysicsURLDefault = @"ARStagingMetaphysicsURLDefault";
NSString *const ARStagingLiveAuctionSocketURLDefault = @"ARStagingLiveAuctionSocketURLDefault";

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
    BOOL useStagingDefault;
#if DEBUG
    useStagingDefault = YES;
#else
    useStagingDefault = NO;
#endif

    [[NSUserDefaults standardUserDefaults] registerDefaults:@{
        AROnboardingUserProgressionStage : @(0),

        ARUseStagingDefault : @(useStagingDefault),
        ARStagingAPIURLDefault : @"https://stagingapi.artsy.net",
        ARStagingWebURLDefault : @"https://staging.artsy.net",
        ARStagingMetaphysicsURLDefault : @"https://metaphysics-staging.artsy.net/v2",
        ARStagingLiveAuctionSocketURLDefault : @"wss://causality-staging.artsy.net"
    }];
}

+ (void)resetDefaults
{
    [[NSUserDefaults standardUserDefaults] removePersistentDomainForName:[[NSBundle mainBundle] bundleIdentifier]];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

@end
