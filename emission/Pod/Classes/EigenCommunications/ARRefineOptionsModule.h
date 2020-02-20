#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

// Invoked on the main thread.
typedef void(^ARRefineSettingsTrigger)(NSDictionary *_Nonnull initial, NSDictionary *_Nonnull current, UIViewController *_Nonnull controller, _Nonnull RCTPromiseResolveBlock resolve, _Nonnull RCTPromiseRejectBlock reject);

@interface ARRefineOptionsModule : NSObject <RCTBridgeModule>
@property (nonatomic, copy, nullable, readwrite) ARRefineSettingsTrigger triggerRefine;
@end
