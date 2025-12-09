#import <Foundation/Foundation.h>
#import <React/RCTBridge.h>
#import <React/RCTBridgeModule.h>
#import "ARNotificationsManager.h"

@class ARTemporaryAPIModule, RCTBridge;

NS_ASSUME_NONNULL_BEGIN

extern NSString *const AREnvProduction;
extern NSString *const AREnvStaging;
extern NSString *const AREnvTest;


@interface AREmission : NSObject

@property (nonatomic, strong, readonly) RCTBridge *bridge;
@property (nonatomic, strong, readonly) ARTemporaryAPIModule *APIModule;
@property (nonatomic, strong, readonly) ARNotificationsManager *notificationsManagerModule;

+ (instancetype)sharedInstance;
+ (void)setSharedInstance:(AREmission *)instance;
+ (void)teardownSharedInstance;

- (instancetype)initWithState:(NSDictionary *)state NS_DESIGNATED_INITIALIZER;

- (void)setBridge:(RCTBridge *)bridge;
- (void)updateState:(NSDictionary *)state;
- (void)sendEvent:(NSString *)name traits:(NSDictionary *)traits;
- (void)sendScreenEvent:(NSString *)screenName traits:(NSDictionary *)traits;
- (void)sendIdentifyEvent:(NSDictionary *)traits;
- (NSString *)stateStringForKey:(NSString *)stateKey;
- (NSString *)reactStateStringForKey:(NSString *)stateKey;
- (BOOL)reactStateBoolForKey:(NSString *)stateKey;
- (void)navigate:(NSString *)route;
- (void)navigate:(NSString *)route withProps:(NSDictionary *)props;

- (NSURL *)liveAuctionsURL;
- (BOOL)isStaging;

- (instancetype)init NS_UNAVAILABLE;

- (void)reset;

@end

NS_ASSUME_NONNULL_END
