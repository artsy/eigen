#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

// Invoked on the main thread.
typedef void(^ARRefineSettingsTrigger)(NSDictionary *_Nonnull metadata, UIViewController *_Nonnull controller, RCTPromiseResolveBlock resolve, RCTPromiseRejectBlock reject);

@interface ARRefineOptionsModule : NSObject <RCTBridgeModule>
@property (nonatomic, copy, nullable, readwrite) ARRefineSettingsTrigger triggerRefine;
@end
