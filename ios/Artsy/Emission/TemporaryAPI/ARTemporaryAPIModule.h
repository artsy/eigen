#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>


typedef void(^ARNotificationReadStatusAssigner)(RCTResponseSenderBlock block);

typedef void(^ARRelativeURLResolver)(NSString *path, RCTPromiseResolveBlock resolve, RCTPromiseRejectBlock reject);


/// While metaphysics is read-only, we need to rely on Eigen's
/// v1 API access to get/set these bits of information.

@interface ARTemporaryAPIModule : NSObject <RCTBridgeModule>

@property (nonatomic, copy, readwrite) ARNotificationReadStatusAssigner notificationReadStatusAssigner;

@property (nonatomic, copy, readwrite) ARRelativeURLResolver urlResolver;

@end
