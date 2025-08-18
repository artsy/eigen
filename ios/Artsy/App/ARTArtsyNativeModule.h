#import <React/RCTBridgeModule.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTTurboModule.h>
#import <react/renderer/components/rncore/ComponentDescriptors.h>
#import <react/renderer/components/rncore/EventEmitters.h>
#import <react/renderer/components/rncore/Props.h>
#import <react/renderer/components/rncore/RCTComponentViewHelpers.h>
#import "ArtsyNativeModuleSpec.h"
#endif

NS_ASSUME_NONNULL_BEGIN

#ifdef RCT_NEW_ARCH_ENABLED
@interface ARTArtsyNativeModule : NSObject <NativeArtsyNativeModuleSpec>
#else
@interface ARTArtsyNativeModule : NSObject <RCTBridgeModule>
#endif

@end

NS_ASSUME_NONNULL_END
