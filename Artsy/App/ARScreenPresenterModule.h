#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <UIKit/UIKit.h>

#import "ARNavigationController.h"


NS_ASSUME_NONNULL_BEGIN

@interface ARScreenPresenterModule : NSObject <RCTBridgeModule>

+ (UIViewController *)loadAuctionRegistrationWithID:(NSString *)auctionID skipBidFlow:(BOOL)skipBidFlow;

+ (ARNavigationController *)currentNavController;

@end

NS_ASSUME_NONNULL_END
