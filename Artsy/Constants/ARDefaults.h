extern NSString *const ARUserIdentifierDefault;
extern NSString *const ARUseStagingDefault;

extern NSString *const ARStagingAPIURLDefault;
extern NSString *const ARStagingWebURLDefault;
extern NSString *const ARStagingMetaphysicsURLDefault;
extern NSString *const ARStagingLiveAuctionSocketURLDefault;

extern NSString *const AROAuthTokenDefault;
extern NSString *const AROAuthTokenExpiryDateDefault;

extern NSString *const ARXAppTokenKeychainKey;
extern NSString *const ARXAppTokenExpiryDateDefault;

#pragma mark -
#pragma mark onboarding

extern NSString *const AROnboardingUserProgressionStage;

typedef NS_ENUM(NSInteger, AROnboardingUserProgressStage) {
    AROnboardingStageDefault,
    AROnboardingStageOnboarding,
    AROnboardingStageOnboarded
};


#pragma mark -
#pragma mark push notifications

extern NSString *const ARPushNotificationsAppleDialogueSeen;
extern NSString *const ARPushNotificationsAppleDialogueRejected;
extern NSString *const ARPushNotificationsSettingsPromptSeen;
extern NSString *const ARPushNotificationFollowArtist;
extern NSString *const ARPushNotificationsDialogueLastSeenDate;

#pragma mark -
#pragma mark admin features

extern NSString *const AREmissionHeadVersionDefault;

#pragma mark -
#pragma mark user permissions

extern NSString *const ARAugmentedRealityCameraAccessGiven;
extern NSString *const ARAugmentedRealityHasSuccessfullyRan;


@interface ARDefaults : NSObject
+ (void)setup;
+ (void)resetDefaults;
@end
