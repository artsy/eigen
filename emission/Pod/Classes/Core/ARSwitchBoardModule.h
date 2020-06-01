#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

// Invoked on the main thread.
typedef void(^ARSwitchBoardPresentViewController)(UIViewController *fromViewController, NSString * _Nonnull route);

typedef void(^ARSwitchBoardUpdateBackButton)(BOOL shouldHide);

typedef void(^ARGetSelectedTabName)(_Nonnull RCTPromiseResolveBlock resolve, _Nonnull RCTPromiseRejectBlock reject);

@interface ARSwitchBoardModule : NSObject <RCTBridgeModule>
@property (nonatomic, copy, nullable, readwrite) ARSwitchBoardPresentViewController presentNavigationViewController;
@property (nonatomic, copy, nullable, readwrite) ARSwitchBoardPresentViewController presentModalViewController;
@property (nonatomic, copy, nullable, readwrite) ARSwitchBoardUpdateBackButton updateShouldHideBackButton;
@property (nonatomic, copy, nullable, readwrite) ARGetSelectedTabName getSelectedTabName;

@end
