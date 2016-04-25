extern NSString *const ARUserIdentifierDefault;
extern NSString *const ARUseStagingDefault;

extern NSString *const ARStagingAPIURLDefault;
extern NSString *const ARStagingPhoneWebURLDefault;
extern NSString *const ARStagingPadWebURLDefault;
extern NSString *const ARStagingMetaphysicsURLDefault;
extern NSString *const ARStagingLiveAuctionSocketURLDefault;

extern NSString *const AROAuthTokenDefault;
extern NSString *const AROAuthTokenExpiryDateDefault;

extern NSString *const ARXAppTokenKeychainKey;
extern NSString *const ARXAppTokenExpiryDateDefault;

#pragma mark -
#pragma mark onboarding

extern NSString *const AROnboardingSkipPersonalizeDefault;
extern NSString *const AROnboardingSkipCollectorLevelDefault;
extern NSString *const AROnboardingSkipPriceRangeDefault;
extern NSString *const AROnboardingPromptThresholdDefault;

#pragma mark -
#pragma mark Things we wanna trigger server-side


@interface ARDefaults : NSObject
+ (void)setup;
+ (void)resetDefaults;
@end
