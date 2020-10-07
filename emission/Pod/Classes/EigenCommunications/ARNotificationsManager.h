#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>


@interface ARStateKey : NSObject
+ (NSString *)selectedTab;
+ (NSString *)userID;
+ (NSString *)authenticationToken;
+ (NSString *)launchCount;
+ (NSString *)onboardingState;

+ (NSString *)gravityURL;
+ (NSString *)metaphysicsURL;
+ (NSString *)predictionURL;
+ (NSString *)webURL;
+ (NSString *)userAgent;
+ (NSString *)options;

+ (NSString *)legacyFairSlugs;
+ (NSString *)legacyFairProfileSlugs;

+ (NSString *)env;
+ (NSString *)deviceId;

+ (NSString *)stripePublishableKey;
+ (NSString *)sentryDSN;
@end


@interface ARNotificationsManager : RCTEventEmitter <RCTBridgeModule>

- (instancetype)initWithState:(NSDictionary *)state;
- (void)updateState:(NSDictionary *)state;
- (NSDictionary *)state;

- (void)notificationReceived;
- (void)reset;
- (void)requestNavigation:(NSString *)route;

@end
