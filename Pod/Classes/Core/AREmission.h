#import <Foundation/Foundation.h>

@class AREventsModule, ARSwitchBoardModule, ARTemporaryAPIModule, ARRefineOptionsModule, ARWorksForYouModule, ARTakeCameraPhotoModule, RCTBridge;

NS_ASSUME_NONNULL_BEGIN

@interface AREmission : NSObject

@property (nonatomic, strong, readonly) RCTBridge *bridge;
@property (nonatomic, strong, readonly) AREventsModule *eventsModule;
@property (nonatomic, strong, readonly) ARSwitchBoardModule *switchBoardModule;
@property (nonatomic, strong, readonly) ARTemporaryAPIModule *APIModule;
@property (nonatomic, strong, readonly) ARRefineOptionsModule *refineModule;
@property (nonatomic, strong, readonly) ARWorksForYouModule *worksForYouModule;
@property (nonatomic, strong, readonly) ARTakeCameraPhotoModule *cameraModule;

+ (instancetype)sharedInstance;
+ (void)setSharedInstance:(AREmission *)instance;

- (instancetype)initWithUserID:(NSString *)userID
           authenticationToken:(NSString *)authenticationToken;

- (instancetype)initWithUserID:(NSString *)userID
           authenticationToken:(NSString *)authenticationToken
                   packagerURL:(nullable NSURL *)packagerURL
         useStagingEnvironment:(BOOL)useStagingEnvironmen;

- (instancetype)initWithUserID:(NSString *)userID
           authenticationToken:(NSString *)authenticationToken
                   packagerURL:(nullable NSURL *)packagerURL
         useStagingEnvironment:(BOOL)useStagingEnvironment
                     sentryDSN:(nullable NSString *)sentryDSN NS_DESIGNATED_INITIALIZER;

- (instancetype)init NS_UNAVAILABLE;

@end

NS_ASSUME_NONNULL_END
