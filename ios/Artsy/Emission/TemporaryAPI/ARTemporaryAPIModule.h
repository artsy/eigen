#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>


typedef void(^ARNotificationReadStatusAssigner)(RCTResponseSenderBlock block);

typedef void(^ARNotificationPermissionsPrompter)();

@interface ARTemporaryAPIModule : NSObject <RCTBridgeModule>

// Just shows the apple dialog, used for explicitly asking permission in settings
@property (nonatomic, copy, readwrite) ARNotificationPermissionsPrompter directNotificationPermissionPrompter;

@property (nonatomic, copy, readwrite) ARNotificationReadStatusAssigner notificationReadStatusAssigner;

@end
