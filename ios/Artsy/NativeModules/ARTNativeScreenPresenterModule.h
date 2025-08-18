#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTTurboModule.h>
#import "ARTNativeScreenPresenterModuleSpec.h"
#endif

NS_ASSUME_NONNULL_BEGIN

#ifdef RCT_NEW_ARCH_ENABLED
@interface ARTNativeScreenPresenterModule : NSObject <NativeARTNativeScreenPresenterModuleSpec>
#else
@interface ARTNativeScreenPresenterModule : NSObject <RCTBridgeModule>
#endif

+ (UIViewController *)currentlyPresentedVC;
+ (UIViewController *)loadWebViewAuctionRegistrationWithID:(NSString *)auctionID;

@end

NS_ASSUME_NONNULL_END
