#import <Foundation/Foundation.h>
#import <React/RCTBridge.h>
#import <React/RCTBridgeModule.h>
#import "ARNotificationsManager.h"

@class AREventsModule, ARSwitchBoardModule, ARTemporaryAPIModule, ARRefineOptionsModule, ARTakeCameraPhotoModule, RCTBridge, ARGraphQLQueryPreloader, ARGraphQLQueryCache;

NS_ASSUME_NONNULL_BEGIN

extern NSString *const AREnvProduction;
extern NSString *const AREnvStaging;
extern NSString *const AREnvTest;

@interface AREmission : NSObject

@property (nonatomic, strong, readonly) RCTBridge *bridge;
@property (nonatomic, strong, readonly) AREventsModule *eventsModule;
@property (nonatomic, strong, readonly) ARSwitchBoardModule *switchBoardModule;
@property (nonatomic, strong, readonly) ARTemporaryAPIModule *APIModule;
@property (nonatomic, strong, readonly) ARRefineOptionsModule *refineModule;
@property (nonatomic, strong, readonly) ARTakeCameraPhotoModule *cameraModule;
@property (nonatomic, strong, readonly) ARNotificationsManager *notificationsManagerModule;
@property (nonatomic, strong, readonly) ARGraphQLQueryPreloader *graphQLQueryPreloaderModule;
@property (nonatomic, strong, readonly) ARGraphQLQueryCache *graphQLQueryCacheModule;

+ (instancetype)sharedInstance;
+ (void)setSharedInstance:(AREmission *)instance;
+ (void)teardownSharedInstance;

- (instancetype)initWithState:(NSDictionary *)state packagerURL:(nullable NSURL *)packagerURL NS_DESIGNATED_INITIALIZER;

- (void)updateState:(NSDictionary *)state;
- (NSString *)stateStringForKey:(NSString *)stateKey;

- (instancetype)init NS_UNAVAILABLE;

- (void)reset;

@end

NS_ASSUME_NONNULL_END
