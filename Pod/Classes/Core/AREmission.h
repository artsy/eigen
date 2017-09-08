#import <Foundation/Foundation.h>
#import <React/RCTBridge.h>
#import <React/RCTBridgeModule.h>

@class AREventsModule, ARSwitchBoardModule, ARTemporaryAPIModule, ARRefineOptionsModule, ARWorksForYouModule, ARTakeCameraPhotoModule, RCTBridge;

NS_ASSUME_NONNULL_BEGIN

/// A configuration object for running Emission
@interface AREmissionConfiguration : NSObject <RCTBridgeModule>

// Pre-requisites for Emission to work
@property (nonatomic, copy, readonly) NSString *userID;
@property (nonatomic, copy, readonly) NSString *authenticationToken;

// ENV Variables
@property (nonatomic, copy, readonly, nullable) NSString *sentryDSN;
@property (nonatomic, copy, readonly, nullable) NSString *googleMapsAPIKey;

// Server configuration
@property (nonatomic, copy, readonly) NSString *gravityAPIHost;
@property (nonatomic, copy, readonly) NSString *metaphysicsAPIHost;

- (instancetype)init NS_UNAVAILABLE;
+ (instancetype)new NS_UNAVAILABLE;


// Forces us to always include all properties
- (instancetype)initWithUserID:(NSString *)userID
           authenticationToken:(NSString *)token
                     sentryDSN:(nullable NSString *)sentryDSN
              googleMapsAPIKey:(nullable NSString *)googleAPIKey
                   gravityHost:(NSString *)gravity
               metaphysicsHost:(NSString *)metaphysics;
@end


@interface AREmission : NSObject

@property (nonatomic, strong, readonly) RCTBridge *bridge;
@property (nonatomic, strong, readonly) AREventsModule *eventsModule;
@property (nonatomic, strong, readonly) ARSwitchBoardModule *switchBoardModule;
@property (nonatomic, strong, readonly) ARTemporaryAPIModule *APIModule;
@property (nonatomic, strong, readonly) ARRefineOptionsModule *refineModule;
@property (nonatomic, strong, readonly) ARWorksForYouModule *worksForYouModule;
@property (nonatomic, strong, readonly) ARTakeCameraPhotoModule *cameraModule;

@property (nonatomic, strong, readwrite) AREmissionConfiguration *configurationModule;

+ (instancetype)sharedInstance;
+ (void)setSharedInstance:(AREmission *)instance;

- (instancetype)initWithConfiguration:(AREmissionConfiguration *)config packagerURL:(nullable NSURL *)packagerURL NS_DESIGNATED_INITIALIZER;

- (instancetype)init NS_UNAVAILABLE;

@end

NS_ASSUME_NONNULL_END
