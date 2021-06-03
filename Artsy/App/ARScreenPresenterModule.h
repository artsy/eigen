#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <UIKit/UIKit.h>
#import "ARNavigationController.h"


NS_ASSUME_NONNULL_BEGIN

@interface ARScreenPresenterModule : NSObject <RCTBridgeModule>

+ (UIViewController *)loadWebViewAuctionRegistrationWithID:(NSString *)auctionID;
+ (UIViewController *)currentlyPresentedVC;

@end

NS_ASSUME_NONNULL_END
