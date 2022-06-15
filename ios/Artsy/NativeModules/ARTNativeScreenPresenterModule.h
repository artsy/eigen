#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

NS_ASSUME_NONNULL_BEGIN

@interface ARTNativeScreenPresenterModule : NSObject <RCTBridgeModule>

+ (UIViewController *)currentlyPresentedVC;
+ (UIViewController *)loadWebViewAuctionRegistrationWithID:(NSString *)auctionID;

@end

NS_ASSUME_NONNULL_END
