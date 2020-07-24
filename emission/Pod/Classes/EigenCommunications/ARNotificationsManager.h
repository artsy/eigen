#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface ARNotificationsManager : RCTEventEmitter <RCTBridgeModule>

- (void) selectedTabChanged:(NSString *)selectedTab;
- (void) notificationReceived;
- (void) emissionOptionsChanged:(NSDictionary *)options;

@end
