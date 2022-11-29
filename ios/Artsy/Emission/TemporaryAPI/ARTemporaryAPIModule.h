#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>


typedef void(^ARNotificationReadStatusAssigner)(RCTResponseSenderBlock block);

typedef void(^ARNotificationPermissionsPrompter)();

typedef void(^ARRelativeURLResolver)(NSString *path, RCTPromiseResolveBlock resolve, RCTPromiseRejectBlock reject);


/// While metaphysics is read-only, we need to rely on Eigen's
/// v1 API access to get/set these bits of information.

@interface ARTemporaryAPIModule : NSObject <RCTBridgeModule>


// Just shows the apple dialog, used for explicitly asking permission in settings
@property (nonatomic, copy, readwrite) ARNotificationPermissionsPrompter directNotificationPermissionPrompter;

@property (nonatomic, copy, readwrite) ARNotificationReadStatusAssigner notificationReadStatusAssigner;

@property (nonatomic, copy, readwrite) ARRelativeURLResolver urlResolver;

@end
