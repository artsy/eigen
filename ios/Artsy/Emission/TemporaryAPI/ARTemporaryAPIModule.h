#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>


typedef void(^ARNotificationReadStatusAssigner)(RCTResponseSenderBlock block);

@interface ARTemporaryAPIModule : NSObject <RCTBridgeModule>

@property (nonatomic, copy, readwrite) ARNotificationReadStatusAssigner notificationReadStatusAssigner;

@end
