#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>


// These state values are sent to react from obj-c
@interface ARStateKey : NSObject
+ (NSString *)userID;
+ (NSString *)authenticationToken;
+ (NSString *)launchCount;
+ (NSString *)userEmail;
+ (NSString *)userAgent;
@end

// these state values are sent to obj-c from react
@interface ARReactStateKey : NSObject
+ (NSString *)gravityURL;
+ (NSString *)metaphysicsURL;
+ (NSString *)predictionURL;
+ (NSString *)webURL;
+ (NSString *)causalityURL;
+ (NSString *)env;
+ (NSString *)userIsDev;
@end

@interface ARNotificationsManager : RCTEventEmitter <RCTBridgeModule>

- (instancetype)initWithState:(NSDictionary *)state;
- (void)updateState:(NSDictionary *)state;
- (void)sendEvent:(NSDictionary *)traits;
- (void)sendIdentifyEvent:(NSDictionary *)traits;
- (NSDictionary *)state;
- (NSDictionary *)reactState;

- (void)notificationReceived;
- (void)notificationReceivedWithPayload:(NSDictionary *)payload;

- (void)modalDismissed;

// this is exported only for tests
- (void)updateReactState:(NSDictionary *)reactState;

- (void)requestNavigation:(NSString *)route;
- (void)requestNavigation:(NSString *)route withProps:(NSDictionary *)props;
- (void)requestModalDismiss;
- (void)afterBootstrap:(void (^)(void))completion;

@end
