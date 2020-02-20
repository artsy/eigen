#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

typedef void(^ARUpdateNotificationsCount)(NSInteger count);

@interface ARWorksForYouModule : NSObject <RCTBridgeModule>

@property (nonatomic, copy, nullable, readwrite) ARUpdateNotificationsCount setNotificationsCount;

@end
