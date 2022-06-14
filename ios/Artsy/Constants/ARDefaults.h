#import <Foundation/Foundation.h>

extern NSString *const ARUserIdentifierDefault;

extern NSString *const AROAuthTokenDefault;
extern NSString *const AROAuthTokenExpiryDateDefault;

extern NSString *const ARXAppTokenKeychainKey;
extern NSString *const ARXAppTokenExpiryDateDefault;

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

/// Has given access to the camera for AR? nil when they've not been asked yet
extern NSString *const ARAugmentedRealityCameraAccessGiven;
/// Have they gone all the way to placing an artwork?
extern NSString *const ARAugmentedRealityHasSuccessfullyRan;
/// Have they seen the setup screen?
extern NSString *const ARAugmentedRealityHasSeenSetup;
/// Have they got past the setup screen?
extern NSString *const ARAugmentedRealityHasTriedToSetup;

@interface ARDefaults : NSObject
+ (void)resetDefaults;
@end
