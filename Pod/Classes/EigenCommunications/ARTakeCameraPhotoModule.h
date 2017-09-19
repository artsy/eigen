#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

// Invoked on the main thread.
typedef void(^ARTakePhotoTrigger)(UIViewController *_Nonnull controller, _Nonnull RCTPromiseResolveBlock resolve, _Nonnull RCTPromiseRejectBlock reject);


@interface ARTakeCameraPhotoModule : NSObject <RCTBridgeModule>

@property (nonatomic, copy, nullable, readwrite) ARTakePhotoTrigger triggerCreatingACameraPhoto;

@end
