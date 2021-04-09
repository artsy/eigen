#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <UIKit/UIKit.h>
#import "ARNavigationController.h"


NS_ASSUME_NONNULL_BEGIN

@interface ARScreenPresenterModule : NSObject <RCTBridgeModule>

+ (UIViewController *)loadWebViewAuctionRegistrationWithID:(NSString *)auctionID;
+ (ARNavigationController *)getNavigationStack:(NSString *)stackID;
+ (ARNavigationController *)createNavigationStack:(NSString *)stackID rootViewController:(UIViewController *)rootViewController;
+ (void)removeNavigationStack:(NSString *)stackID;
+ (UIViewController *)currentlyPresentedVC;
+ (void)clearCachedNavigationStacks;

@end

NS_ASSUME_NONNULL_END
