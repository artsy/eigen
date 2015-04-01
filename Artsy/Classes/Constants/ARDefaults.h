extern NSString *const ARUserIdentifierDefault;
extern NSString *const ARUseStagingDefault;

extern NSString *const AROAuthTokenDefault;
extern NSString *const AROAuthTokenExpiryDateDefault;

extern NSString *const ARXAppTokenDefault;
extern NSString *const ARXAppTokenExpiryDateDefault;

extern NSString *const ARHasSubmittedDeviceTokenDefault;

#pragma mark -
#pragma mark onboarding

extern NSString *const AROnboardingSkipPersonalizeDefault;
extern NSString *const AROnboardingSkipCollectorLevelDefault;
extern NSString *const AROnboardingSkipPriceRangeDefault;
extern NSString *const AROnboardingPromptThresholdDefault;

#pragma mark -
#pragma mark Things we wanna trigger server-side

extern NSString *const ARShowAuctionResultsButtonDefault;

@interface ARDefaults : NSObject
+ (void)setup;
+ (void)resetDefaults;
@end
