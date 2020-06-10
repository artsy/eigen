#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

// Invoked on the main thread.
typedef void(^ARSwitchBoardPresentViewController)(UIViewController *fromViewController, NSString * _Nonnull route);

typedef void(^ARSwitchBoardUpdateBackButton)(BOOL shouldHide);
typedef void(^ARSwitchBoardRegisterRoute)(NSString * _Nonnull route, NSString * _Nonnull componentName);

@interface ARSwitchBoardModule : NSObject <RCTBridgeModule>
@property (nonatomic, copy, nullable, readwrite) ARSwitchBoardPresentViewController presentNavigationViewController;
@property (nonatomic, copy, nullable, readwrite) ARSwitchBoardPresentViewController presentModalViewController;
@property (nonatomic, copy, nullable, readwrite) ARSwitchBoardUpdateBackButton updateShouldHideBackButton;
@property (nonatomic, copy, nullable, readwrite) ARSwitchBoardRegisterRoute registerRoute;
@end
